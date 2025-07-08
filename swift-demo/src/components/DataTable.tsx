interface CommentRec {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export default function DataTable({ rows }: { rows: CommentRec[] }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Post ID</th>
            <th>Name</th>
            <th>Email</th>
            <th className="hideSm">Comment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.postId}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td className="hideSm">{r.body.slice(0, 60)}…</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
