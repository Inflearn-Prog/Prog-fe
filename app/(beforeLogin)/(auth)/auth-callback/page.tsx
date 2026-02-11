import { AuthStatusGuard } from "./AuthStatusGuard";

export default function AuthCallbackPage() {
  return (
    <AuthStatusGuard>
      <div> 인증이 완료 되었습니다. </div>
    </AuthStatusGuard>
  );
}
