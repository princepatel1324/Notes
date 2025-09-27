import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, FileX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md w-full">
          {/* Error Icon */}
          <div className="flex justify-center mb-8 animate-bounce">
            <div className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] p-4 rounded-full">
              <FileX className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* 404 Heading */}
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#4deeea] via-[#3dd9d4] to-[#2dc4be] bg-clip-text text-transparent mb-4 animate-fade-in">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 animate-fade-in-delay-1">
            Page Not Found
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed animate-fade-in-delay-2">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-8 py-4 rounded-full font-semibold text-lg hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 w-full sm:w-auto"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Back to Home</span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-white border border-[#4deeea] hover:border-[#3dd9d4] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-black/50 flex items-center space-x-2 w-full sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 animate-fade-in-delay-4">
            <p className="text-gray-500 text-sm mb-4">
              Need help? Here are some quick links:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button
                onClick={() => navigate('/notes')}
                className="text-[#4deeea] hover:text-[#3dd9d4] transition-colors duration-200"
              >
                My Notes
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => navigate('/settings')}
                className="text-[#4deeea] hover:text-[#3dd9d4] transition-colors duration-200"
              >
                Settings
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => navigate('/#features')}
                className="text-[#4deeea] hover:text-[#3dd9d4] transition-colors duration-200"
              >
                Features
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out 0.8s both;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;