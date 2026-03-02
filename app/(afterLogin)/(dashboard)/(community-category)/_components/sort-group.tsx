"use client";

export default function SortGroup() {
  return (
    <div className="flex items-start gap-x-1">
      <button className="">
        <span className="whitespace-nowrap">시간순</span>
      </button>
      |
      <button className="">
        <span className="whitespace-nowrap">인기순</span>
      </button>
    </div>
  );
}
