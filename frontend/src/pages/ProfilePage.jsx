import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOwnProfile, updateProfile, fetchUserProfile, fetchChoices } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const EditField = ({ label, id, value, onChange, type = "text", options }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{label}</label>
    {type === "select" ? (
      <select id={id} className="input-field" value={value} onChange={onChange}>
        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : (
      <input id={id} type={type} className="input-field" value={value} onChange={onChange} />
    )}
  </div>
);

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, isInstructor } = useAuth();
  const isOwn = !id || parseInt(id) === authUser?.id;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [choices, setChoices] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (isOwn) {
        const data = await fetchOwnProfile();
        setProfileData(data.user);
        setFormData({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          ...data.user.profile
        });
        const c = await fetchChoices();
        setChoices(c);
      } else {
        const data = await fetchUserProfile(id);
        setProfileData(data.user);
      }
    } catch (err) {
      toast.error('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id, isOwn]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      loadProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!profileData) return <div className="text-center py-20">Profile not found.</div>;

  const profile = profileData.profile || {};

  return (
    <>
      <SEO title={`${profileData.full_name} | Profile`} />
      
      <div className="max-w-4xl mx-auto py-10 px-4 animate-slide-up">
        <div className="relative mb-8">
          <div className="h-48 rounded-[32px] bg-gradient-to-br from-surface-900 to-surface-800 border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-primary-500 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-[100%] h-[200%] bg-emerald-500 rounded-full blur-[120px]"></div>
            </div>
          </div>
          
          <div className="px-8 -mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-3xl bg-white dark:bg-surface-900 p-1.5 shadow-2xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/20 flex items-center justify-center text-primary-700 dark:text-primary-400 text-4xl font-black">
                  {profileData.first_name.charAt(0)}
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight">{profileData.full_name}</h1>
                <p className="text-surface-500 dark:text-surface-400 font-medium">{profile.title} • {profile.position || 'Workshop Member'}</p>
              </div>
            </div>
            
            {isOwn && !editing && (
              <button 
                onClick={() => setEditing(true)}
                className="btn-primary mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="card p-8 animate-fade-in">
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField label="First Name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                <EditField label="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                <EditField label="Title" type="select" options={choices?.titles} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <EditField label="Institute" value={formData.institute} onChange={e => setFormData({...formData, institute: e.target.value})} />
                <EditField label="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                <EditField label="Phone" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                <EditField label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <EditField label="State" type="select" options={choices?.states} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-surface-100 uppercase tracking-widest">
                <button type="submit" className="btn-primary px-8">Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-8">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="card p-8">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
                  {[
                    { label: 'Institute', value: profile.institute },
                    { label: 'Department', value: profile.department },
                    { label: 'Location', value: profile.location },
                    { label: 'State', value: profile.state_display },
                  ].map((field, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">{field.label}</p>
                      <p className="text-surface-900 dark:text-white font-semibold text-lg">{field.value || 'Not provided'}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card p-8 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"></div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="text-primary-600 dark:text-primary-400 font-black text-xl">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="text-surface-900 dark:text-white font-bold text-lg">{profile.phone_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6 bg-surface-50/50 dark:bg-surface-800/20 border-dashed">
                <h3 className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-4">Account Status</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${profile.is_email_verified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white">
                    {profile.is_email_verified ? 'Verified Account' : 'Pending Verification'}
                  </p>
                </div>
              </div>
              
              <div className="card p-6 bg-primary-600 text-white shadow-xl shadow-primary-900/10">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">System Identity</h3>
                <p className="text-2xl font-black mb-1">@{profileData.username}</p>
                <p className="text-xs text-white/60">Registered since 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
