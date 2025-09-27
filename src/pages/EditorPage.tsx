import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNoteById, createNote, updateNote, Note } from '../services/notesService';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  ArrowLeft,
  ChevronDown,
  PenTool
} from 'lucide-react';

const EditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Note');
  const [fontSize, setFontSize] = useState('16');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [isNewNote, setIsNewNote] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Redirect to sign in if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Load existing note data if ID is provided - moved before conditional returns
  useEffect(() => {
    const loadNote = async () => {
      if (id && id !== 'new') {
        try {
          const existingNote = await getNoteById(id);
          if (existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setIsNewNote(false);
            setHasUnsavedChanges(false);
            // Set editor content only if it's different from current content
            if (editorRef.current && editorRef.current.innerHTML !== existingNote.content) {
              editorRef.current.innerHTML = existingNote.content;
            }
          } else {
            // Note not found, redirect to notes page
            navigate('/notes');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          setError('Failed to load note');
          navigate('/notes');
        }
      } else {
        // New note - only reset if we're actually creating a new note
        if (isNewNote === false) {
          setIsNewNote(true);
          setTitle('Untitled Note');
          setContent('');
          setHasUnsavedChanges(false);
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        }
      }
    };

    if (!loading && user) {
      loadNote();
    }
  }, [id, navigate, loading, user]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !title.trim()) return;

    const autoSaveTimer = setTimeout(async () => {
      if (!isNewNote && id) {
        try {
          const currentContent = editorRef.current?.innerHTML || '';
          await updateNote(id, {
            title: title.trim(),
            content: currentContent
          });
          setHasUnsavedChanges(false);
          console.log('Auto-saved note');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, hasUnsavedChanges, isNewNote, id]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] flex items-center justify-center relative overflow-hidden">
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

        <div className="text-center relative z-10 flex flex-col items-center justify-center w-full h-full">
          {/* Animated Logo */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-20 h-20 relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#4deeea]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4deeea] animate-spin"></div>
              
              {/* Inner pulsing circle */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] animate-pulse"></div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PenTool className="h-8 w-8 text-white animate-bounce" />
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-[#4deeea] rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-[#3dd9d4] rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-[#4deeea] rounded-full animate-ping animation-delay-700"></div>
            <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-[#3dd9d4] rounded-full animate-ping animation-delay-500"></div>
          </div>
          
          {/* Loading text with animation */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
              Preparing Editor
            </h3>
            <p className="text-gray-400 text-sm">
              Loading your writing workspace...
            </p>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-[#4deeea] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#4deeea] rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-[#4deeea] rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
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


  // Update formatting state based on current selection
  const updateFormattingState = () => {
    if (document.queryCommandSupported) {
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
    document.execCommand(command, false, value);
    updateFormattingState();
    if (editorRef.current) {
      editorRef.current.focus();
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
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
    updateFormattingState();
  };

  const handleEditorKeyUp = () => {
    updateFormattingState();
  };

  const handleEditorMouseUp = () => {
    updateFormattingState();
  };

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      // Get the current content from the editor
      const currentContent = editorRef.current?.innerHTML || '';
      
      // Validate title
      if (!title.trim()) {
        setError('Please enter a title for your note');
        setIsSaving(false);
        return;
      }
      
      if (isNewNote) {
        // Create new note
        const newNote = await createNote({
          title: title.trim(),
          content: currentContent,
          is_pinned: false,
          is_encrypted: false
        });
        
        console.log('Created new note:', newNote);
        setShowSuccess(true);
        setHasUnsavedChanges(false);
        
        // Auto-dismiss success toast after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
        // Navigate back to NotesPage after creating note
        setTimeout(() => {
          navigate('/notes');
        }, 1000);
      } else {
        // Update existing note
        const updatedNote = await updateNote(id!, {
          title: title.trim(),
          content: currentContent
        });
        
        if (updatedNote) {
          console.log('Updated note:', updatedNote);
          setShowSuccess(true);
          setHasUnsavedChanges(false);
          
          // Auto-dismiss success toast after 3 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          
          // Show success message briefly then navigate back
          setTimeout(() => {
            navigate('/notes');
          }, 1000);
        } else {
          setError('Failed to update note. Note not found.');
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
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

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] flex items-center space-x-2 animate-slide-in">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[60] flex items-center space-x-3 animate-slide-in border border-green-400/30 backdrop-blur-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-green-400/20 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {isNewNote ? 'Note Created!' : 'Note Updated!'}
            </span>
            <span className="text-xs text-green-100">
              {isNewNote ? 'Your note has been saved successfully' : 'Your changes have been saved'}
            </span>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-2 text-green-100 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}



      {/* Main Editor Area */}
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
              
              <div className="text-sm text-gray-400">
                {isNewNote ? 'Creating new note' : 'Editing note'}
                {hasUnsavedChanges && <span className="ml-2 text-yellow-400">• Unsaved changes</span>}
              </div>
              
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full text-2xl font-bold bg-transparent text-white placeholder-gray-400 border-none outline-none mb-4"
              placeholder="Untitled Note"
            />

            {/* Editor Toolbar */}
            <div className="flex items-center space-x-2 flex-wrap gap-2">
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
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onKeyUp={handleEditorKeyUp}
              onMouseUp={handleEditorMouseUp}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full min-h-[500px] bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#4deeea] focus:border-transparent text-gray-800 leading-relaxed"
              data-placeholder="Start writing your note..."
            />
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-full font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-xl z-40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="h-5 w-5" />
        <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
      </button>

      <style>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
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
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        
        .animate-slide-out {
          animation: slide-out 0.3s ease-in;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default EditorPage;