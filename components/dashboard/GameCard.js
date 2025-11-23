import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaEllipsisV, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';
import { formatNumber, formatDate, getStatusColor, getStatusText } from '../../lib/utils';
import { getThumbnailUrl } from '../../lib/supabase';
import { useState } from 'react';

export default function GameCard({ game, onEdit, onDelete, onViewAnalytics }) {
  const [showMenu, setShowMenu] = useState(false);
  
  // Get thumbnail URL from storage
  const thumbnailUrl = getThumbnailUrl(game.creator_id, game.id);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-6xl">🎮</span></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🎮</span>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${getStatusColor(game.review_status)} badge-sm`}>
            {getStatusText(game.review_status)}
          </span>
        </div>
        
        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              <FaEllipsisV className="text-gray-700" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      onEdit(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onViewAnalytics(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
                  >
                    <FaChartBar />
                    <span>Analytics</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onDelete(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-left border-t border-gray-100"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {game.title}
        </h3>
        
        {game.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {game.description}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaPlay className="text-cookie-brown" />
            <span>{formatNumber(game.play_count || 0)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FaHeart className="text-pink-500" />
            <span>{formatNumber(game.download_count || 0)}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Updated {formatDate(game.last_updated_at || game.created_at)}</span>
          {game.version && (
            <span className="font-mono">v{game.version}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

