import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Button from '../../components/shared/Button';
import { FaTimesCircle, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';

export default function ApplicationRejected() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Application Not Approved - CookieJar Creator</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-cream to-white p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-500 text-5xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Not Approved
          </h1>

          <p className="text-gray-600 mb-6">
            Unfortunately, we're unable to approve your creator application at this time.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-bold text-gray-900 mb-3">What you can do:</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>Review our creator guidelines and requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>Contact our support team for more information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>Reapply in 30 days with updated information</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              icon={<FaEnvelope />}
              onClick={() => window.location.href = 'mailto:support@thecookiejar.app'}
              fullWidth
            >
              Contact Support
            </Button>

            <Button
              variant="ghost"
              icon={<FaSignOutAlt />}
              onClick={() => signOut({ callbackUrl: '/' })}
              fullWidth
            >
              Sign Out
            </Button>

            <p className="text-sm text-gray-500">
              Signed in as <strong>{session?.user?.email}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

