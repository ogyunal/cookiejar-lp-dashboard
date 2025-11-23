import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { FaSave, FaTrash } from 'react-icons/fa';
import { getCreatorProfile, updateCreatorProfile } from '../../lib/supabase';

export default function Settings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    twitter: '',
    youtube: '',
    itchio: '',
  });

  const [accountData, setAccountData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailUpdates: true,
    gameApprovals: true,
    earnings: true,
    newsletter: false,
  });

  useEffect(() => {
    loadProfile();
  }, [session]);

  async function loadProfile() {
    if (!session?.user?.id) return;

    try {
      const profile = await getCreatorProfile(session.user.id);
      if (profile) {
        setProfileData({
          username: profile.username || '',
          bio: profile.creator_bio || '',
          twitter: profile.twitter || '',
          youtube: profile.youtube || '',
          itchio: profile.itchio || '',
        });
        setAccountData(prev => ({
          ...prev,
          email: session.user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  }

  function handleAccountChange(e) {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  }

  function handleNotificationChange(e) {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = {
        username: profileData.username,
        creator_bio: profileData.bio,
        twitter: profileData.twitter,
        youtube: profileData.youtube,
        itchio: profileData.itchio,
      };

      const result = await updateCreatorProfile(session.user.id, updates);

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (accountData.newPassword !== accountData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    if (accountData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setLoading(false);
      return;
    }

    // Implement password change logic
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setAccountData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setLoading(false);
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your games and data. Are you absolutely sure?')) {
      return;
    }

    // Implement account deletion logic
    alert('Account deletion would happen here. Redirecting to sign out...');
    signOut({ callbackUrl: '/' });
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payout', label: 'Payout Info' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Settings - CookieJar Creator</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cookie-brown text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <Input
                      label="Username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      required
                    />

                    <Input
                      label="Bio"
                      type="textarea"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      placeholder="Tell us about yourself and your games"
                    />

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4">Social Links</h3>
                      
                      <div className="space-y-4">
                        <Input
                          label="Twitter"
                          name="twitter"
                          value={profileData.twitter}
                          onChange={handleProfileChange}
                          placeholder="@username"
                        />

                        <Input
                          label="YouTube"
                          name="youtube"
                          value={profileData.youtube}
                          onChange={handleProfileChange}
                          placeholder="Channel URL"
                        />

                        <Input
                          label="itch.io"
                          name="itchio"
                          value={profileData.itchio}
                          onChange={handleProfileChange}
                          placeholder="Profile URL"
                        />
                      </div>
                    </div>

                    {message.text && (
                      <div className={`p-4 rounded-lg ${
                        message.type === 'success'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      icon={<FaSave />}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900">{accountData.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Contact support to change your email address
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <h3 className="font-bold text-gray-900">Change Password</h3>

                    <Input
                      label="Current Password"
                      type="password"
                      name="currentPassword"
                      value={accountData.currentPassword}
                      onChange={handleAccountChange}
                      required
                    />

                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      value={accountData.newPassword}
                      onChange={handleAccountChange}
                      placeholder="At least 6 characters"
                      required
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="confirmPassword"
                      value={accountData.confirmPassword}
                      onChange={handleAccountChange}
                      required
                    />

                    {message.text && (
                      <div className={`p-4 rounded-lg ${
                        message.type === 'success'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="emailUpdates"
                        checked={notificationPrefs.emailUpdates}
                        onChange={handleNotificationChange}
                        className="mt-1 w-5 h-5 text-cookie-brown"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">Email Updates</span>
                        <span className="text-sm text-gray-600">Receive email notifications about important updates</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="gameApprovals"
                        checked={notificationPrefs.gameApprovals}
                        onChange={handleNotificationChange}
                        className="mt-1 w-5 h-5 text-cookie-brown"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">Game Status Updates</span>
                        <span className="text-sm text-gray-600">Get notified when your games are approved or need changes</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="earnings"
                        checked={notificationPrefs.earnings}
                        onChange={handleNotificationChange}
                        className="mt-1 w-5 h-5 text-cookie-brown"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">Earnings Reports</span>
                        <span className="text-sm text-gray-600">Monthly earnings summaries and payout notifications</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={notificationPrefs.newsletter}
                        onChange={handleNotificationChange}
                        className="mt-1 w-5 h-5 text-cookie-brown"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">Newsletter</span>
                        <span className="text-sm text-gray-600">Tips, best practices, and platform updates</span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-6">
                    <Button icon={<FaSave />}>
                      Save Preferences
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Payout Tab */}
              {activeTab === 'payout' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payout Information</h2>
                  
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <p className="text-blue-800">
                      Configure your payout method to receive your earnings. Minimum payout is $50.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="PayPal Email"
                      type="email"
                      placeholder="your@paypal.com"
                    />

                    <div className="text-center text-gray-500 my-4">OR</div>

                    <Input
                      label="Bank Account Number"
                      placeholder="Account number"
                    />

                    <Input
                      label="Routing Number"
                      placeholder="Routing number"
                    />

                    <Input
                      label="Account Holder Name"
                      placeholder="Full name on account"
                    />
                  </div>

                  <div className="mt-6">
                    <Button icon={<FaSave />}>
                      Save Payout Info
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Danger Zone</h2>
                  
                  <div className="border-2 border-red-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-red-600 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Once you delete your account, there is no going back. This will permanently delete all your games, analytics data, and earnings history.
                    </p>
                    
                    <Button
                      variant="danger"
                      icon={<FaTrash />}
                      onClick={handleDeleteAccount}
                    >
                      Delete My Account
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

