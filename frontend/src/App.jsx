import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardCoordinator from './pages/DashboardCoordinator';
import DashboardInstructor from './pages/DashboardInstructor';
import StatisticsPage from './pages/StatisticsPage';
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa";

function DashboardRouter() {
  const { isInstructor } = useAuth();
  return isInstructor ? <DashboardInstructor /> : <DashboardCoordinator />;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bottom-0 left-0 right-0 bg-surface-900 text-white/60 text-center py-3 text-xs">
        {/* Developed by FOSSEE group, IIT Bombay */}
        {/* <div className="text-center py-10 px-4 border-b border-blue-700">
        <h2 className="text-2xl font-semibold">
          Stay updated on new workshops
        </h2>
        <p className="text-sm mt-2 text-blue-200">
          Get notified when new workshops are announced
        </p>
        <button className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-medium">
          View All Workshops
        </button>
      </div> */}

      {/* Main Footer */}
      {/* <div className="grid md:grid-cols-3 gap-8 px-8 py-10 max-w-6xl mx-auto text-sm"> */}
        
        {/* About */}
        {/* <div>
          <h3 className="font-semibold text-lg mb-3">About</h3>
          <p className="text-blue-200">
            Book hands-on FOSSEE workshops, collaborate with instructors,
            and build practical open-source skills guided by IIT Bombay experts.
          </p>
        </div> */}

        {/* Quick Links */}
        {/* <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-blue-200">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/workshops" className="hover:text-white">Workshops</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
            <li><a href="/register" className="hover:text-white">Register</a></li>
          </ul>
        </div> */}

        {/* Contact */}
        {/* <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <ul className="space-y-2 text-blue-200">
            <li>Email: contact@fossee.in</li>
            <li>Website: fossee.in</li>
            <li>Location: IIT Bombay, Mumbai</li>
          </ul>
        </div>
      </div> */}

      {/* Bottom Bar */}
      {/* <div className="text-center text-xs text-blue-300 border-t border-blue-700 py-4">
        An initiative of IIT Bombay under the National Mission on Education
      </div> */}

      {/* new footer */}
      {/* Gradient Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-orange-500/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Glass Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">

          <div className="grid md:grid-cols-5 gap-10">

            {/* Logo + About */}
            <div>
              <h2 className="text-2xl font-bold mb-3 tracking-wide">
                FOSSEE
              </h2>
              <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                Build real-world open-source skills through hands-on workshops
                guided by IIT Bombay experts.
              </p>

              <p className="text-blue-300 text-sm">
                📞 +99 (999)  999
              </p>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {["Workshops", "Our Products", "User Flow", "Learning Paths"].map((item) => (
                  <li key={item}>
                    <a className="hover:text-orange-400 transition duration-300 hover:pl-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <br />
              <p>Email: contact@fossee.in</p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {["About", "Contact", "Success Stories", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <a className="hover:text-orange-400 transition duration-300 hover:pl-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <br />
                <p>Website: fossee.in</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {["Premium Support", "Our Services", "Our Team", "Download App"].map((item) => (
                  <li key={item}>
                    <a className="hover:text-orange-400 transition duration-300 hover:pl-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
                <br />
                  <p>Location: IIT Bombay, Mumbai</p>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Follow Us</h3>

              <div className="flex gap-3 mb-6">
                {[FaFacebook, FaInstagram, FaYoutube, FaLinkedin].map((Icon, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 
                               hover:bg-orange-500 hover:scale-110 transition duration-300 cursor-pointer"
                  >
                    <Icon />
                  </div>
                ))}
              </div>

              <p className="text-blue-300 text-sm">
                © 2026 FOSSEE
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-xs text-blue-400 py-4">
        An initiative of IIT Bombay under the National Mission on Education
      </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
            },
            error: {
              style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
