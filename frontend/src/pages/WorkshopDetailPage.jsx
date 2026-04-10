import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchWorkshopDetail, addComment } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const { user, isInstructor } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    fetchWorkshopDetail(id)
      .then(setData)
      .catch((err) => {
        toast.error('Failed to load workshop details');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(id, comment, isPublic);
      toast.success('Comment added!');
      setComment('');
      loadData();
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!data?.workshop) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Workshop not found</h1>
        <Link to="/dashboard" className="text-primary-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const { workshop, comments } = data;

  return (
    <>
      <SEO 
        title={`${workshop.workshop_type_detail.name} | Workshop Details`}
        description={`Details for workshop: ${workshop.workshop_type_detail.name}`}
      />

      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-slide-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${workshop.status === 1 ? 'badge-success' : 'badge-warning'}`}>
                {workshop.status_display}
              </span>
              <span className="text-xs font-mono text-surface-400 dark:text-surface-500">UID: {workshop.uid}</span>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
              {workshop.workshop_type_detail.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Scheduled Date</p>
            <p className="text-xl font-bold text-surface-900 dark:text-white">
              {new Date(workshop.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 border-b border-surface-100 dark:border-surface-800 pb-2">Description</h3>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line">
                {workshop.workshop_type_detail.description || 'No description provided.'}
              </p>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">Communication & Comments</h3>
              
              <div className="card p-6 pb-4">
                <form onSubmit={handleComment} className="space-y-4">
                  <textarea
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Add a comment or update..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <div className="flex items-center justify-between">
                    {isInstructor && (
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-surface-600 dark:text-surface-400">
                        <input
                          type="checkbox"
                          className="rounded text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-surface-700 transition-colors"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        Visible to Coordinator
                      </label>
                    )}
                    <button
                      type="submit"
                      disabled={submitting || !comment.trim()}
                      className="btn-primary py-2 px-6 ml-auto"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>

                <div className="mt-8 space-y-6">
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <div key={c.id} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {c.author_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-surface-900 dark:text-white text-sm">{c.author_name}</span>
                            <span className="text-xs text-surface-400 dark:text-surface-500">
                              {new Date(c.created_date).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </span>
                            {!c.public && (
                              <span className="text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800/50 p-3 rounded-2xl rounded-tl-none inline-block">
                            {c.comment}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-surface-400 text-sm italic">No comments yet. Start the conversation!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Participants */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-4">Coordinator</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                  {workshop.coordinator.first_name.charAt(0)}
                </div>
                <div>
                  <Link 
                    to={isInstructor ? `/profile/${workshop.coordinator.id}` : '#'} 
                    className={`font-bold text-surface-900 dark:text-white ${isInstructor ? 'hover:text-primary-600 transition-colors' : 'pointer-events-none'}`}
                  >
                    {workshop.coordinator.full_name}
                  </Link>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{workshop.coordinator.profile.institute}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-100 dark:border-surface-800 space-y-2">
                <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary-500"></span>
                  {workshop.coordinator.email}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary-500"></span>
                  {workshop.coordinator.profile.phone_number}
                </p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-4">Instructor</h3>
              {workshop.instructor ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold">
                    {workshop.instructor.first_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-surface-900 dark:text-white">{workshop.instructor.full_name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">FOSSEE Expert</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-surface-400 italic">No instructor assigned yet.</p>
              )}
            </div>

            <div className="card p-6 bg-surface-900 text-white">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Terms & Conditions</h3>
              <p className="text-xs text-white/70 leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {workshop.workshop_type_detail.terms_and_conditions || 'Standard IIT Bombay FOSSEE terms apply.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
