export const LeafIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21 3V5C21 14.627 14.627 21 5 21H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 15.5C10.5 13.167 9 10.3333 9 7C12.3333 7 15.1667 8.5 17.5 10.5C19.8333 12.5 21 15 21 17.5C18.5 17.5 16 16.3333 14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(34, 197, 94, 0.2)"
      />
    </svg>
  )
}

