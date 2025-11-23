import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import GameCard from '../../components/dashboard/GameCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Button from '../../components/shared/Button';
import { FaPlus, FaSearch, FaFilter, FaThLarge, FaList } from 'react-icons/fa';
import { getCreatorGames } from '../../lib/supabase';

export default function MyGames() {
  const { data: session } = useSession();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadGames();
  }, [session]);

  useEffect(() => {
    filterGames();
  }, [games, searchQuery, filterStatus]);

  async function loadGames() {
    if (!session?.user?.id) return;

    try {
      const gamesData = await getCreatorGames(session.user.id);
      setGames(gamesData);
      setFilteredGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterGames() {
    let filtered = [...games];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(game => game.review_status === filterStatus);
    }

    setFilteredGames(filtered);
  }

  return (
    <DashboardLayout>
      <Head>
        <title>My Games - CookieJar Creator</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Games</h1>
            <p className="text-gray-600">
              {games.length} {games.length === 1 ? 'game' : 'games'} total
            </p>
          </div>

          <Button
            icon={<FaPlus />}
            onClick={() => router.push('/dashboard/upload')}
          >
            Upload New Game
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cookie-brown"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cookie-brown"
              >
                <option value="all">All Status</option>
                <option value="approved">Published</option>
                <option value="pending">In Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cookie-brown text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-cookie-brown text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Games Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : filteredGames.length > 0 ? (
          <motion.div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GameCard
                  game={game}
                  onEdit={() => router.push(`/dashboard/upload?edit=${game.id}`)}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this game?')) {
                      // Handle delete
                    }
                  }}
                  onViewAnalytics={() => router.push(`/dashboard/analytics?game=${game.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">
              {searchQuery || filterStatus !== 'all' ? '🔍' : '🎮'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all'
                ? 'No games found'
                : 'No games yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first game to get started'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => router.push('/dashboard/upload')}>
                Upload Your First Game
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

