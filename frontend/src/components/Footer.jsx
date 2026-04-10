import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden bg-surface-950 text-white">
      {/* Background Accents */}
      <div className="absolute inset-x-0 bottom-0 top-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary-900/20 via-surface-950 to-surface-950"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-black text-xl shadow-lg shadow-primary-500/30">F</div>
                <span className="text-2xl font-black tracking-tight">FOSSEE</span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
                Build real-world open-source skills through hands-on workshops 
                guided by IIT Bombay experts.
              </p>
              <div className="flex gap-4">
                {[FaFacebook, FaInstagram, FaYoutube, FaLinkedin].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links Section 1 */}
            <div>
              <h4 className="text-lg font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-surface-400 text-sm">
                {["Workshops", "Our Products", "User Flow", "Learning Paths"].map((link) => (
                  <li key={link}><a className="hover:text-primary-400 transition-colors cursor-pointer">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Links Section 2 */}
            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-surface-400 text-sm">
                {["About", "Contact", "Success Stories", "Privacy Policy"].map((link) => (
                  <li key={link}><a className="hover:text-primary-400 transition-colors cursor-pointer">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Newsletter/Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <div className="space-y-4 text-sm text-surface-400">
                <p>Email: contact@fossee.in</p>
                <p>Website: fossee.in</p>
                <p>Location: IIT Bombay, Mumbai</p>
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-surface-500 text-sm">© 2026 FOSSEE Workshops. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-surface-500">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              An initiative of IIT Bombay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
