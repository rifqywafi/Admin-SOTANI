interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages: number[] = [];
  let start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);

  if (end - start < 2) {
    start = Math.max(1, end - 2);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Halaman {currentPage} dari {totalPages}
      </div>

      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {pages.map((num) => (
          <button
            key={num}
            className={`join-item btn btn-sm ${
              currentPage === num ? "btn-active" : ""
            }`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}
