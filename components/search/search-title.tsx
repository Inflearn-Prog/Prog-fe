const MAX_SEARCH_LENGTH = 30;

export function SearchTitle({
  search = "",
  searchLength = 0,
}: {
  search?: string;
  searchLength?: number;
}) {
  const displaySearch =
    search.length > MAX_SEARCH_LENGTH
      ? `${search.slice(0, MAX_SEARCH_LENGTH)}...`
      : search;

  if (!search || searchLength === 0) {
    return <h3 className="text-gray-950 min-w-0">검색 결과가 없습니다.</h3>;
  }
  return (
    <h3 className="text-gray-950 break-all">
      <span className="text-prog-600">'{displaySearch}'</span>에 대한 총{" "}
      {searchLength}
      건의 결과가 있습니다.
    </h3>
  );
}
