import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { FaUpload, FaImage, FaCheck } from 'react-icons/fa';
import { createGame, uploadGameFile, uploadThumbnail } from '../../lib/supabase';
import { formatFileSize, generateId } from '../../lib/utils';

export default function UploadGame() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    version: '1.0.0',
    ageRating: '',
    enableAnalytics: true,
  });

  const [files, setFiles] = useState({
    pck: null,
    thumbnail: null,
  });

  const [previews, setPreviews] = useState({
    thumbnail: null,
  });

  const categories = [
    'Action',
    'Puzzle',
    'Arcade',
    'Adventure',
    'Strategy',
    'Casual',
    'Racing',
    'Sports',
    'RPG',
    'Other',
  ];

  const ageRatings = [
    'Everyone',
    'Everyone 10+',
    'Teen',
    'Mature 17+',
    'Adults Only',
  ];

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  }

  function handleFileChange(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    if (type === 'pck') {
      if (!file.name.endsWith('.pck')) {
        setError('Please upload a valid .pck file');
        return;
      }
      setFiles(prev => ({ ...prev, pck: file }));
    } else if (type === 'thumbnail') {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setFiles(prev => ({ ...prev, thumbnail: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }

    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!files.pck) {
        setError('Please upload a game file (.pck)');
        setLoading(false);
        return;
      }

      if (!files.thumbnail) {
        setError('Please upload a thumbnail image');
        setLoading(false);
        return;
      }

      const gameId = generateId();
      
      // Upload .pck file
      setUploadProgress(20);
      const pckResult = await uploadGameFile(files.pck, session.user.id, gameId);
      if (!pckResult.success) {
        throw new Error('Failed to upload game file');
      }

      // Upload thumbnail
      setUploadProgress(50);
      const thumbnailResult = await uploadThumbnail(files.thumbnail, session.user.id, gameId);
      if (!thumbnailResult.success) {
        throw new Error('Failed to upload thumbnail');
      }

      // Create game record
      setUploadProgress(80);
      const gameData = {
        id: gameId,
        creator_id: session.user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        version: formData.version,
        review_status: 'pending',
        is_active: false,
        play_count: 0,
        download_count: 0,
        total_play_time_seconds: 0,
        file_size_bytes: files.pck.size,
        created_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString(),
      };

      const result = await createGame(gameData);
      
      if (!result.success) {
        throw new Error('Failed to create game record');
      }

      setUploadProgress(100);
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/games');
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload game. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-white text-4xl" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Game Uploaded Successfully!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Your game has been submitted for review. We'll notify you once it's approved.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/dashboard/games')}>
                View My Games
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Upload Another
              </Button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Upload Game - CookieJar Creator</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Game</h1>
          <p className="text-gray-600 mb-8">
            Share your Godot game with millions of players worldwide
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Game Files Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Game Files</h2>
              
              <div className="space-y-6">
                {/* PCK File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Game File (.pck) <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cookie-brown transition-colors">
                    <input
                      type="file"
                      accept=".pck"
                      onChange={(e) => handleFileChange(e, 'pck')}
                      className="hidden"
                      id="pck-upload"
                    />
                    <label htmlFor="pck-upload" className="cursor-pointer">
                      <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                      {files.pck ? (
                        <>
                          <p className="font-semibold text-gray-900">{files.pck.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(files.pck.size)}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-900 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            .pck file (max 50MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thumbnail Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cookie-brown transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {previews.thumbnail ? (
                        <div className="max-w-md mx-auto">
                          <img 
                            src={previews.thumbnail} 
                            alt="Thumbnail preview"
                            className="rounded-lg mb-4"
                          />
                          <p className="text-sm text-gray-500">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
                          <p className="font-semibold text-gray-900 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG (recommended: 1080x1920)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Version */}
                <Input
                  label="Version"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="1.0.0"
                  required
                />
              </div>
            </div>

            {/* Game Details Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Game Details</h2>
              
              <div className="space-y-4">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter game title"
                  required
                />

                <Input
                  label="Description"
                  type="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your game (max 1000 characters)"
                  rows={5}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cookie-brown focus:ring-2 focus:ring-cookie-brown/20 outline-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="puzzle, casual, multiplayer (comma separated)"
                />
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age Rating
                  </label>
                  <select
                    name="ageRating"
                    value={formData.ageRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cookie-brown focus:ring-2 focus:ring-cookie-brown/20 outline-none"
                  >
                    <option value="">Select age rating</option>
                    {ageRatings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="enableAnalytics"
                    checked={formData.enableAnalytics}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-cookie-brown"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Enable Analytics</span>
                    <p className="text-sm text-gray-600">
                      Track plays, sessions, and player behavior
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cookie-brown transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/games')}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
                className="ml-auto"
              >
                {loading ? 'Uploading...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

