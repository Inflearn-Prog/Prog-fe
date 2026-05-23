import BoardNavigate from "../board-navigate";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <BoardNavigate />
      {children}
    </div>
  );
}
