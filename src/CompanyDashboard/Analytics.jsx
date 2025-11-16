import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  FaEye,
  FaUsers,
  FaShoppingBag,
  FaThumbsUp,
  FaThumbsDown,
  FaMoon,
  FaSun,
} from "react-icons/fa";

/* -------------------------
   Count-up hook (smooth animated)
---------------------------*/
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    let start = null;
    const from = Number(display);
    const to = Number(value);
    const raf = { id: 0 };

    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      if (t < 1) raf.id = requestAnimationFrame(step);
    }
    raf.id = requestAnimationFrame(step);
    const p = setTimeout(() => setPulseKey((k) => k + 1), duration + 40);
    return () => {
      cancelAnimationFrame(raf.id);
      clearTimeout(p);
    };
  }, [value]);

  return [display, pulseKey];
}

/* -------------------------
   Loading skeleton (simple)
---------------------------*/
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200/60 dark:bg-gray-700/40 rounded ${className}`} />;
}

/* -------------------------
   Main Component
---------------------------*/
export default function AnalyticsAppleFull({ products }) {
  const [theme, setTheme] = useState("light");
  const [compact, setCompact] = useState(true);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const baseData = useMemo(
    () => ({
      weekly: Array.from({ length: 7 }, (_, i) => ({ label: `D${i + 1}`, v: Math.floor(Math.random() * 500 + 200) })),
      monthly: Array.from({ length: 30 }, (_, i) => ({ label: `D${i + 1}`, v: Math.floor(Math.random() * 500 + 200) })),
      yearly: Array.from({ length: 12 }, (_, i) => ({ label: `M${i + 1}`, v: Math.floor(Math.random() * 6000 + 4000) })),
    }),
    []
  );

  const [trend, setTrend] = useState(baseData[range].slice());

  useEffect(() => {
    setTrend(baseData[range].map((d) => ({ ...d })));
  }, [range, baseData]);

  useEffect(() => {
    const id = setInterval(() => {
      setTrend((t) =>
        t.map((d) => ({
          ...d,
          v: Math.max(
            0,
            Math.round(
              d.v + (Math.random() - 0.45) * (range === "weekly" ? 40 : range === "monthly" ? 80 : 200)
            )
          ),
        }))
      );
    }, 2800);

    return () => clearInterval(id);
  }, [range]);

  const topProduct = useMemo(() => products.reduce((a, b) => (b.views > a.views ? b : a), products[0] || {}), [products]);

  const areaData = useMemo(() => trend.map((d) => ({ name: d.label, views: d.v })), [trend]);
  const barData = useMemo(() => products.map((p) => ({ name: p.name, views: p.views })), [products]);

  const [viewsAnimated, viewsPulse] = useCountUp(topProduct.views || 0, 800);
  const [totalViewsCount] = useCountUp(products.reduce((s, p) => s + (p.views || 0), 0), 900);

  const palette = {
    primary: "#0A84FF",
    soft: "#66C7FF",
    soft2: "#3B82F6",
  };

  const containerBg = theme === "light" ? "bg-neutral-100" : "bg-gray-900";
  const cardBase = theme === "light"
    ? "bg-white border border-white/60"
    : "bg-gray-800 border border-gray-700";

  const textSub = theme === "light" ? "text-gray-500" : "text-gray-300";
  const muted = theme === "light" ? "text-gray-400" : "text-gray-400/80";

  const cardVariant = { initial: { opacity: 0, y: 6 }, enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 6 } };

  return (
    <div className={`${containerBg} min-h-screen font-sans text-sm mt-10`}>
      <div className="flex">
        <main className="flex-1 p-4 md:p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-xl md:text-2xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Analytics</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border px-1 py-1">
                {["weekly", "monthly", "yearly"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-2 py-1 text-xs rounded-md ${range === r ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white' : `bg-transparent ${muted}`}`}
                  >
                    {r[0].toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <button onClick={() => setCompact(c => !c)} className="px-2 py-1 text-xs rounded-md border">
                {compact ? 'Compact' : 'Spacious'}
              </button>

              <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))} className="flex items-center gap-2 px-3 py-2 rounded-md border">
                {theme === "light" ? <FaMoon /> : <FaSun className="text-yellow-400" />}
              </button>
            </div>
          </header>

          <div className={`max-w-7xl mx-auto ${compact ? 'space-y-3' : 'space-y-5'}`}>
            {/* Top row */}
            <div className={`grid grid-cols-1 lg:grid-cols-4 gap-3 ${compact ? 'mb-2' : 'mb-4'} items-start`}>
              {/* Area Chart */}
              <motion.div variants={cardVariant} initial="initial" animate="enter" className={`lg:col-span-2 rounded-2xl p-3 border-4 border-white ${cardBase}`}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className={`text-xs ${textSub}`}>Views Trend</div>
                    <div className="text-lg font-semibold">Recent Views</div>
                  </div>
                  <div className={`text-xs ${muted}`}>Live</div>
                </div>

                <div className={`${compact ? 'h-36' : 'h-44'}`}>
                  {loading ? (
                    <Skeleton className="w-full h-full rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData}>
                        <defs>
                          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor={palette.primary} stopOpacity={0.28} />
                            <stop offset="95%" stopColor={palette.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'light' ? '#374151' : '#d1d5db' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'light' ? '#374151' : '#d1d5db' }} />
                        <Tooltip wrapperStyle={{ borderRadius: 8 }} contentStyle={{ background: theme === 'dark' ? '#111827' : '#fff' }} />
                        <Area type="monotone" dataKey="views" stroke={palette.primary} fill="url(#g1)" strokeWidth={2.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Top Product Card */}
              <motion.div variants={cardVariant} initial="initial" animate="enter" className={`rounded-2xl p-3 ${cardBase}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-xs ${textSub}`}>Top product</div>
                    <div className="text-lg font-semibold">{topProduct.name || '—'}</div>
                  </div>
                  <div className={`text-xs ${muted}`}>live</div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <img src={topProduct.image || "/placeholder.png"} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <div className={`text-xs ${textSub}`}>Views</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={viewsPulse}
                        initial={{ scale: 0.98 }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.7 }}
                        className="text-2xl font-semibold"
                      >
                        {viewsAnimated.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="h-24 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ left: 6, right: 6 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="views" barSize={20} radius={[6, 6, 6, 6]}>
                        {barData.map((_, idx) => {
                          const colors = [palette.primary, palette.soft2, palette.soft];
                          return <Cell key={idx} fill={colors[idx % 3]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Mini Stats */}
              <div className="space-y-2">
                <motion.div variants={cardVariant} initial="initial" animate="enter" className={`${cardBase} rounded-2xl p-2`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xl text-blue-600"><FaShoppingBag /></div>
                    <div>
                      <div className="text-lg font-semibold">{products.length}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>Most Viewed Products</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} initial="initial" animate="enter" className={`${cardBase} rounded-2xl p-2`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xl text-blue-600"><FaEye /></div>
                    <div>
                      <div className="text-lg font-semibold">{totalViewsCount.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>Total Product Views</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} initial="initial" animate="enter" className={`${cardBase} rounded-2xl p-2`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xl text-blue-600"><FaUsers /></div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">830</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>Customer Profile Views</div>
                      <div className="flex gap-2 mt-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm">
                          <FaThumbsUp className="text-blue-500" /> <span>{topProduct.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm">
                          <FaThumbsDown className="text-blue-400" /> <span>{topProduct.dislikes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Products Performance</h2>
                <div className="text-xs" style={{ color: '#6b7280' }}>Updated live</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`${cardBase} rounded-3xl p-3 border-8 bg-white`}>
                      <Skeleton className="w-full h-36 object-cover rounded-lg" />
                      <div className="mt-3 flex items-center justify-between">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/6" />
                      </div>
                      <div className="mt-3 h-12">
                        <Skeleton className="w-full h-full rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  products.map((p) => (
                    <motion.div key={p.id} whileHover={{ y: -6 }} className={`${cardBase} rounded-2xl p-3`}>
                      <img src={p.image || "/placeholder.png"} alt="" className="w-full h-36 object-cover rounded-lg" />
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs" style={{ color: '#6b7280' }}>{p.reviews || 0} reviews • {p.rating || 0}★</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{(p.views || 0).toLocaleString()}</div>
                          <div className="text-xs" style={{ color: '#6b7280' }}>views</div>
                        </div>
                      </div>

                      <div className="mt-3 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={(p.spark || []).map((v, i) => ({ x: i, v }))}>
                            <Area type="monotone" dataKey="v" stroke={palette.primary} fill={palette.soft} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
