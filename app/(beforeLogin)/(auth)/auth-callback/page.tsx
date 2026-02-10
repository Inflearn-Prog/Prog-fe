import { AuthStatusGuard } from "./AuthStatusGuard";

export default function AuthCallbackPage() {
  return (
    <AuthStatusGuard>
      <div />
    </AuthStatusGuard>
  );
}
