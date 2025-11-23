import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import { FaTimesCircle } from 'react-icons/fa';

export default function DashboardLayout({ children, allowPending = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const isCreator = session.user.isCreator;
      const creatorStatus = session.user.creatorStatus;
      const currentPath = router.pathname;

      // Check if user is a creator first
      if (!isCreator) {
        // Not a creator - shouldn't have access
        return;
      }

      // Don't redirect if already on enrollment or pending pages
      if (currentPath === '/dashboard/creator-enrollment' || currentPath === '/dashboard/pending-approval') {
        return;
      }

      // Redirect based on creator status
      if (creatorStatus === 'user') {
        // First time signing in - needs to enroll
        router.push('/dashboard/creator-enrollment');
      } else if (creatorStatus === 'pending' && !allowPending) {
        // Application pending - show pending page
        router.push('/dashboard/pending-approval');
      } else if (creatorStatus === 'rejected') {
        // Application rejected
        router.push('/dashboard/rejected');
      }
      // If 'approved', allow access to dashboard
    }
  }, [status, session, router, allowPending]);

  // Redirect to sign in if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Check if user is a creator
  if (status === 'authenticated' && session?.user && !session.user.isCreator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-cream to-white p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be an approved creator to access this dashboard. Only users who have been enrolled as creators can access this area.
          </p>
          <Button 
            onClick={() => window.location.href = 'https://thecookiejar.app'} 
            fullWidth
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (session?.user?.creatorStatus === 'user' && router.pathname !== '/dashboard/creator-enrollment') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Show pending message if pending and not on allowed page
  if (session?.user?.creatorStatus === 'pending' && !allowPending && router.pathname !== '/dashboard/pending-approval') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cookie-cream/10">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

