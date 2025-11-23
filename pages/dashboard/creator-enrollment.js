import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { supabase } from '../../lib/supabase';
import { FaCheck } from 'react-icons/fa';

export default function CreatorEnrollment() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    bio: '',
    yearsExperience: '',
    portfolioUrl: '',
    twitter: '',
    youtube: '',
    itchio: '',
    agreedToTerms: false,
    agreedToReview: false,
    agreedToOriginal: false,
  });

  useEffect(() => {
    // Check if already enrolled
    if (session?.user?.creatorStatus === 'pending' || session?.user?.creatorStatus === 'approved') {
      router.push('/dashboard/overview');
    }
  }, [session, router]);

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate
    if (!formData.yearsExperience) {
      setError('Please select your experience level');
      setLoading(false);
      return;
    }

    if (!formData.agreedToTerms || !formData.agreedToReview || !formData.agreedToOriginal) {
      setError('Please agree to all terms to continue');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          creator_bio: formData.bio || null,
          years_experience: formData.yearsExperience,
          portfolio_url: formData.portfolioUrl || null,
          twitter: formData.twitter || null,
          youtube: formData.youtube || null,
          itchio: formData.itchio || null,
          creator_status: 'pending',
          is_creator: true,
          creator_application_submitted_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setSubmitted(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/overview');
      }, 3000);

    } catch (err) {
      console.error('Enrollment error:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-cream to-white p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-white text-4xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for applying to become a creator. We'll review your application and get back to you soon.
          </p>

          <div className="bg-cookie-cream p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>What's next?</strong><br/>
              Our team will review your application within 24-48 hours. You'll receive an email once approved.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Become a Creator - CookieJar</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-cream to-white p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 text-center">
            <div className="text-6xl mb-4">🍪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a CookieJar Creator
            </h1>
            <p className="text-gray-600">
              Tell us about yourself and your game development experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* About You */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About You</h2>

              <div className="space-y-4">
                <Input
                  label="Creator Bio"
                  type="textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself and your games"
                  rows={4}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Game Development Experience
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cookie-brown focus:ring-2 focus:ring-cookie-brown/20 outline-none"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Portfolio & Social Links */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio & Social Links</h2>

              <div className="space-y-4">
                <Input
                  label="Portfolio or Previous Games"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="Link to your portfolio, itch.io page, etc. (optional)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />

                  <Input
                    label="YouTube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="Channel URL"
                  />

                  <Input
                    label="itch.io"
                    name="itchio"
                    value={formData.itchio}
                    onChange={handleInputChange}
                    placeholder="Profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-cookie-brown"
                  />
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-cookie-brown underline">
                      Creator Terms & Conditions
                    </a>
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="agreedToReview"
                    checked={formData.agreedToReview}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-cookie-brown"
                  />
                  <span className="text-gray-700">
                    I understand that my application and games must pass review before being published
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="agreedToOriginal"
                    checked={formData.agreedToOriginal}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-cookie-brown"
                  />
                  <span className="text-gray-700">
                    I confirm that my games are original content and do not violate any copyrights
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="ml-auto"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

