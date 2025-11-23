import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { FaArrowLeft } from 'react-icons/fa';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard/overview');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password. Please try again.');
      } else {
        // Successful sign in - NextAuth will handle redirect based on creator status
        router.push('/dashboard/overview');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // If already authenticated, show nothing (redirecting)
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - CookieJar Creator Dashboard</title>
        <meta name="description" content="Sign in to your CookieJar creator account" />
      </Head>

      <div className="min-h-screen flex cookie-jar-pattern">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cookie-brown to-cookie-dark-brown text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="text-5xl">🍪</div>
              <span className="text-3xl font-bold">CookieJar</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              Welcome Back, Creator
            </h1>
            
            <p className="text-xl text-cookie-cream mb-12">
              Sign in to manage your games, track analytics, and grow your audience.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Real-time Analytics</h3>
                  <p className="text-cookie-cream">Track every play, like, and share</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Earn from Plays</h3>
                  <p className="text-cookie-cream">Get paid for what you create</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌍</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Global Reach</h3>
                  <p className="text-cookie-cream">Millions of players worldwide</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-cookie-cream">
            © 2024 CookieJar. All rights reserved.
          </div>
        </div>
        
        {/* Right side - Sign in form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back to home link */}
            <a
              href={
                typeof window !== 'undefined' && window.location.hostname === 'localhost'
                  ? 'http://localhost:3000/'
                  : 'https://thecookiejar.app/'
              }
              className="inline-flex items-center gap-2 text-gray-600 hover:text-cookie-brown mb-8 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </a>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your creator dashboard
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cookie-brown"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                
                <a
                  href="#"
                  className="text-sm text-cookie-brown hover:text-cookie-dark-brown font-semibold"
                >
                  Forgot password?
                </a>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <span className="text-gray-900 font-semibold">
                  Sign up in the CookieJar mobile app
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Download from App Store or Google Play, then sign in here to become a creator
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                By signing in, you agree to our{' '}
                <a href="#" className="text-cookie-brown underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cookie-brown underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

