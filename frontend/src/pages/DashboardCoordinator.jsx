import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWorkshops } from '../api/client';
import toast from 'react-hot-toast';

export default function DashboardCoordinator() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops()
      .then((data) => setWorkshops(data.workshops || []))
      .catch((err) => {
        toast.error('Failed to load workshops');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const acceptedWorkshops = workshops.filter((w) => w.status === 1);
  const pendingWorkshops = workshops.filter((w) => w.status === 0 && w.tnc_accepted);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 font-medium">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (workshops.length === 0) {
    return (
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            Welcome, {user?.first_name || 'Coordinator'}! 👋
          </h1>
          <p className="text-surface-500 mb-6 max-w-md mx-auto">
            Your workshop information will appear here. You can propose a workshop
            using the <strong>Propose Workshop</strong> link in the navigation.
          </p>
          <Link to="/propose" className="btn-primary">
            Propose a Workshop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">My Workshops</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Track the status of your workshop proposals</p>
        </div>
        <Link to="/propose" className="btn-primary">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Propose Workshop
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Total</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-white mt-1">{workshops.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Accepted</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{acceptedWorkshops.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{pendingWorkshops.length}</p>
        </div>
      </div>

      {/* Accepted Table */}
      {acceptedWorkshops.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Workshops Accepted</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Workshop</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {acceptedWorkshops.map((w) => (
                  <tr key={w.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/workshops/${w.id}`} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                        {w.workshop_type_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{w.instructor_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4"><span className="badge-success">{w.status_display}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Table */}
      {pendingWorkshops.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Workshops Proposed By Me</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Workshop</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {pendingWorkshops.map((w) => (
                  <tr key={w.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/workshops/${w.id}`} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                        {w.workshop_type_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4"><span className="badge-warning">{w.status_display}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
