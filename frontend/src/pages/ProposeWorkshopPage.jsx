import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchWorkshopTypes, proposeWorkshop } from '../api/client';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function ProposeWorkshopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || '';

  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    workshop_type: initialType,
    date: '',
    tnc_accepted: false,
  });

  useEffect(() => {
    fetchWorkshopTypes()
      .then((types) => {
        setWorkshopTypes(types);
        // If query param exists but doesn't match any type, reset or handle
      })
      .catch((err) => {
        toast.error('Failed to load workshop types');
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workshop_type) {
      toast.error('Please select a workshop type');
      return;
    }

    if (!formData.date) {
      toast.error('Please select a preferred date');
      return;
    }

    if (!formData.tnc_accepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await proposeWorkshop(formData);
      toast.success('Workshop proposal submitted successfully! Our team will review it shortly.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit proposal. Please check your inputs.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = workshopTypes.find(t => t.id === parseInt(formData.workshop_type));

  return (
    <>
      <SEO 
        title="Propose Workshop | FOSSEE"
        description="Submit a new workshop proposal to the FOSSEE team."
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tight">Propose a Workshop</h1>
            <p className="mt-2 text-lg text-surface-500">Collaborate with IIT Bombay to bring open-source learning to your campus.</p>
          </div>
          <div className="flex-shrink-0 px-6 py-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/50">
            <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Coordinator View</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-8 shadow-2xl shadow-surface-200/50 dark:shadow-none bg-white dark:bg-surface-900">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="workshop_type" className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                    Which workshop would you like to host? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="workshop_type"
                    required
                    className="input-field py-3 text-base"
                    value={formData.workshop_type}
                    onChange={(e) => setFormData({ ...formData, workshop_type: e.target.value })}
                  >
                    <option value="">Select a workshop type...</option>
                    {workshopTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                    Preferred Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    className="input-field py-3"
                    min={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]} // Min 7 days from now
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <p className="mt-2 text-xs text-surface-500 italic">Please select a date at least 1 week in advance for logistics.</p>
                </div>

                <div className="pt-4 p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                  <label className="relative flex items-start gap-4 cursor-pointer group">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-surface-600 rounded transition-all cursor-pointer"
                        checked={formData.tnc_accepted}
                        onChange={(e) => setFormData({ ...formData, tnc_accepted: e.target.checked })}
                      />
                    </div>
                    <div>
                      <span className="font-bold text-surface-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        I accept the FOSSEE Workshop Guidelines
                      </span>
                      <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                        I confirm that my institution will provide the necessary infrastructure and 
                        adhere to the protocols set by IIT Bombay.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Submit Proposal'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6 bg-gradient-to-br from-surface-900 to-surface-800 text-white border-0">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-4">Workshop Selected</h3>
              {selectedType ? (
                <div className="space-y-4">
                  <p className="text-xl font-bold">{selectedType.name}</p>
                  <div className="flex items-center gap-2 text-primary-400 font-bold text-sm uppercase">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedType.duration} Days Duration
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed italic">
                    "{selectedType.description?.substring(0, 100)}..."
                  </p>
                </div>
              ) : (
                <p className="text-sm text-white/40 italic">Please select a workshop from the list to see details.</p>
              )}
            </div>

            <div className="p-6 rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
              <h3 className="font-bold text-surface-900 dark:text-white mb-3">Important Notice</h3>
              <ul className="space-y-3">
                {[
                  "Proposals are reviewed within 48 hours.",
                  "Logistics costs must be covered by the institute.",
                  "Certificates provided by IIT Bombay."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-1"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
