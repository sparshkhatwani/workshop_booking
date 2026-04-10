import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkshopTypes } from '../api/client';
import SEO from '../components/SEO';

export default function WorkshopTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshopTypes()
      .then(setTypes)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Workshop Types | FOSSEE"
        description="Explore the catalog of open-source workshops offered by FOSSEE, IIT Bombay."
      />
      
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-slide-up">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-4">Available Workshops</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed text-balance">
            Browse through our specialized workshops in engineering, science, and technology 
            conducted by experts from IIT Bombay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <div key={type.id} className="card relative group flex flex-col h-full overflow-hidden hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-300">
              {/* Card visual accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {type.duration ? `${type.duration} Days` : 'Flexible'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {type.name}
                </h3>
                
                <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed line-clamp-4 flex-1">
                  {type.description || 'Learn advanced open-source tools with hands-on exercises and expert guidance from IIT Bombay faculty.'}
                </p>

                <div className="mt-8 pt-5 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Offered by</span>
                    <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">FOSSEE, IIT Bombay</span>
                  </div>
                  <Link 
                    to={`/propose?type=${type.id}`}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    Propose This
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
