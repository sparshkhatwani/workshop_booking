import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWorkshops, acceptWorkshop, changeWorkshopDate } from '../api/client';
import toast from 'react-hot-toast';

export default function DashboardInstructor() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [today, setToday] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateModal, setDateModal] = useState(null);
  const [newDate, setNewDate] = useState('');

  const loadWorkshops = () => {
    setLoading(true);
    fetchWorkshops()
      .then((data) => {
        setWorkshops(data.workshops || []);
        setToday(data.today || '');
      })
      .catch((err) => {
        toast.error('Failed to load workshops');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const handleAccept = async (workshopId) => {
    if (!window.confirm(
      'Once accepted you cannot reject, you have to personally contact the Coordinator if cancelled. Are you sure?'
    )) return;

    try {
      await acceptWorkshop(workshopId);
      toast.success('Workshop accepted!');
      loadWorkshops();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept workshop');
    }
  };

  const handleDateChange = async (workshopId) => {
    if (!newDate) {
      toast.error('Please select a date');
      return;
    }
    try {
      await changeWorkshopDate(workshopId, newDate);
      toast.success('Workshop date updated!');
      setDateModal(null);
      setNewDate('');
      loadWorkshops();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update date');
    }
  };

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            Welcome, {user?.first_name || 'Instructor'}! 👋
          </h1>
          <p className="text-surface-500 max-w-md mx-auto">
            Your workshop information will appear here. Navigate to <strong>Workshop Types</strong> to browse
            available workshops, and check back for coordinator proposals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Instructor Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Manage and accept workshop proposals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Total</p>
          <p className="text-3xl font-bold text-surface-900 mt-1">{workshops.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Accepted</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{acceptedWorkshops.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Proposals</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{pendingWorkshops.length}</p>
        </div>
      </div>

      {/* Accepted */}
      {acceptedWorkshops.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100">
            <h2 className="text-lg font-bold text-surface-900">Workshops Accepted</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Coordinator</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Workshop</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {acceptedWorkshops.map((w) => (
                  <tr key={w.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/profile/${w.coordinator_id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        {w.coordinator_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600">{w.coordinator_institute}</td>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900">{w.workshop_type_name}</td>
                    <td className="px-6 py-4 text-sm text-surface-600">
                      {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4"><span className="badge-success">{w.status_display}</span></td>
                    <td className="px-6 py-4">
                      {w.date > today && (
                        <button
                          onClick={() => { setDateModal(w.id); setNewDate(''); }}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Change Date
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Proposals */}
      {pendingWorkshops.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100">
            <h2 className="text-lg font-bold text-surface-900">Workshop Proposals From Coordinators</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Coordinator</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Workshop</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {pendingWorkshops.map((w) => (
                  <tr key={w.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/profile/${w.coordinator_id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        {w.coordinator_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600">{w.coordinator_institute}</td>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900">{w.workshop_type_name}</td>
                    <td className="px-6 py-4 text-sm text-surface-600">
                      {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4"><span className="badge-warning">{w.status_display}</span></td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAccept(w.id)}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Date Change Modal */}
      {dateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 w-full max-w-sm animate-slide-up">
            <h3 className="text-lg font-bold text-surface-900 mb-4">Select New Date</h3>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="input-field mb-4"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="flex gap-3">
              <button onClick={() => handleDateChange(dateModal)} className="btn-primary flex-1">
                Save
              </button>
              <button onClick={() => setDateModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
