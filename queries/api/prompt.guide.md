# Prompt API Specification Guide

프롬프트(`Prompt`) 도메인과 관련된 모든 API 명세입니다. 사용자용 서비스와 관리자용 서비스로 나누어 정리되었습니다.

---

## 1. 프롬프트 게시글 관리 (User)
**Base Path:** `/prompts`

| 기능 | Method | Path | 설명 |
| :--- | :---: | :--- | :--- |
| 프롬프트 생성 | `POST` | `/` | 새로운 프롬프트 게시글을 생성합니다. |
| 프롬프트 상세 조회 | `GET` | `/{promptId}` | 특정 프롬프트의 상세 내용을 조회합니다. |
| 프롬프트 목록 조회 | `GET` | `/` | 프롬프트 목록을 페이징하여 조회합니다. (기본 20개) |
| 프롬프트 수정 | `PUT` | `/{promptId}` | 본인이 작성한 프롬프트 게시글을 수정합니다. |
| 프롬프트 삭제 | `DELETE` | `/{promptId}` | 본인이 작성한 프롬프트 게시글을 삭제합니다. |

### 주요 데이터 구조
- **PromptCreateRequest**
  - `categoryId` (Long, 필수): 카테고리 ID
  - `title` (String, 필수): 제목 (최대 200자)
  - `content` (String, 필수): 내용 (최대 5000자)
- **PromptResponse**
  - `promptId`, `userId`, `category`, `title`, `content`, `createdAt`, `updatedAt`

---

## 2. 프롬프트 조회 및 검색 (User)
**Base Path:** `/prompts`

| 기능 | Method | Path | 설명 |
| :--- | :---: | :--- | :--- |
| 최신순 조회 | `GET` | `/createDesc` | 최신 생성일 순으로 프롬프트를 조회합니다. |
| 좋아요순 조회 | `GET` | `/likeDesc` | 좋아요가 많은 순으로 프롬프트를 조회합니다. |
| 오늘 핫한 프롬프트 | `GET` | `/today-hot` | 금일 가장 많은 좋아요를 받은 프롬프트 목록을 조회합니다. |
| 제목 검색 | `GET` | `/search/{keyword}` | 키워드를 포함하는 제목의 프롬프트를 검색합니다. |
| 좋아요/취소 | `POST` | `/{promptId}/like` | 프롬프트에 좋아요를 누르거나 취소합니다. (Toggle) |

---

## 3. 프롬프트 댓글 관리 (User)
**Base Path:** `/api/v1/comment`

| 기능 | Method | Path | 설명 |
| :--- | :---: | :--- | :--- |
| 댓글 작성 | `POST` | `/{promptId}` | 특정 프롬프트에 댓글을 작성합니다. |
| 대댓글 작성 | `POST` | `/{promptId}/{commentId}` | 특정 댓글에 대한 답글(대댓글)을 작성합니다. |
| 댓글 수정 | `PATCH` | `/{commentId}` | 본인이 작성한 댓글 내용을 수정합니다. |
| 댓글 삭제 | `DELETE` | `/{commentId}` | 본인이 작성한 댓글을 삭제합니다. |
| 댓글 목록 조회 | `GET` | `/{promptId}` | 해당 프롬프트의 모든 댓글을 조회합니다. |

### 주요 데이터 구조
- **PromptCommentRequest**
  - `comment` (String): 댓글 내용
- **PromptCommentResponse**
  - `commentId`, `nickName`, `comment`, `parentId`, `createdAt`, `updatedAt`

---

## 4. 프롬프트 관리 (Admin)
**Base Path:** `/admin/prompts`

| 기능 | Method | Path | 설명 |
| :--- | :---: | :--- | :--- |
| 프롬프트 목록 조회 | `GET` | `/` | 키워드, 카테고리, 상태별 필터링을 포함한 목록 조회 |
| 대량 상태 수정 | `PATCH` | `/bulk-update` | 여러 프롬프트의 카테고리나 상태를 일괄 수정합니다. |
| 대량 삭제 | `DELETE` | `/bulk` | 여러 프롬프트 게시글을 일괄 삭제합니다. |

### 주요 데이터 구조
- **AdminPromptRequest.BulkUpdateRequest**
  - `promptIds` (List<Long>): 수정할 프롬프트 ID 목록
  - `updateFields`: `categoryId`, `status`(PromptStatus)

---

## 공통 응답 구조 (`ApiResponse`)
모든 API 응답은 아래와 같은 공통 포맷으로 반환됩니다.

```json
{
  "status": "SUCCESS",
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```
