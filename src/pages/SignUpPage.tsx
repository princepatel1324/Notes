import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  PenTool, 
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Sign up with Supabase (without email verification)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined, // Disable email verification
        }
      });

      if (error) {
        // Handle signup error
        setErrors({ 
          general: error.message || 'An error occurred during signup' 
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Signup successful
        setIsLoading(false);
        setShowSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/notes');
        }, 1500);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Signup error:', error);
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      });
      setIsLoading(false);
    }
  };


  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-400' };
      case 2: return { text: 'Weak', color: 'text-orange-400' };
      case 3: return { text: 'Fair', color: 'text-yellow-400' };
      case 4: return { text: 'Good', color: 'text-blue-400' };
      case 5: return { text: 'Strong', color: 'text-green-400' };
      default: return { text: '', color: '' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#4deeea]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-[#4deeea]/15 rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 border border-[#4deeea]/10 -rotate-12 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-[#4deeea]/25 rotate-45 animate-pulse delay-700"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4deeea]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4deeea]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4deeea]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="h-5 w-5" />
          <span>Account created! Welcome to NotesAI!</span>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          {/* Sign Up Card */}
          <div className="bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-2xl p-8 shadow-2xl">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="relative">
                  <PenTool className="h-10 w-10 text-[#4deeea]" />
                  <Sparkles className="h-5 w-5 text-[#4deeea] absolute -top-1 -right-1" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
                  NotesAI
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-400">Join thousands of users who trust NotesAI</p>
            </div>


            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error Display */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4deeea] transition-all ${
                      errors.email ? 'border-red-500' : 'border-[#4deeea]/30 focus:border-[#4deeea]'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-black/50 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4deeea] transition-all ${
                      errors.password ? 'border-red-500' : 'border-[#4deeea]/30 focus:border-[#4deeea]'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength <= 1 ? 'bg-red-500' :
                            passwordStrength <= 2 ? 'bg-orange-500' :
                            passwordStrength <= 3 ? 'bg-yellow-500' :
                            passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${strengthInfo.color}`}>
                        {strengthInfo.text}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-black/50 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4deeea] transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[#4deeea]/30 focus:border-[#4deeea]'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-600 text-[#4deeea] focus:ring-[#4deeea] focus:ring-offset-0 bg-black/50"
                  />
                  <span className="text-sm text-gray-400 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#4deeea] hover:text-[#3dd9d4] transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[#4deeea] hover:text-[#3dd9d4] transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.terms}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-[#4deeea] hover:text-[#3dd9d4] font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;