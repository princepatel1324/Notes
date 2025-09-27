import React from 'react';
import { 
  Edit3, 
  Brain, 
  Shield, 
  Search, 
  Pin, 
  Sparkles, 
  Languages, 
  RotateCcw,
  Zap,
  Lock,
  Eye,
  Tag
} from 'lucide-react';

const Features = () => {
  const coreFeatures = [
    {
      icon: <Edit3 className="h-8 w-8" />,
      title: "Custom Rich Text Editor",
      description: "Built from scratch with all essential formatting tools. Bold, italic, underline, alignment, and dynamic font sizing.",
      color: "purple"
    },
    {
      icon: <Pin className="h-8 w-8" />,
      title: "Smart Note Management",
      description: "Create, edit, delete, and organize notes effortlessly. Pin important notes to the top with visual indicators.",
      color: "blue"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Intelligent Search",
      description: "Find any note instantly by searching through titles and content with advanced search algorithms.",
      color: "emerald"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Note Encryption",
      description: "Password-protect sensitive notes with military-grade encryption. Your privacy, guaranteed.",
      color: "red"
    }
  ];

  const aiFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Auto Glossary Highlighting",
      description: "Key terms are automatically highlighted with hover definitions and detailed explanations.",
      color: "purple"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Summarization",
      description: "Get instant 1-2 line summaries of your notes powered by advanced AI models.",
      color: "blue"
    },
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Smart Tag Suggestions",
      description: "AI analyzes your content and suggests 3-5 relevant tags for better organization.",
      color: "emerald"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Grammar Check",
      description: "Real-time grammar checking with smart underlines for grammatical errors.",
      color: "yellow"
    },
    {
      icon: <Languages className="h-6 w-6" />,
      title: "Multi-language Translation",
      description: "Translate your notes to multiple languages with AI-powered translation.",
      color: "indigo"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "AI Insights",
      description: "Get intelligent recommendations and key point highlights based on your content.",
      color: "pink"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "from-[#4deeea] to-[#3dd9d4]",
      blue: "from-[#4deeea] to-[#3dd9d4]", 
      emerald: "from-[#4deeea] to-[#3dd9d4]",
      red: "from-[#4deeea] to-[#3dd9d4]",
      yellow: "from-[#4deeea] to-[#3dd9d4]",
      indigo: "from-[#4deeea] to-[#3dd9d4]",
      pink: "from-[#4deeea] to-[#3dd9d4]"
    };
    return colors[color as keyof typeof colors] || "from-[#4deeea] to-[#3dd9d4]";
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4deeea]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4deeea]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Core Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
            </span>
            <span className="block bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
              Write Better
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Powerful features designed to enhance your writing experience and boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {coreFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-2xl p-6 hover:bg-black/70 hover:border-[#4deeea]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${getColorClasses(feature.color)} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {React.cloneElement(feature.icon, { className: "h-8 w-8 text-white" })}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* AI Features */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#4deeea]/20 to-[#3dd9d4]/20 backdrop-blur-sm border border-[#4deeea]/30 rounded-full px-6 py-2 mb-6">
            <Brain className="h-5 w-5 text-[#4deeea]" />
            <span className="text-[#4deeea] font-medium">AI-Powered Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Artificial Intelligence
            <span className="block bg-gradient-to-r from-[#4deeea] via-[#3dd9d4] to-[#2dc4be] bg-clip-text text-transparent">
              At Your Fingertips
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300"
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${getColorClasses(feature.color)} mb-4`}>
                {React.cloneElement(feature.icon, { className: "h-6 w-6 text-white" })}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bonus Features */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-5 w-5 text-[#4deeea]" />
            <span className="text-[#4deeea] font-medium">Bonus Features</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <RotateCcw className="h-6 w-6 text-[#4deeea]" />
                <h3 className="text-lg font-semibold text-white">Version History</h3>
              </div>
              <p className="text-gray-400 text-sm">Track changes and restore previous versions of your notes with complete version control.</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="h-6 w-6 text-[#4deeea]" />
                <h3 className="text-lg font-semibold text-white">Responsive Design</h3>
              </div>
              <p className="text-gray-400 text-sm">Seamlessly works across desktop, tablet, and mobile with touch-optimized interfaces.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;