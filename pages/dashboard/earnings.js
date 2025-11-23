import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/shared/Button';
import { FaDollarSign, FaDownload, FaCreditCard } from 'react-icons/fa';
import { getCreatorGames } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock earnings data
const mockMonthlyData = [
  { month: 'Jul', earnings: 450 },
  { month: 'Aug', earnings: 680 },
  { month: 'Sep', earnings: 890 },
  { month: 'Oct', earnings: 1200 },
  { month: 'Nov', earnings: 1450 },
  { month: 'Dec', earnings: 1890 },
];

const mockPaymentHistory = [
  { id: 1, date: '2024-01-15', amount: 1890, status: 'completed', method: 'PayPal' },
  { id: 2, date: '2023-12-15', amount: 1450, status: 'completed', method: 'Bank Transfer' },
  { id: 3, date: '2023-11-15', amount: 1200, status: 'completed', method: 'PayPal' },
];

export default function Earnings() {
  const { data: session } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    loadEarnings();
  }, [session]);

  async function loadEarnings() {
    if (!session?.user?.id) return;

    try {
      const gamesData = await getCreatorGames(session.user.id);
      setGames(gamesData);
      
      // Calculate current balance (mock calculation)
      const totalPlays = gamesData.reduce((sum, game) => sum + (game.play_count || 0), 0);
      const balance = totalPlays * 0.01; // $0.01 per play
      setCurrentBalance(balance);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  }

  const canPayout = currentBalance >= 50;

  return (
    <DashboardLayout>
      <Head>
        <title>Earnings - CookieJar Creator</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-600">
            Track your revenue and manage payouts
          </p>
        </motion.div>

        {/* Current Balance Card */}
        <motion.div
          className="bg-gradient-to-br from-cookie-brown to-cookie-dark-brown rounded-2xl p-8 text-white mb-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cookie-cream mb-2">Current Balance</p>
              <h2 className="text-5xl font-bold mb-4">
                {formatCurrency(currentBalance)}
              </h2>
              <p className="text-cookie-cream text-sm">
                {canPayout ? 'Ready for payout' : `Minimum payout: ${formatCurrency(50)}`}
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <FaDollarSign className="text-6xl" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button
              variant="secondary"
              disabled={!canPayout}
              icon={<FaCreditCard />}
            >
              Request Payout
            </Button>
            
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Payout Settings
            </Button>
          </div>
        </motion.div>

        {/* Earnings Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings Over Time</h2>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cookie-brown">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="earnings" fill="#D4A574" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Per-Game Earnings */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings by Game</h2>
            
            <div className="space-y-4">
              {games.length > 0 ? (
                games.map((game) => {
                  const gameEarnings = (game.play_count || 0) * 0.01;
                  return (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{game.title}</h3>
                          <p className="text-sm text-gray-500">
                            {game.play_count || 0} plays
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(gameEarnings)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No games yet
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
              <button className="text-cookie-brown hover:text-cookie-dark-brown text-sm font-semibold">
                <FaDownload className="inline mr-2" />
                Export
              </button>
            </div>
            
            <div className="space-y-3">
              {mockPaymentHistory.map((payment) => (
                <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(payment.date)}</span>
                    <span>{payment.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Revenue Breakdown */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(currentBalance * 0.7)}
              </div>
              <div className="text-sm text-gray-600">From Plays</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(currentBalance * 0.2)}
              </div>
              <div className="text-sm text-gray-600">From Engagement</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {formatCurrency(currentBalance * 0.1)}
              </div>
              <div className="text-sm text-gray-600">Bonuses</div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

