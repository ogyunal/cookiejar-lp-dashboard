import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import GameCard from '../../components/dashboard/GameCard';
import { FaGamepad, FaPlay, FaUsers, FaDollarSign } from 'react-icons/fa';
import { getCreatorGames } from '../../lib/supabase';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';

// Mock data for the chart
const mockChartData = [
  { date: 'Jan 1', plays: 234 },
  { date: 'Jan 5', plays: 456 },
  { date: 'Jan 10', plays: 789 },
  { date: 'Jan 15', plays: 1123 },
  { date: 'Jan 20', plays: 1456 },
  { date: 'Jan 25', plays: 1789 },
  { date: 'Jan 30', plays: 2234 },
];

export default function DashboardOverview() {
  const { data: session } = useSession();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlays: 0,
    activePlayers: 0,
    earnings: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  async function loadDashboardData() {
    if (!session?.user?.id) return;

    try {
      const gamesData = await getCreatorGames(session.user.id);
      setGames(gamesData.slice(0, 3)); // Show only 3 recent games
      
      // Calculate stats
      const totalPlays = gamesData.reduce((sum, game) => sum + (game.play_count || 0), 0);
      const totalDownloads = gamesData.reduce((sum, game) => sum + (game.download_count || 0), 0);
      
      setStats({
        totalGames: gamesData.length,
        totalPlays: totalPlays,
        activePlayers: totalDownloads,
        earnings: totalPlays * 0.01, // Mock: $0.01 per play
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard - CookieJar Creator</title>
      </Head>

      <div>
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Welcome back, {session?.user?.name}!
            </h1>
            <span className="text-3xl animate-wave">👋</span>
          </div>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your games today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Games"
            value={formatNumber(stats.totalGames)}
            icon={<FaGamepad />}
            color="blue"
            loading={loading}
          />
          
          <StatCard
            title="Total Plays"
            value={formatNumber(stats.totalPlays)}
            icon={<FaPlay />}
            color="green"
            trend="up"
            trendValue="+12%"
            loading={loading}
          />
          
          <StatCard
            title="Active Players"
            value={formatNumber(stats.activePlayers)}
            icon={<FaUsers />}
            color="purple"
            trend="up"
            trendValue="+8%"
            loading={loading}
          />
          
          <StatCard
            title="This Month"
            value={formatCurrency(stats.earnings)}
            icon={<FaDollarSign />}
            color="orange"
            trend="up"
            trendValue="+15%"
            loading={loading}
          />
        </div>

        {/* Chart */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 lg:p-8 mb-8 border border-gray-200/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                Plays Over Time
              </h2>
              <p className="text-sm text-gray-500">Track your game performance</p>
            </div>
            <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cookie-brown/20 focus:border-cookie-brown bg-white/80 backdrop-blur-sm transition-all hover:border-cookie-brown">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <defs>
                <linearGradient id="playGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A574" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#D4A574" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Line 
                type="monotone" 
                dataKey="plays" 
                stroke="#D4A574" 
                strokeWidth={3}
                dot={{ fill: '#D4A574', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, stroke: '#D4A574', strokeWidth: 2 }}
                fill="url(#playGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Games</h2>
            <button
              onClick={() => router.push('/dashboard/games')}
              className="text-cookie-brown hover:text-cookie-dark-brown font-semibold transition-colors"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onEdit={() => router.push(`/dashboard/games?edit=${game.id}`)}
                  onDelete={() => {}}
                  onViewAnalytics={() => router.push(`/dashboard/analytics?game=${game.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white/60 to-cookie-cream/20 backdrop-blur-sm rounded-2xl p-12 lg:p-16 text-center border border-gray-200/60 shadow-sm">
              <motion.div 
                className="text-7xl mb-6"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                🎮
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                No games yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Upload your first game to get started and begin your creator journey
              </p>
              <motion.button
                onClick={() => router.push('/dashboard/upload')}
                className="bg-gradient-to-r from-cookie-brown to-cookie-dark-brown text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Upload Your First Game</span>
                <span>→</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => router.push('/dashboard/upload')}
            className="group relative bg-gradient-to-br from-cookie-brown via-cookie-dark-brown to-cookie-chocolate text-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="text-xl font-bold mb-2">Upload New Game</h3>
              <p className="text-cookie-cream/90 text-sm">Share your latest creation</p>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => router.push('/dashboard/analytics')}
            className="group bg-white/60 backdrop-blur-sm border border-gray-200/60 p-6 lg:p-8 rounded-2xl hover:shadow-lg transition-all text-left relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cookie-cream to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">View Analytics</h3>
              <p className="text-gray-600 text-sm">Deep dive into your stats</p>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => router.push('/dashboard/earnings')}
            className="group bg-white/60 backdrop-blur-sm border border-gray-200/60 p-6 lg:p-8 rounded-2xl hover:shadow-lg transition-all text-left relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💰</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Check Earnings</h3>
              <p className="text-gray-600 text-sm">See how much you've made</p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

