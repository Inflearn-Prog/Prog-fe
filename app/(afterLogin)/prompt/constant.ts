// 백엔드 제약과 짝을 이루는 상수. 한쪽만 바뀌면 "카운터는 정상인데 400"(P2-18)이 재발한다.
//
//   PromptCreateRequest.title    @NotBlank @Size(max = 200)
//   PromptCreateRequest.content  @NotBlank @PlainTextLength(max = 5000) @ByteLength(max = 60000)
//   PromptCommentRequest.comment @NotBlank @Size(max = 255)
//
// 값은 항상 "백엔드가 받아주는 범위 안쪽"으로 잡는다. 프론트가 더 느슨하면 사용자는
// 작성 버튼을 누른 뒤에야 400 을 보고, 쓰던 글을 잃는다.
export const MAX_BOARD_TITLE_LENGTH = 200;
export const MAX_BOARD_CONTENT_LENGTH = 5000;
/** 서식·이미지까지 포함한 원문의 UTF-8 바이트 상한 (BE `@ByteLength(max = 60000)`). */
export const MAX_BOARD_CONTENT_BYTES = 60000;
export const MAX_COMMENT_LENGTH = 255;
/** 신고 상세 사유 (BE `ReportCreateRequest.reasonDetail` `@Size(max = 200)`). */
export const MAX_REPORT_DETAIL_LENGTH = 200;
