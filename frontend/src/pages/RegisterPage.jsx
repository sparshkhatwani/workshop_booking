import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const InputField = ({ id, label, type = "text", placeholder, options, value, onChange, colSpan = 1, helpText, required = true, list }) => {
  return (
    <div className={`flex flex-col ${colSpan === 2 ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-surface-700 dark:text-surface-200">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {type === "select" ? (
          <>
            <select
              id={id}
              name={id}
              value={value}
              onChange={onChange}
              required={required}
              className="input-field relative w-full appearance-none bg-white dark:bg-surface-800 pr-10"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-surface-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            className="input-field relative w-full"
            placeholder={placeholder}
            required={required}
            list={list}
          />
        )}
      </div>
      {helpText && <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">{helpText}</p>}
    </div>
  );
};

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Mr.',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    institute: '',
    department: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      toast.success('Registration successful! Welcome.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.username?.[0] || 'Registration failed. Please check the form and try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SEO
      title="Register | FOSSEE Workshop Booking"
      description="Create an account to book and manage FOSSEE workshops conducted by IIT Bombay."
      keywords="FOSSEE, Workshop Booking, IIT Bombay, Register"
    />
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_55%,#fff8f3_100%)] dark:bg-none dark:bg-surface-950 px-3 py-5 lg:px-4">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-[3%] top-[10%] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl opacity-60" />
        <div className="absolute bottom-[8%] right-[4%] h-72 w-72 rounded-full bg-blue-300/20 blur-3xl opacity-60" />
      </div>

      <div className="mx-auto grid w-full max-w-[1450px] gap-6 xl:grid-cols-[minmax(320px,0.88fr)_minmax(460px,1.08fr)] xl:items-start py-6">
        <aside className="relative hidden w-full h-full min-h-[560px] overflow-hidden rounded-[28px] border border-white/25 bg-slate-950 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.42)] xl:flex flex-col group sticky top-24">
          <img
            src="logos/img1.webp"
            alt="FOSSEE workshop session"
            width="800"
            height="560"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[15s] group-hover:scale-110 ease-out"
            />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-primary-950/60" />

          <div className="relative flex min-h-full w-full flex-col justify-between p-8 text-white z-10 flex-1 h-full">
            <div className="max-w-[420px]">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
                FOSSEE Workshops Portal
              </div>

              <h2 className="mt-8 text-[2.5rem] font-bold leading-tight">
                Join our community of open-source enthusiasts.
              </h2>
              <p className="mt-4 text-surface-200 leading-relaxed text-lg">
                Create an account to attend workshops, connect with experts from IIT Bombay, and learn powerful open-source tools.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12 pb-4">
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/20">
                <div className="text-3xl font-bold">1000+</div>
                <div className="mt-1.5 text-sm font-medium text-white/80">Workshops</div>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/20">
                <div className="text-3xl font-bold">50K+</div>
                <div className="mt-1.5 text-sm font-medium text-white/80">Learners</div>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/20">
                <div className="text-3xl font-bold">IITB</div>
                <div className="mt-1.5 text-sm font-medium text-white/80">Backed</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative z-10 flex items-start justify-center">
          <div className="w-full max-w-[700px]">
            <div className="mb-7 text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <img
                  src="/logos/fosseelogo.webp"
                  alt="FOSSEE"
                  width="160"
                  height="56"
                  className="h-14 object-contain"
                  />
                <img
                  src="/logos/iitblogo.webp"
                  alt="IIT Bombay"
                  width="160"
                  height="56"
                  className="h-14 object-contain"
                  />
              </div>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight bg-gradient-to-br from-surface-900 to-surface-600 bg-clip-text text-transparent dark:from-white dark:to-surface-300">
                Create your account
              </h1>
              <p className="mt-2 text-base text-surface-500 dark:text-surface-300">
                Please fill in the details below to register
              </p>
            </div>

            <div className="card relative z-10 border border-white/70 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 p-6 sm:p-10 shadow-[0_22px_55px_-20px_rgba(15,23,42,0.18)] dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 animate-fade-in shadow-sm">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                
                <InputField 
                  id="title" 
                  label="Title" 
                  type="select"
                  value={formData.title} 
                  onChange={handleChange}
                  options={[
                    { value: 'Prof.', label: 'Prof.' },
                    { value: 'Dr.', label: 'Dr.' },
                    { value: 'Mr.', label: 'Mr.' },
                    { value: 'Mrs.', label: 'Mrs.' },
                    { value: 'Ms.', label: 'Ms.' },
                    { value: 'Miss.', label: 'Miss.' },
                  ]}
                />

                <InputField 
                  id="username" 
                  label="Username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="e.g. john_doe"
                  helpText="Letters, digits, period and underscore only."
                />

                <InputField 
                  id="first_name" 
                  label="First name" 
                  value={formData.first_name} 
                  onChange={handleChange} 
                  placeholder="John"
                />

                <InputField 
                  id="last_name" 
                  label="Last name" 
                  value={formData.last_name} 
                  onChange={handleChange} 
                  placeholder="Doe"
                />

                <InputField 
                  id="email" 
                  label="Email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                />

                <InputField 
                  id="phone_number" 
                  label="Phone number" 
                  type="tel"
                  value={formData.phone_number} 
                  onChange={handleChange} 
                  placeholder="+91 9876543210"
                />

                <InputField 
                  id="password" 
                  label="Password" 
                  type="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                />

                <InputField 
                  id="confirmPassword" 
                  label="Confirm password" 
                  type="password"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                />

                <InputField 
                  id="institute" 
                  label="Institute" 
                  value={formData.institute} 
                  onChange={handleChange} 
                  placeholder="Enter full name of institute"
                  colSpan={2}
                  helpText="Please write full name of your Institute/Organization"
                />

                <datalist id="departments">
                  <option value="Computer Science" />
                  <option value="Mechanical Engineering" />
                  <option value="Electrical Engineering" />
                  <option value="Civil Engineering" />
                  <option value="Information Technology" />
                  <option value="Mathematics" />
                  <option value="Physics" />
                  <option value="Chemistry" />
                </datalist>

                <InputField 
                  id="department" 
                  label="Department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  placeholder="e.g. Computer Science"
                  list="departments"
                  helpText="Department you work/study"
                />

                <InputField 
                  id="location" 
                  label="Location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="e.g. Mumbai"
                  helpText="Place/City"
                />

                <div className="sm:col-span-2 pt-4">
                  <button
                    id="register-submit-button"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full relative overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60 py-4 text-[15px]"
                    >
                    <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-surface-200/60 dark:border-surface-700/60 pt-5">
                <div className="flex flex-col gap-2 text-center text-sm">
                  <Link
                    to="/login"
                    className="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                    Already have an account? Sign in here
                  </Link>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-surface-500 dark:text-surface-400">
              Developed by Sparsh Khatwani
            </p>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
