import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { FaPlay, FaUsers, FaClock, FaPercentage } from 'react-icons/fa';
import { getCreatorGames } from '../../lib/supabase';
import { formatNumber, generateMockAnalytics } from '../../lib/utils';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#D4A574', '#8B6F47', '#5D4E37', '#FFF8E7'];

export default function Analytics() {
  const { data: session } = useSession();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, [session]);

  useEffect(() => {
    if (selectedGame) {
      loadAnalytics();
    }
  }, [selectedGame, dateRange]);

  async function loadGames() {
    if (!session?.user?.id) return;

    try {
      const gamesData = await getCreatorGames(session.user.id);
      setGames(gamesData);
      
      // Select first game by default or from query
      const gameId = router.query.game;
      const defaultGame = gameId 
        ? gamesData.find(g => g.id === gameId)
        : gamesData[0];
      
      setSelectedGame(defaultGame);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  }

  function loadAnalytics() {
    // Generate mock analytics data
    const data = generateMockAnalytics(parseInt(dateRange));
    setAnalyticsData(data);
  }

  const totalPlays = analyticsData.reduce((sum, day) => sum + day.plays, 0);
  const totalUniquePlayers = analyticsData.reduce((sum, day) => sum + day.uniquePlayers, 0);
  const avgSessionDuration = 245; // seconds
  const completionRate = 68; // percentage

  // Mock geographic data
  const geoData = [
    { name: 'USA', value: 35 },
    { name: 'UK', value: 20 },
    { name: 'Canada', value: 15 },
    { name: 'Others', value: 30 },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Analytics - CookieJar Creator</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">
            Deep dive into your game's performance and player behavior
          </p>
        </motion.div>

        {/* Game Selector and Date Range */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Game
              </label>
              <select
                value={selectedGame?.id || ''}
                onChange={(e) => {
                  const game = games.find(g => g.id === e.target.value);
                  setSelectedGame(game);
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cookie-brown"
                disabled={games.length === 0}
              >
                {games.length === 0 ? (
                  <option>No games available</option>
                ) : (
                  games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cookie-brown"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {selectedGame ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Plays"
                value={formatNumber(totalPlays)}
                icon={<FaPlay />}
                color="blue"
                trend="up"
                trendValue="+12%"
              />
              
              <StatCard
                title="Unique Players"
                value={formatNumber(totalUniquePlayers)}
                icon={<FaUsers />}
                color="green"
                trend="up"
                trendValue="+8%"
              />
              
              <StatCard
                title="Avg Session"
                value={`${avgSessionDuration}s`}
                icon={<FaClock />}
                color="purple"
              />
              
              <StatCard
                title="Completion Rate"
                value={`${completionRate}%`}
                icon={<FaPercentage />}
                color="orange"
                trend="up"
                trendValue="+5%"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Plays Over Time */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Plays Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="plays" 
                      stroke="#D4A574" 
                      strokeWidth={2}
                      dot={{ fill: '#D4A574', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Player Distribution */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Player Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={geoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {geoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Daily Comparison */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Plays vs Unique Players</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="plays" fill="#D4A574" name="Plays" />
                  <Bar dataKey="uniquePlayers" fill="#8B6F47" name="Unique Players" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Retention Metrics */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Player Retention</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-cookie-brown mb-2">78%</div>
                  <div className="text-sm text-gray-600">Day 1 Retention</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-cookie-brown mb-2">45%</div>
                  <div className="text-sm text-gray-600">Day 7 Retention</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-cookie-brown mb-2">28%</div>
                  <div className="text-sm text-gray-600">Day 30 Retention</div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No games to analyze
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first game to start seeing analytics
            </p>
            <button
              onClick={() => router.push('/dashboard/upload')}
              className="btn-primary-custom"
            >
              Upload Your First Game
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

