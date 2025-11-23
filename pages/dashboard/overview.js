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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name}! 👋
          </h1>
          <p className="text-gray-600">
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
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Plays Over Time</h2>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cookie-brown">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="plays" 
                stroke="#D4A574" 
                strokeWidth={3}
                dot={{ fill: '#D4A574', r: 4 }}
                activeDot={{ r: 6 }}
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
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No games yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first game to get started
              </p>
              <button
                onClick={() => router.push('/dashboard/upload')}
                className="btn-primary-custom"
              >
                Upload Your First Game
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => router.push('/dashboard/upload')}
            className="bg-gradient-to-br from-cookie-brown to-cookie-dark-brown text-white p-6 rounded-xl hover:shadow-lg transition-shadow text-left"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="text-lg font-bold mb-1">Upload New Game</h3>
            <p className="text-cookie-cream text-sm">Share your latest creation</p>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/analytics')}
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-cookie-brown hover:shadow-lg transition-all text-left"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold mb-1 text-gray-900">View Analytics</h3>
            <p className="text-gray-600 text-sm">Deep dive into your stats</p>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/earnings')}
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-cookie-brown hover:shadow-lg transition-all text-left"
          >
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold mb-1 text-gray-900">Check Earnings</h3>
            <p className="text-gray-600 text-sm">See how much you've made</p>
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

