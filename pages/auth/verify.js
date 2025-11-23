import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Button from '../../components/shared/Button';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function VerifyEmail() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        setStatus('error');
        setMessage('Email verification failed. The link may be invalid or expired.');
      } else {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      }
    };

    if (router.isReady) {
      handleEmailVerification();
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Verify Email - CookieJar</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cookie-cream to-white">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {status === 'verifying' && (
            <>
              <LoadingSpinner size="xl" className="mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Your Email
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-green-500 text-5xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-8">
                {message}
              </p>
              <Button
                size="lg"
                fullWidth
                onClick={() => router.push('/auth/signin')}
              >
                Continue to Dashboard
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="text-red-500 text-5xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-8">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/auth/signin')}
                >
                  Go to Sign In
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

