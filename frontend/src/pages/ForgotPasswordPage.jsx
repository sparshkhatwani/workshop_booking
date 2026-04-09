import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { resetPassword } from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success('If the email exists, a password reset link has been sent.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to request password reset. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SEO
      title="Forgot Password | FOSSEE Workshop Booking"
      description="Reset your FOSSEE Workshops Portal password."
    />
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_55%,#fff8f3_100%)] dark:bg-none dark:bg-surface-950 px-3 py-5 lg:px-4">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-[3%] top-[10%] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl opacity-60" />
        <div className="absolute bottom-[8%] right-[4%] h-72 w-72 rounded-full bg-blue-300/20 blur-3xl opacity-60" />
      </div>

      <div className="mx-auto grid w-full max-w-[1450px] gap-6 xl:grid-cols-[minmax(320px,0.88fr)_minmax(460px,1.08fr)] xl:items-start py-6">
        <aside className="relative hidden h-full min-h-[560px] overflow-hidden rounded-[28px] border border-white/25 bg-slate-950 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.42)] xl:flex flex-col group sticky top-24">
          <img
            src="logos/img1.jpg"
            alt="FOSSEE workshop session"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[15s] group-hover:scale-110 ease-out"
            />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-primary-950/60" />

          <div className="relative flex min-h-full w-full flex-col justify-between p-8 text-white z-10 flex-1 h-full">
            <div className="max-w-[420px]">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
                FOSSEE Workshops Portal
              </div>

              <h2 className="mt-8 text-[2.5rem] font-bold leading-tight">
                Get back into your account securely.
              </h2>
              <p className="mt-4 text-surface-200 leading-relaxed text-lg">
                Don't worry, it happens to the best of us! Just enter your email and we'll send you a link to reset your password.
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
                Forgot Password?
              </h1>
              <p className="mt-3 text-base text-surface-500 dark:text-surface-300">
                Enter your registered email address to reset your password
              </p>
            </div>

            <div className="card relative z-10 border border-white/70 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 p-8 sm:p-10 shadow-[0_22px_55px_-20px_rgba(15,23,42,0.18)] dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              
              {submitted ? (
                <div className="text-center animate-fade-in">
                  <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white">Check your email</h3>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                    We've sent a password reset link to <span className="font-medium text-surface-900 dark:text-surface-200">{email}</span>.
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/login"
                      className="btn-primary w-full inline-flex justify-center"
                    >
                      Return to login
                    </Link>
                  </div>
                </div>
              ) : (
                <>
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field relative z-10 pl-10 w-full"
                          placeholder="Your registered email address"
                          required
                          autoFocus
                          />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading || !email}
                        className="btn-success flex-1 relative overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60 py-3 text-[15px]"
                        >
                        <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              Requesting...
                            </>
                          ) : (
                            'Request'
                          )}
                        </span>
                      </button>

                      <Link
                        to="/login"
                        className="btn-primary flex-1 relative overflow-hidden group py-3 text-[15px] text-center"
                        >
                        <span className="absolute inset-0 bg-white/20 bg-opacity-10 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
                        <span className="relative z-10">Cancel</span>
                      </Link>
                    </div>
                  </form>
                </>
              )}
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
