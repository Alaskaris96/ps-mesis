import AdminDashboard from '@/components/admin/AdminDashboard';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="container px-4 py-12 mx-auto min-h-screen">
            <h1 className="text-4xl font-bold font-serif text-[var(--primary)] text-center mb-12">
                Διαχείριση Συστήματος
            </h1>

            <div className="max-w-6xl mx-auto">
                <AdminDashboard user={session} />
            </div>
        </div>
    );
}
