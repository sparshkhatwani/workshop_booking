import { useState, useEffect } from 'react';
import { fetchPublicStats, getStatsDownloadUrl, fetchWorkshopTypes } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const CHART_COLORS = [
  '#3384fc', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
];

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [chartMode, setChartMode] = useState(null);
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    state: '',
    workshop_type: '',
    sort: 'date',
  });

  const states = [
    { value: '', label: 'All States' },
    { value: 'IN-AP', label: 'Andhra Pradesh' },
    { value: 'IN-AR', label: 'Arunachal Pradesh' },
    { value: 'IN-AS', label: 'Assam' },
    { value: 'IN-BR', label: 'Bihar' },
    { value: 'IN-CT', label: 'Chhattisgarh' },
    { value: 'IN-GA', label: 'Goa' },
    { value: 'IN-GJ', label: 'Gujarat' },
    { value: 'IN-HR', label: 'Haryana' },
    { value: 'IN-HP', label: 'Himachal Pradesh' },
    { value: 'IN-JK', label: 'Jammu and Kashmir' },
    { value: 'IN-JH', label: 'Jharkhand' },
    { value: 'IN-KA', label: 'Karnataka' },
    { value: 'IN-KL', label: 'Kerala' },
    { value: 'IN-MP', label: 'Madhya Pradesh' },
    { value: 'IN-MH', label: 'Maharashtra' },
    { value: 'IN-MN', label: 'Manipur' },
    { value: 'IN-ML', label: 'Meghalaya' },
    { value: 'IN-MZ', label: 'Mizoram' },
    { value: 'IN-NL', label: 'Nagaland' },
    { value: 'IN-OR', label: 'Odisha' },
    { value: 'IN-PB', label: 'Punjab' },
    { value: 'IN-RJ', label: 'Rajasthan' },
    { value: 'IN-SK', label: 'Sikkim' },
    { value: 'IN-TN', label: 'Tamil Nadu' },
    { value: 'IN-TG', label: 'Telangana' },
    { value: 'IN-TR', label: 'Tripura' },
    { value: 'IN-UT', label: 'Uttarakhand' },
    { value: 'IN-UP', label: 'Uttar Pradesh' },
    { value: 'IN-WB', label: 'West Bengal' },
    { value: 'IN-DL', label: 'Delhi' },
  ];

  useEffect(() => {
    fetchWorkshopTypes()
      .then(setWorkshopTypes)
      .catch(() => {});
    loadStats();
  }, []);

  const loadStats = (params = {}) => {
    setLoading(true);
    const query = { ...filters, ...params };
    Object.keys(query).forEach((k) => {
      if (!query[k]) delete query[k];
    });

    fetchPublicStats(query)
      .then(setData)
      .catch((err) => {
        toast.error('Failed to load statistics');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    loadStats();
  };

  const handleClear = () => {
    const cleared = {
      from_date: '',
      to_date: '',
      state: '',
      workshop_type: '',
      sort: 'date',
    };
    setFilters(cleared);
    loadStats(cleared);
  };

  const handleDownload = () => {
    const query = { ...filters };
    Object.keys(query).forEach((k) => {
      if (!query[k]) delete query[k];
    });
    window.open(getStatsDownloadUrl(query), '_blank');
  };

  const getChartData = () => {
    if (!data?.chart_data) return [];
    const src = chartMode === 'states' ? data.chart_data.states : data.chart_data.types;
    return src.labels.map((label, i) => ({
      name: label,
      count: src.data[i],
    }));
  };

  return (
    <div className="relative z-10 space-y-6 animate-slide-up pointer-events-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Workshop Statistics</h1>
        <p className="mt-1 text-sm text-surface-500">Browse and analyze workshop data across India</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-4 pointer-events-auto">
        <div className="relative z-10 lg:col-span-1 pointer-events-auto">
          <form onSubmit={handleFilter} className="pointer-events-auto">
            <div className="card space-y-4 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-surface-900">Filters</h3>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-surface-500">From Date</label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-surface-500">To Date</label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-surface-500">Workshop</label>
                <select
                  value={filters.workshop_type}
                  onChange={(e) => setFilters({ ...filters, workshop_type: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="">All Workshops</option>
                  {workshopTypes.map((wt) => (
                    <option key={wt.id} value={wt.id}>
                      {wt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-surface-500">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="input-field text-sm"
                >
                  {states.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-surface-500">Sort by</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="date">Oldest</option>
                  <option value="-date">Latest</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-success flex-1 cursor-pointer text-sm">
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-primary flex-1 cursor-pointer text-sm"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  CSV
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="relative z-10 space-y-6 lg:col-span-3 pointer-events-auto">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setChartMode(chartMode === 'states' ? null : 'states')}
              className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                chartMode === 'states'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'border border-surface-200 bg-white text-surface-700 hover:bg-surface-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                State Chart
              </span>
            </button>

            <button
              type="button"
              onClick={() => setChartMode(chartMode === 'types' ? null : 'types')}
              className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                chartMode === 'types'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'border border-surface-200 bg-white text-surface-700 hover:bg-surface-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Workshop Chart
              </span>
            </button>
          </div>

          {chartMode && (
            <div className="card animate-slide-up p-6">
              <h3 className="mb-4 text-lg font-bold text-surface-900">
                {chartMode === 'states' ? 'State-wise Workshops' : 'Workshop Type Distribution'}
              </h3>
              {getChartData().length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getChartData()} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {getChartData().map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-12 text-center text-surface-400">
                  <p>No data available for this chart</p>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
                <h3 className="font-bold text-surface-900">
                  Workshops
                  {data?.total > 0 && (
                    <span className="ml-2 text-xs font-normal text-surface-400">
                      ({data.total} total)
                    </span>
                  )}
                </h3>
                {data?.total_pages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={data.page <= 1}
                      onClick={() => loadStats({ page: data.page - 1 })}
                      className="rounded-lg p-1.5 transition-colors hover:bg-surface-100 disabled:opacity-40 cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-xs font-medium text-surface-500">
                      Page {data.page} of {data.total_pages}
                    </span>
                    <button
                      type="button"
                      disabled={data.page >= data.total_pages}
                      onClick={() => loadStats({ page: data.page + 1 })}
                      className="rounded-lg p-1.5 transition-colors hover:bg-surface-100 disabled:opacity-40 cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-100 bg-surface-50/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Sr No.</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Coordinator</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Institute</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Workshop</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {data?.workshops?.length > 0 ? (
                      data.workshops.map((w, i) => (
                        <tr key={w.id} className="transition-colors hover:bg-surface-50/50">
                          <td className="px-6 py-4 text-sm text-surface-500">
                            {(data.page - 1) * data.per_page + i + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-surface-900">{w.coordinator_name}</td>
                          <td className="px-6 py-4 text-sm text-surface-600">{w.coordinator_institute}</td>
                          <td className="px-6 py-4 text-sm text-surface-600">{w.instructor_name || '—'}</td>
                          <td className="px-6 py-4 text-sm text-surface-600">{w.workshop_type_name}</td>
                          <td className="px-6 py-4 text-sm text-surface-600">
                            {new Date(w.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-surface-400">
                          No workshops found for the selected criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
