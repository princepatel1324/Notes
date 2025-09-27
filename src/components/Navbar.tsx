import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, PenTool, Sparkles, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to home page after successful sign out
      navigate('/');
      // Close mobile menu if open
      setIsOpen(false);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0a1a1a]/80 via-[#1a2f2f]/80 to-[#0f1f1f]/80 backdrop-blur-md border-b border-[#4deeea]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <PenTool className="h-8 w-8 text-[#4deeea]" />
              <Sparkles className="h-4 w-4 text-[#4deeea] absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
              NotesAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/notes" className="text-gray-300 hover:text-white transition-colors duration-200">
              My Notes
            </Link>
            
            <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">
              Features
            </a>
            <Link to="/settings" className="text-gray-300 hover:text-white transition-colors duration-200">
              Settings
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-2 rounded-full hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 inline-block"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-r from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md border-t border-[#4deeea]/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link to="/notes" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                My Notes
              </Link>
              <Link to="/settings" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                Settings
              </Link>
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                Features
              </a>
              <a href="#ai-powered" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                AI Tools
              </a>
              <div className="border-t border-[#4deeea]/30 pt-3 mt-3">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-gray-300 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                      Sign In
                    </Link>
                    <Link 
                      to="/signup"
                      className="mt-2 block w-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-2 rounded-full hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;