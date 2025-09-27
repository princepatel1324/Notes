import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNoteById, updateNote, verifyPasswordForLockedNote, Note } from '../services/notesService';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Shield, 
  Edit3, 
  Save,
  AlertCircle,
  CheckCircle,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown
} from 'lucide-react';

const EncryptedNotePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [note, setNote] = useState<Note | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

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

  const fontSizes = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
    { value: '24', label: '24px' }
  ];


  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const fetchedNote = await getNoteById(id);
        if (fetchedNote) {
          setNote(fetchedNote);
          setNoteTitle(fetchedNote.title);
          setNoteContent(fetchedNote.content);
        } else {
          setError('Note not found');
          setTimeout(() => navigate('/notes'), 2000);
        }
      } catch (error) {
        console.error('Error loading note:', error);
        setError('Failed to load note');
        setTimeout(() => navigate('/notes'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      loadNote();
    }
  }, [id, user, loading, navigate]);

  // Update formatting state based on current selection
  const updateFormattingState = () => {
    if (document.queryCommandSupported && isEditing) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      
      // Check text alignment
      const align = document.queryCommandValue('justifyLeft') ? 'left' :
                   document.queryCommandValue('justifyCenter') ? 'center' :
                   document.queryCommandValue('justifyRight') ? 'right' : 'left';
      setTextAlign(align);
    }
  };

  // Execute formatting command
  const execCommand = (command: string, value?: string) => {
    if (isEditing) {
      document.execCommand(command, false, value);
      updateFormattingState();
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const toggleBold = () => {
    execCommand('bold');
  };

  const toggleItalic = () => {
    execCommand('italic');
  };

  const toggleUnderline = () => {
    execCommand('underline');
  };

  const setAlignment = (alignment: string) => {
    const commands = {
      'left': 'justifyLeft',
      'center': 'justifyCenter',
      'right': 'justifyRight'
    };
    execCommand(commands[alignment as keyof typeof commands]);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    setShowFontDropdown(false);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}px`;
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setNoteContent(editorRef.current.innerHTML);
    }
    updateFormattingState();
  };

  const handleEditorKeyUp = () => {
    updateFormattingState();
  };

  const handleEditorMouseUp = () => {
    updateFormattingState();
  };

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyPasswordForLockedNote(password);
      if (isValid) {
        setIsUnlocked(true);
        setIsPasswordVerified(true);
        setError('');
        
        // Set initial content for rich text editor
        setTimeout(() => {
          if (editorRef.current && note) {
            editorRef.current.innerHTML = note.content;
          }
        }, 100);
      } else {
        setError('Incorrect password. Please try again.');
        setIsShaking(true);
        setPassword('');
        
        // Remove shake animation after it completes
        setTimeout(() => setIsShaking(false), 500);
        
        // Focus input again
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Failed to verify password. Please try again.');
      setIsShaking(true);
      setPassword('');
      
      // Remove shake animation after it completes
      setTimeout(() => setIsShaking(false), 500);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const handleSave = async () => {
    if (!note || !isPasswordVerified) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const currentContent = editorRef.current?.innerHTML || '';
      const updatedNote = await updateNote(note.id, {
        title: noteTitle.trim(),
        content: currentContent
      });
      
      if (updatedNote) {
        setNote(updatedNote);
        setNoteContent(currentContent);
        console.log('Encrypted note saved successfully');
        
        // Show success feedback
        setTimeout(() => {
          navigate('/notes');
        }, 1000);
      } else {
        setError('Failed to save note');
      }
    } catch (error) {
      console.error('Error saving encrypted note:', error);
      setError('Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && editorRef.current) {
      // When entering edit mode, ensure content is set
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = noteContent;
          updateFormattingState();
        }
      }, 100);
    }
  };

  if (!isUnlocked) {
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

        {/* Password Modal Overlay */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md border border-[#4deeea]/30 rounded-2xl p-8 w-full max-w-md shadow-2xl ${isShaking ? 'animate-shake' : ''}`}>
            {/* Back Button */}
            <button
              onClick={() => navigate('/notes')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Notes</span>
            </button>

            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] p-4 rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
              Enter Password to Unlock Note
            </h2>
            <p className="text-gray-400 text-center mb-8">
              This note is encrypted and requires a password to access
            </p>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4deeea] focus:ring-1 focus:ring-[#4deeea] transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Unlock Button */}
            <button
              onClick={handleUnlock}
              disabled={isLoading || !password.trim()}
              className="w-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Unlock Note</span>
                </>
              )}
            </button>

            {/* Hint */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Hint: Try "1234" for demo purposes
            </p>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  // Unlocked Note Content
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

      <div className="relative z-10">
        {/* Top Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0a1a1a]/90 via-[#1a2f2f]/90 to-[#0f1f1f]/90 backdrop-blur-md border-b border-[#4deeea]/30 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Notes</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">Unlocked</span>
                </div>
                <button
                  onClick={toggleEditMode}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isEditing 
                      ? 'bg-[#4deeea]/20 text-[#4deeea] border border-[#4deeea]/30' 
                      : 'text-gray-400 hover:text-white hover:bg-black/30'
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:inline">{isEditing ? 'View Mode' : 'Edit Mode'}</span>
                </button>
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              readOnly={!isEditing || !isPasswordVerified}
              className={`w-full text-2xl font-bold bg-transparent text-white placeholder-gray-400 border-none outline-none mb-4 ${
                isEditing && isPasswordVerified ? 'cursor-text' : 'cursor-default'
              }`}
              placeholder={note?.title || "Untitled Encrypted Note"}
            />

            {/* Editor Toolbar - Only show in edit mode and when password is verified */}
            {isEditing && isPasswordVerified && (
              <div className="flex items-center space-x-2 flex-wrap gap-2 mb-4">
                {/* Formatting Buttons */}
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-lg p-1">
                  <button
                    onClick={toggleBold}
                    className={`p-2 rounded transition-colors ${
                      isBold 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleItalic}
                    className={`p-2 rounded transition-colors ${
                      isItalic 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleUnderline}
                    className={`p-2 rounded transition-colors ${
                      isUnderline 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                </div>

                {/* Alignment Buttons */}
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-lg p-1">
                  <button
                    onClick={() => setAlignment('left')}
                    className={`p-2 rounded transition-colors ${
                      textAlign === 'left' 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAlignment('center')}
                    className={`p-2 rounded transition-colors ${
                      textAlign === 'center' 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAlignment('right')}
                    className={`p-2 rounded transition-colors ${
                      textAlign === 'right' 
                        ? 'text-[#4deeea] bg-[#4deeea]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-[#4deeea]/20'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Font Size Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-sm">{fontSize}px</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showFontDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gradient-to-b from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] backdrop-blur-md border border-[#4deeea]/30 rounded-lg shadow-xl z-50">
                      {fontSizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => handleFontSizeChange(size.value)}
                          className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#4deeea]/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Note Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div
              ref={editorRef}
              contentEditable={isEditing && isPasswordVerified}
              onInput={handleEditorInput}
              onKeyUp={handleEditorKeyUp}
              onMouseUp={handleEditorMouseUp}
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full min-h-[500px] bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200/50 text-gray-800 leading-relaxed ${
                isEditing && isPasswordVerified 
                  ? 'focus:outline-none focus:ring-2 focus:ring-[#4deeea] focus:border-transparent cursor-text' 
                  : 'cursor-default'
              }`}
              data-placeholder="Start writing your encrypted note..."
            />
          </div>
        </div>
      </div>

      {/* Save Button (only visible in edit mode and when password is verified) */}
      {isEditing && isPasswordVerified && (
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-full font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-xl z-40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Note</span>
            </>
          )}
        </button>
      )}

      <style>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default EncryptedNotePage;