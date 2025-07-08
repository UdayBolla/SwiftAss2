import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/fetchJson';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: { street: string; suite: string; city: string };
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchJson<User[]>('https://jsonplaceholder.typicode.com/users')
      .then(data => setUser(data[0]));
  }, []);

  if (!user) return <p className="page-container">Loading…</p>;

  return (
    <div className="page-container">
      <Link to="/" className="profile-back-link">&larr; Back to dashboard</Link>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            EH
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-fields">
          <Field label="User ID" value={user.id} />
          <Field label="Name"    value={user.name} />
          <Field label="Email ID" value={user.email} />
          <Field label="Address"
                 value={`${user.address.street}, ${user.address.city}`} />
          <Field label="Phone" value={user.phone} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: {label: string; value: string | number}) {
  return (
    <div className="profile-field-item">
      <p>{label}</p>
      <div className="profile-field-value">{value}</div>
    </div>
  );
}