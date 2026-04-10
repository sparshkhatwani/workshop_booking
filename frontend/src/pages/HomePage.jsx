import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import heroBg from '../assets/hero-bg.jpg';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <SEO 
        title="FOSSEE Workshops | IIT Bombay"
        description="Book hands-on FOSSEE workshops, collaborate with instructors, and build practical open-source skills guided by IIT Bombay experts."
      />
      
      <div className="animate-fade-in bg-surface-950">
        {/* Hero Section */}
        <section 
          className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden bg-fixed md:bg-fixed bg-center bg-cover"
          style={{ 
            backgroundImage: `url(${heroBg})`,
          }}
        >
          {/* Main Overlay */}
          <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-[2px]"></div>

          {/* Bottom Fade-to-Black Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-950 via-surface-950/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto space-y-8 px-4 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md animate-slide-down">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">New Sessions Open</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]">
              Experience <span className="text-primary-500">Excellence</span> <br /> 
              in Technical Learning
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the FOSSEE initiative by IIT Bombay. Empower your institution with world-class 
              open-source workshops delivered by industry-leading instructors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link 
                to={isAuthenticated ? "/propose" : "/register"}
                className="btn-primary px-12 py-5 text-xl font-bold shadow-2xl shadow-primary-500/40 hover:-translate-y-1 transition-transform"
              >
                Propose a Workshop
              </Link>
              <Link 
                to="/workshop-types" 
                className="px-12 py-5 text-xl font-bold bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
              >
                Explore Catalog
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-4 py-32 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Hands-on Mastery",
              desc: "Deep dive into Python, Scilab, OpenFOAM and more with structured labs and real-world exercises.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            },
            {
              title: "IITB Certified",
              desc: "Earn certificates from FOSSEE, IIT Bombay, validating your skills to institutions and employers.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            },
            {
              title: "Institutional Scaling",
              desc: "A standardized platform for coordinators to bring top-tier expertise to their campus with ease.",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-white/[0.07] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-8 font-black text-2xl group-hover:bg-primary-500 group-hover:text-white transition-all">
                 {i+1}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-surface-400 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA Banner Refined */}
        <section className="max-w-7xl mx-auto px-4 pb-32">
          <div className="relative rounded-[64px] overflow-hidden p-12 md:p-24 text-center">
            <div 
              className="absolute inset-0 grayscale opacity-20"
              style={{ 
                backgroundImage: `url(${heroBg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-700 opacity-90"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Propose a Workshop Today</h2>
              <p className="text-white/80 text-xl leading-relaxed">
                Take the first step in transforming your academic environment. Join the FOSSEE community 
                and bridge the gap between theory and innovation.
              </p>
              <div className="pt-6">
                <Link 
                  to={isAuthenticated ? "/propose" : "/register"}
                  className="inline-block bg-white text-primary-700 px-12 py-5 rounded-3xl font-black text-xl hover:bg-surface-50 transition-all hover:scale-105 shadow-2xl shadow-black/20"
                >
                  Get Started →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
