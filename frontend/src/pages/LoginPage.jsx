import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SEO
      title="Login | FOSSEE Workshop Booking"
      description="Log in to book and manage FOSSEE workshops conducted by IIT Bombay."
      keywords="FOSSEE, Workshop Booking, IIT Bombay"
    />
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_55%,#fff8f3_100%)] dark:bg-none dark:bg-surface-950 px-3 py-5 lg:px-4">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-[3%] top-[10%] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute bottom-[8%] right-[4%] h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-[1450px] gap-6 xl:grid-cols-[minmax(320px,0.88fr)_minmax(460px,1.08fr)] xl:items-start">
        <aside className="relative hidden min-h-[560px] overflow-hidden rounded-[28px] border border-white/25 bg-slate-950 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.42)] xl:flex group">
          <img
            src="logos/img1.jpg"
            alt="FOSSEE workshop session"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[15s] group-hover:scale-110 ease-out"
            />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-primary-950/50" />

          <div className="relative flex min-h-[560px] w-full flex-col justify-between p-7 text-white">
            <div className="max-w-[420px]">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
                FOSSEE Workshops Portal
              </div>

              <h2 className="mt-7 text-4xl font-bold leading-tight">
                Learn, build, and grow with impactful open-source workshops.
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-2xl font-bold">1000+</div>
                <div className="mt-1 text-sm text-white/75">Workshops</div>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-2xl font-bold">50K+</div>
                <div className="mt-1 text-sm text-white/75">Learners</div>
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-2xl font-bold">IITB</div>
                <div className="mt-1 text-sm text-white/75">Backed</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative z-10 flex min-h-[560px] items-start justify-center pt-6">
          <div className="w-full max-w-[560px]">
            <div className="mb-7 text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <img
                  src="/logos/fosseelogo.png"
                  alt="FOSSEE"
                  className="h-14 object-contain"
                  />
                <img
                  src="/logos/iitblogo.png"
                  alt="IIT Bombay"
                  className="h-14 object-contain"
                  />
              </div>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight bg-gradient-to-br from-surface-900 to-surface-600 bg-clip-text text-transparent dark:from-white dark:to-surface-300">
                Welcome back
              </h1>
              <p className="mt-2 text-base text-surface-500 dark:text-surface-300">
                Sign in to FOSSEE Workshops Portal
              </p>
            </div>

            <div className="card relative z-10 border border-white/70 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 p-8 sm:p-10 shadow-[0_22px_55px_-20px_rgba(15,23,42,0.18)] dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700 animate-fade-in">
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field relative z-10 pl-10"
                      placeholder="Enter your username"
                      required
                      autoFocus
                      />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field relative z-10 pl-10"
                      placeholder="Enter your password"
                      required
                      />
                  </div>
                </div>

                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full relative overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60 py-3.5 text-[15px]"
                  >
                  <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in to your account'
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-6 border-t border-surface-100 pt-5">
                <div className="flex flex-col gap-2 text-center text-sm">
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    >
                    New around here? Sign up
                  </Link>
                  <span className="text-surface-400">
                    Forgot password? Contact admin
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-surface-400">
              Developed by FOSSEE group, IIT Bombay
            </p>
          </div>
        </main>
      </div>
    </div>
     </>
  );
}
