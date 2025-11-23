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
      className="group bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-200/60 transition-all duration-300"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cookie-cream to-cookie-light"><span class="text-6xl">🎮</span></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cookie-cream to-cookie-light">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🎮</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(game.review_status)}`}>
            {getStatusText(game.review_status)}
          </span>
        </div>
        
        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
            >
              <FaEllipsisV className="text-gray-700 text-sm" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <button
                    onClick={() => {
                      onEdit(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-cookie-brown w-full text-left transition-all text-sm font-medium"
                  >
                    <FaEdit className="text-xs" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onViewAnalytics(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-cookie-brown w-full text-left transition-all text-sm font-medium"
                  >
                    <FaChartBar className="text-xs" />
                    <span>Analytics</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onDelete(game);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 w-full text-left border-t border-gray-100 transition-all text-sm font-medium"
                  >
                    <FaTrash className="text-xs" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-cookie-brown transition-colors">
          {game.title}
        </h3>
        
        {game.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cookie-cream/30 rounded-lg">
            <FaPlay className="text-cookie-brown text-xs" />
            <span className="font-semibold text-gray-700">{formatNumber(game.play_count || 0)}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-lg">
            <FaHeart className="text-pink-500 text-xs" />
            <span className="font-semibold text-gray-700">{formatNumber(game.download_count || 0)}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
          <span className="text-gray-500">Updated {formatDate(game.last_updated_at || game.created_at)}</span>
          {game.version && (
            <span className="font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">v{game.version}</span>
          )}
        </div>
      </div>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cookie-brown to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

