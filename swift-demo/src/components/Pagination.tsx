import clsx from 'clsx'; // Keep clsx if you want dynamic class names like this, or use string concatenation

interface Props { page: number; totalPages: number;
  onPageChange: (p: number) => void; }

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  function go(p: number) { if (p >= 1 && p <= totalPages) onPageChange(p); }
  return (
    <div className="pagination-container">
      <button onClick={() => go(page - 1)}
        className="pagination-button"
        disabled={page === 1}>{'<'}</button>

      {/* only 5 page buttons window */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => Math.abs(p - page) <= 2 ||
          p === 1 || p === totalPages)
        .map(p => (
          <button key={p}
            onClick={() => go(p)}
            // Using clsx for conditional class, or you can use `p === page ? 'pagination-button active' : 'pagination-button'`
            className={clsx("pagination-button pagination-button-number", { 'active': p === page })}>
            {p}
          </button>
        ))}

      <button onClick={() => go(page + 1)}
        className="pagination-button"
        disabled={page === totalPages}>{'>'}</button>
    </div>
  );
}