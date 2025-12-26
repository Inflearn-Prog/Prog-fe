// 작성날짜: 2025년 12월 23일
// 파일명: eslint.config.mjs
// ESLint 공식문서: https://eslint.org/docs/latest/use/configure/configuration-files-new

import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import jsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";
import react from "eslint-plugin-react"; // 추가: React 플러그인 import
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

// 상수 분리
const PRETTIER_OPTIONS = { endOfLine: "auto" };
const UNUSED_VARS_OPTIONS = {
  vars: "all",
  varsIgnorePattern: "^_",
  args: "after-used",
  argsIgnorePattern: "^_",
};

const eslintConfig = [
  // 기본 JavaScript 규칙
  js.configs.recommended,

  // TypeScript 규칙
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off", // unused-imports로 대체
    },
  },

  // React/Next.js 규칙 (수동 추가)
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: prettier,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      "jsx-a11y": jsxA11y,
      security: security,
      react: react, // 추가: React 플러그인
    },
    rules: {
      // Prettier 통합
      "prettier/prettier": ["error", PRETTIER_OPTIONS],

      // 사용하지 않는 import 자동 제거
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", UNUSED_VARS_OPTIONS],

      // Import 순서 정렬
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // React 컴포넌트 셀프 클로징
      "react/self-closing-comp": "error",

      // 접근성(a11y) 개선
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // 보안: 잠재적 XSS 방지
      "react/no-danger": "error",
      "no-eval": "error",
      "security/detect-object-injection": "error",
      "security/detect-eval-with-expression": "error",

      // 코드 품질
      "no-console": "warn",

      // Next.js 최적화
      "no-undef": "off",
    },
    ignores: [
      "node_modules/",
      ".next/",
      "build/",
      "dist/",
      "*.log",
      ".eslintcache",
      "coverage/",
      "*.json",
      "*.md",
      "*.yml",
      "*.yaml",
    ],
  },
];

export default eslintConfig;
