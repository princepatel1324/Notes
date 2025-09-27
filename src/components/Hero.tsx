import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, Brain, FileText, Search, Pin, Lock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] pt-24 sm:pt-20 md:pt-0">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#4deeea]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-[#4deeea]/15 rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 border border-[#4deeea]/10 -rotate-12 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-[#4deeea]/25 rotate-45 animate-pulse delay-700"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#4deeea]/20 to-transparent rotate-12"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#4deeea]/15 to-transparent -rotate-12"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-[#4deeea]/10 to-transparent rotate-6"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4deeea]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4deeea]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4deeea]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-left">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Ideas, 
              <span className="block bg-gradient-to-r from-[#4deeea] via-[#3dd9d4] to-[#2dc4be] bg-clip-text text-transparent">
                Supercharged
              </span>
              by AI
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Create, organize, and enhance your notes with the power of artificial intelligence. 
              Rich text editing, smart suggestions, and bulletproof security all in one place.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                <Brain className="h-5 w-5 text-[#4deeea]" />
                <span className="text-gray-300">AI Grammar Check</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="h-5 w-5 text-[#4deeea]" />
                <span className="text-gray-300">Smart Summaries</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-5 w-5 text-[#4deeea]" />
                <span className="text-gray-300">End-to-End Encryption</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <button className="group bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-8 py-4 rounded-full font-semibold text-lg hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Writing Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="text-gray-300 hover:text-white border border-[#4deeea] hover:border-[#3dd9d4] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-black/50">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right side - App mockup */}
          <div className="relative">
            <div className="bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-2xl p-6 shadow-2xl">
              {/* App header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4deeea]/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-sm">NotesAI</div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center space-x-2 mb-4 p-2 bg-[#4deeea]/20 rounded-lg">
                <button className="p-2 hover:bg-[#4deeea]/30 rounded text-gray-300 hover:text-white transition-colors">
                  <span className="font-bold text-sm">B</span>
                </button>
                <button className="p-2 hover:bg-[#4deeea]/30 rounded text-gray-300 hover:text-white transition-colors">
                  <span className="italic text-sm">I</span>
                </button>
                <button className="p-2 hover:bg-[#4deeea]/30 rounded text-gray-300 hover:text-white transition-colors">
                  <span className="underline text-sm">U</span>
                </button>
                <div className="w-px h-6 bg-[#4deeea]/50"></div>
                <button className="p-2 hover:bg-[#4deeea]/30 rounded text-gray-300 hover:text-white transition-colors">
                  <Brain className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-[#4deeea]/30 rounded text-gray-300 hover:text-white transition-colors">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              {/* Notes list */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3 p-3 bg-[#4deeea]/20 border border-[#4deeea]/30 rounded-lg">
                  <Pin className="h-4 w-4 text-[#4deeea]" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Meeting Notes</div>
                    <div className="text-gray-400 text-xs">AI-enhanced summary available</div>
                  </div>
                  <div className="w-2 h-2 bg-[#4deeea] rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                  <FileText className="h-4 w-4 text-[#4deeea]" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Project Ideas</div>
                    <div className="text-gray-400 text-xs">3 AI-suggested tags</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                  <Lock className="h-4 w-4 text-[#4deeea]" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Personal Journal</div>
                    <div className="text-gray-400 text-xs">Encrypted & secure</div>
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search notes..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4deeea] transition-colors"
                />
              </div>

              {/* AI indicator */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-[#4deeea] rounded-full animate-pulse"></div>
                <span>AI actively analyzing content</span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] p-3 rounded-xl shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] p-3 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;