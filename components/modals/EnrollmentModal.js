import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { supabase } from '../../lib/supabase';
import { isValidEmail } from '../../lib/utils';

const STEPS = ['profile', 'verification', 'agreement', 'confirmation'];

export default function EnrollmentModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    experience: '',
    portfolio: '',
    twitter: '',
    youtube: '',
    itchio: '',
    agreedToTerms: false,
    agreedToReview: false,
    agreedToOriginal: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Profile
        if (!formData.username || !formData.email || !formData.password) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!isValidEmail(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        return true;
      
      case 1: // Verification
        if (!formData.experience) {
          setError('Please select your experience level');
          return false;
        }
        return true;
      
      case 2: // Agreement
        if (!formData.agreedToTerms || !formData.agreedToReview || !formData.agreedToOriginal) {
          setError('Please agree to all terms to continue');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 2) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create creator profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: formData.username,
              creator_bio: formData.bio || null,
              is_creator: true,
              creator_joined_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        // Move to confirmation step
        setCurrentStep(3);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={currentStep !== 3 ? onClose : undefined}
        />
        
        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {/* Close button */}
          {currentStep !== 3 && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          )}
          
          <div className="p-8">
            {/* Progress indicator */}
            {currentStep !== 3 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {STEPS.slice(0, 3).map((step, index) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index <= currentStep 
                          ? 'bg-cookie-brown text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {index < currentStep ? <FaCheck /> : index + 1}
                      </div>
                      {index < 2 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          index < currentStep ? 'bg-cookie-brown' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step content */}
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Creator Account
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Let's get you set up to start publishing games
                  </p>
                  
                  <div className="space-y-4">
                    <Input
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                      required
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                    
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      required
                    />
                    
                    <Input
                      label="Creator Bio"
                      type="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your games (optional)"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}
              
              {currentStep === 1 && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Experience & Portfolio
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Help us understand your background
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Game Development Experience
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
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
                    
                    <Input
                      label="Portfolio or Previous Games"
                      name="portfolio"
                      value={formData.portfolio}
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
                </motion.div>
              )}
              
              {currentStep === 2 && (
                <motion.div
                  key="agreement"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Terms & Conditions
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please review and agree to the following
                  </p>
                  
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
                        I understand that my games must pass review before being published
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
                </motion.div>
              )}
              
              {currentStep === 3 && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-white text-4xl" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to CookieJar Creators!
                  </h2>
                  
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We've sent a verification email to <strong>{formData.email}</strong>.
                    Please check your inbox and click the link to verify your account.
                  </p>
                  
                  <Button
                    size="lg"
                    onClick={() => window.location.href = '/auth/signin'}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}
            
            {/* Navigation buttons */}
            {currentStep < 3 && (
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="ml-auto"
                >
                  {loading ? 'Processing...' : currentStep === 2 ? 'Create Account' : 'Next'}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

