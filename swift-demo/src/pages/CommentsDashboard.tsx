import { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '../utils/fetchJson';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import { SortState, nextSortDir, sortBy } from '../utils/sortHelpers';
import { usePersistedState } from '../hooks/usePersistedState'; // Import usePersistedState

interface CommentRec {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const PAGE_SIZES = [10, 50, 100] as const;

export default function CommentsDashboard() {
  /* persisted UI state */
  const [pageSize, setPageSize] = usePersistedState<'10' | '50' | '100'>(
    'pageSize', '10'
  );
  const [page, setPage] = usePersistedState<number>('page', 1);
  const [search, setSearch] = usePersistedState<string>('search', '');
  const [sort, setSort]   = usePersistedState<SortState>('sort',
    { key: null, dir: null });

  /* remote data */
  const [rows, setRows] = useState<CommentRec[]>([]);
  useEffect(() => {
    fetchJson<CommentRec[]>('https://jsonplaceholder.typicode.com/comments')
      .then(setRows);
  }, []);

  /* search filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.body.toLowerCase().includes(q)
    );
  }, [rows, search]);

  /* sort */
  const sortedRows = useMemo(
    () => sortBy(filtered, sort),
    [filtered, sort]
  );

  /* pagination */
  const pgSize = Number(pageSize);
  const totalPages = Math.ceil(sortedRows.length / pgSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageSlice = sortedRows.slice(
    (currentPage - 1) * pgSize,
    currentPage * pgSize
  );

  // Auto‑correct persisted page if dataset shrinks
  useEffect(() => setPage(currentPage), [currentPage, setPage]);

  /* handlers */
  function cycleSort(key: SortState['key']) {
    setSort(prev => ({
      key,
      dir: key === prev.key ? nextSortDir(prev.dir) : 'asc'
    }));
  }

  /* ------ Render ------ */
  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div className="sort-buttons-container">
          {(['postId', 'name', 'email'] as const).map(col => (
            <button key={col}
              onClick={() => cycleSort(col)}
              className="sort-button">
              Sort {col === 'postId' ? 'Post ID' : capitalize(col)}
              {sort.key === col && (sort.dir === 'asc' ? ' ▲' :
                                    sort.dir === 'desc' ? ' ▼' : '')}
            </button>
          ))}
        </div>

        <SearchInput value={search} onChange={setSearch}
          placeholder="Search name, email, comment" />
      </div>

      <DataTable rows={pageSlice} />

      <div className="dashboard-footer">
        <span>
          {`${(currentPage - 1) * pgSize + 1}‑${Math.min(currentPage * pgSize, sortedRows.length)}
            of ${sortedRows.length} items`}
        </span>

        <div className="dashboard-footer-right">
          <label>
            <select value={pageSize}
              onChange={e => { setPageSize(e.target.value as any); setPage(1); }}
              className="page-size-select">
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
            </select>
          </label>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

/* --- very small table component --- */
function DataTable({ rows }: { rows: CommentRec[] }) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Post ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.postId}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.body.slice(0, 60)}…</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}