import DashboardLayout from '../components/layouts/DashboardLayout';
import useAuth from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="page">
        <h1>Profile</h1>
        {user ? (
          <div className="form-card" style={{ maxWidth: 640 }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>No profile available.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
