import React from 'react';
import { PenTool, Sparkles, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] border-t border-[#4deeea]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <PenTool className="h-8 w-8 text-[#4deeea]" />
                <Sparkles className="h-4 w-4 text-[#4deeea] absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
                NotesAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Transform your note-taking experience with AI-powered features, rich text editing, 
              and enterprise-grade security. Your ideas deserve the best tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#4deeea] transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4deeea] transition-colors duration-200">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4deeea] transition-colors duration-200">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4deeea] transition-colors duration-200">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">AI Tools</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Integrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[#4deeea]/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 NotesAI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for writers and thinkers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;