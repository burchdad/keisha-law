import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Website Admin | Rachal Law Firm APC',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
