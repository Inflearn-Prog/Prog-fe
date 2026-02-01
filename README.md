## 라우팅 가이드

이 프로젝트는 Next.js 앱 라우터를 사용하여 라우팅을 처리합니다. `app/` 폴더의 폴더 구조가 라우트를 결정합니다.

### 라우트 트리

```
/
├── / (app/page.tsx) - 루트 페이지
├── /(beforeLogin)
│   ├── /lending (app/(beforeLogin)/lending/page.tsx) - 로그인 전 랜딩 페이지
│   └── /(auth)
│       ├── /signin (app/(beforeLogin)/(auth)/signin/page.tsx) - 로그인 페이지
│       └── /signup (app/(beforeLogin)/(auth)/signup/page.tsx) - 회원가입 페이지
├── /(afterLogin)
│   ├── /mypage (app/(afterLogin)/mypage/page.tsx) - 마이페이지
│   ├── /(dashboard)
│   │   ├── / (app/(afterLogin)/(dashboard)/page.tsx) - 대시보드 홈
│   │   ├── /community (app/(afterLogin)/(dashboard)/community/page.tsx) - 커뮤니티 페이지
│   │   ├── /rank (app/(afterLogin)/(dashboard)/rank/page.tsx) - 랭킹 페이지
│   │   └── /(search)
│   │       └── / (app/(afterLogin)/(dashboard)/(search)/page.tsx) - 검색 페이지
│   └── /(admin)
│       └── / (app/(afterLogin)/(admin)/layout.tsx) - 관리자 레이아웃 (page.tsx 없음)
├── /api
│   └── /auth/[...nextauth] (app/api/auth/[...nextauth]/route.ts) - NextAuth API 라우트
└── 기타 폴더 (providers, store, styles 등) - 라우트 아님
```

### 참고 사항

- 괄호 `()`로 묶인 폴더는 라우트 그룹으로, URL 경로에 영향을 주지 않습니다.
- `layout.tsx` 파일은 세그먼트에 대한 공유 UI를 제공합니다.
- `page.tsx` 파일은 라우트의 UI를 정의합니다.
- `route.ts` 파일은 API 라우트를 처리합니다.
- 동적 라우트는 `[param]` 또는 `[...param]` 구문을 사용합니다.
