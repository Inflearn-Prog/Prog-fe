// 마크다운 렌더 골든 스냅샷 — 러너 의존성 0 (Node 22.12+ TS 스트립으로 직접 실행).
//   node tests/md-golden.mts            골든과 비교, 다르면 exit 1
//   node tests/md-golden.mts --update   골든 갱신
// 출력은 renderContent() 반환값(= DOMPurify.sanitize 후)으로 고정한다 — 지시문 §7.
// devNyan 골든과 달리 PROG 는 sanitize 한 겹이 더 있고, 조용히 달라지는 건 대개 그쪽이다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

// render.ts 의 DOMPurify 가 이 window 에 바인딩되도록, render.ts import 전에 전역 세팅.
const { window } = new JSDOM("");
const g = globalThis as unknown as { window: unknown; document: unknown };
g.window = window;
g.document = window.document;

const { renderContent } = await import("../lib/markdown/render.ts");

// 반드시 넣을 입력 — 지시문 §7.
const INPUTS: Record<string, string> = {
  "01-heading": "## 헤딩", // N-18 회귀 가드
  "02-list": "- 항목\n1. 항목", // Quill 에서 유일하게 되던 것
  "03-cjk-bold": "**주의(중요)**사항입니다", // §5-② CJK 회귀 가드
  "04-soft-break": "첫 줄\n둘째 줄", // breaks:true → <br>
  "05-xss-script": "<script>alert(1)</script>", // sanitize 회귀 가드
  "06-xss-img": "<img src=x onerror=alert(1)>", // sanitize 회귀 가드
  "07-angle-inline": "if (x < 10) return;", // 인라인 < 가 렌더에서 살아남는지
  "08-legacy-html": "<p>안녕하세요</p><p>두번째 <strong>문단</strong></p>", // 감지분기가 통과시키는지
  "09-code": "```js\nconst a = 1;\n```\n인라인 `code` 도", // 코드펜스+인라인
  "10-table": "| a | b |\n|---|---|\n| 1 | 2 |", // GFM 표
};

const results: Record<string, string> = {};
for (const [k, v] of Object.entries(INPUTS)) results[k] = renderContent(v);

const GOLDEN = fileURLToPath(new URL("./md-golden.json", import.meta.url));
const update = process.argv.includes("--update");

if (update) {
  writeFileSync(GOLDEN, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`골든 갱신 (${Object.keys(results).length}케이스): ${GOLDEN}`);
  process.exit(0);
}

if (!existsSync(GOLDEN)) {
  console.error(`골든 없음. 먼저 'node tests/md-golden.mts --update' 로 생성.`);
  process.exit(2);
}

const golden: Record<string, string> = JSON.parse(readFileSync(GOLDEN, "utf8"));
let fail = 0;
for (const k of Object.keys(INPUTS)) {
  if (results[k] !== golden[k]) {
    fail++;
    console.error(`✗ ${k}\n  입력: ${JSON.stringify(INPUTS[k])}\n  기대: ${JSON.stringify(golden[k])}\n  실제: ${JSON.stringify(results[k])}`);
  }
}
for (const k of Object.keys(golden)) {
  if (!(k in INPUTS)) {
    fail++;
    console.error(`✗ ${k} (골든에만 존재 — 케이스 삭제됨)`);
  }
}
if (fail) {
  console.error(`\n${fail}건 불일치. 의도된 변경이면 --update.`);
  process.exit(1);
}
console.log(`✓ ${Object.keys(INPUTS).length}케이스 통과`);
