interface PaginationProps {
  currentPage: number
  totalPage: number
  toNextPage?: () => void
  toPreviousPage?: () => void
}

export function Pagination(props: PaginationProps) {
  return (
    <div className="inline-flex items-center justify-center gap-3">
      <button
        className="inline-flex bg-white h-8 w-8 items-center justify-center rounded border border-gray-100"
        onClick={props.toPreviousPage}
        disabled={props.currentPage == 1}
      >
        <span className="sr-only">Next Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <p className="text-xs select-none">
        {props.currentPage}
        <span className="mx-0.25">/</span>
        {props.totalPage}
      </p>

      <button
        className="inline-flex bg-white h-8 w-8 items-center justify-center rounded border border-gray-100"
        onClick={props.toNextPage}
        disabled={props.currentPage == props.totalPage}
      >
        <span className="sr-only">Next Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>

  )
}
