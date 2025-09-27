import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Settings, 
  Moon, 
  Sun, 
  Type, 
  Brain, 
  CheckCircle, 
  User, 
  LogOut,
  Save,
  ChevronDown
} from 'lucide-react';

interface AISettings {
  grammarCheck: boolean;
  glossaryHighlights: boolean;
  suggestedTags: boolean;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // State management
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [aiSettings, setAiSettings] = useState<AISettings>({
    grammarCheck: true,
    glossaryHighlights: true,
    suggestedTags: false
  });
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Redirect to sign in if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4deeea] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const fontSizeOptions = [
    { value: 'small', label: 'Small (14px)' },
    { value: 'medium', label: 'Medium (16px)' },
    { value: 'large', label: 'Large (18px)' }
  ];

  // Toggle switch component
  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-gray-400 text-sm mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4deeea] focus:ring-offset-2 focus:ring-offset-gray-800 ${
          enabled ? 'bg-[#4deeea]' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Preferences card component
  const PreferencesCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <div className="bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-xl p-6 hover:bg-black/60 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] rounded-lg">
          {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-white" })}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="border-t border-[#4deeea]/20 pt-4">
        {children}
      </div>
    </div>
  );

  const handleAISettingChange = (setting: keyof AISettings, value: boolean) => {
    setAiSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
    
    console.log('Settings saved:', { theme, fontSize, aiSettings });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Mock logout
      console.log('User logged out');
      navigate('/');
    }
  };

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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="h-5 w-5" />
          <span>Preferences saved!</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0a1a1a]/90 via-[#1a2f2f]/90 to-[#0f1f1f]/90 backdrop-blur-md border-b border-[#4deeea]/30 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Notes</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-[#4deeea]" />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
                  Settings & Preferences
                </h1>
              </div>
              
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Appearance Settings */}
            <PreferencesCard
              title="Appearance"
              icon={<Moon />}
            >
              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <div className="text-white font-medium">Theme</div>
                    <div className="text-gray-400 text-sm mt-1">Choose your preferred color scheme</div>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        theme === 'light' 
                          ? 'bg-[#4deeea] text-black' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        theme === 'dark' 
                          ? 'bg-[#4deeea] text-black' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">Dark</span>
                    </button>
                  </div>
                </div>

                {/* Font Size Dropdown */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <div className="text-white font-medium">Font Size</div>
                    <div className="text-gray-400 text-sm mt-1">Adjust text size for better readability</div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowFontDropdown(!showFontDropdown)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors min-w-[140px] justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Type className="h-4 w-4" />
                        <span className="text-sm">
                          {fontSizeOptions.find(opt => opt.value === fontSize)?.label}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showFontDropdown && (
                      <div className="absolute top-full right-0 mt-1 bg-gradient-to-b from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] backdrop-blur-md border border-[#4deeea]/30 rounded-lg shadow-xl z-50 min-w-[140px]">
                        {fontSizeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFontSize(option.value as 'small' | 'medium' | 'large');
                              setShowFontDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#4deeea]/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </PreferencesCard>

            {/* AI Features Settings */}
            <PreferencesCard
              title="AI Features"
              icon={<Brain />}
            >
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={aiSettings.grammarCheck}
                  onChange={(value) => handleAISettingChange('grammarCheck', value)}
                  label="Grammar Check"
                  description="Automatically check for grammar and spelling errors"
                />
                <ToggleSwitch
                  enabled={aiSettings.glossaryHighlights}
                  onChange={(value) => handleAISettingChange('glossaryHighlights', value)}
                  label="Glossary Highlights"
                  description="Highlight important terms with definitions"
                />
                <ToggleSwitch
                  enabled={aiSettings.suggestedTags}
                  onChange={(value) => handleAISettingChange('suggestedTags', value)}
                  label="Suggested Tags"
                  description="Get AI-powered tag suggestions for your notes"
                />
              </div>
            </PreferencesCard>

            {/* Account Settings */}
            <PreferencesCard
              title="Account"
              icon={<User />}
            >
              <div className="space-y-4">
                <button className="w-full sm:w-auto bg-gray-700/50 border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Manage Account</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full sm:w-auto bg-red-600/20 border border-red-600/50 text-red-400 px-6 py-3 rounded-lg hover:bg-red-600/30 hover:text-red-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </PreferencesCard>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-full font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
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

export default SettingsPage;