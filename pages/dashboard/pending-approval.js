import { useSession, signOut } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Button from '../../components/shared/Button';
import { FaClock, FaSignOutAlt } from 'react-icons/fa';

export default function PendingApproval() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Application Pending - CookieJar Creator</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-cream to-white p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaClock className="text-orange-500 text-5xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Under Review
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for applying to become a CookieJar creator! Our team is reviewing your application.
          </p>

          <div className="bg-cookie-cream p-6 rounded-lg mb-8 text-left">
            <h2 className="font-bold text-gray-900 mb-3">What happens next?</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>Our team will review your application within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>You'll receive an email once your application is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-brown">•</span>
                <span>Once approved, you can start uploading games immediately</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
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

