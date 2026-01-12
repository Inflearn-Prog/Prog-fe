export function SearchTitle({
  search = "",
  searchLength = 0,
}: {
  search?: string;
  searchLength?: number;
}) {
  return (
    <h3 className="text-gray-950">
      <span className="text-prog-600">'{search}'</span>에 대한 총 {searchLength}
      건의 결과가 있습니다.
    </h3>
  );
}
