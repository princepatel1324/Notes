import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNoteById, deleteNote, togglePinNote, toggleLockNote, Note } from '../services/notesService';
import { aiService, AISummary, AITags, GrammarError, GlossaryTerm } from '../services/aiService';
import GlossaryHighlighter from '../components/GlossaryHighlighter';
import GrammarChecker from '../components/GrammarChecker';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Pin, 
  PinOff, 
  Calendar, 
  Clock, 
  FileText, 
  Lock,
  Unlock,
  User,
  Brain,
  Sparkles,
  Tag,
  CheckCircle,
  BookOpen,
  X
} from 'lucide-react';

const NoteDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [activeAiFeature, setActiveAiFeature] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [aiLoading, setAiLoading] = useState<{[key: string]: boolean}>({});
  const [aiData, setAiData] = useState<{
    summary?: AISummary;
    tags?: AITags;
    grammar?: GrammarError[];
    glossary?: GlossaryTerm[];
  }>({});

  // Redirect to sign in if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const fetchedNote = await getNoteById(id);
        if (fetchedNote) {
          setNote(fetchedNote);
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

  // Handle visibility change to prevent reloading when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Polling for real-time updates when page is visible
  useEffect(() => {
    if (!id || !user || !isVisible || isLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const fetchedNote = await getNoteById(id);
        if (fetchedNote && note) {
          // Only update if there are actual changes
          if (fetchedNote.updated_at !== note.updated_at) {
            setNote(fetchedNote);
          }
        }
      } catch (error) {
        console.error('Error polling note updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [id, user, isVisible, isLoading, note]);

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

        <div className="text-center relative z-10 flex flex-col items-center justify-center w-full h-full">
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#4deeea]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4deeea] animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white animate-bounce" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
              Loading Note Details
            </h3>
            <p className="text-gray-400 text-sm">
              Fetching note information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const handleTogglePin = async () => {
    if (!note) return;

    try {
      const updatedNote = await togglePinNote(note.id);
      if (updatedNote) {
        setNote(updatedNote);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      setError('Failed to toggle pin status');
    }
  };

  const handleToggleLock = async () => {
    if (!note) return;

    try {
      const updatedNote = await toggleLockNote(note.id);
      if (updatedNote) {
        setNote(updatedNote);
      }
    } catch (error) {
      console.error('Error toggling lock:', error);
      setError('Failed to toggle lock status');
    }
  };


  const handleDeleteNote = async () => {
    if (!note) return;

    try {
      const success = await deleteNote(note.id);
      if (success) {
        navigate('/notes');
      } else {
        setError('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const handleAiFeatureClick = async (feature: string) => {
    console.log('NoteDetailsPage: AI feature clicked:', feature);
    
    if (activeAiFeature === feature) {
      setActiveAiFeature(null);
      return;
    }

    setActiveAiFeature(feature);
    
    // If we don't have data for this feature, load it
    if (!aiData[feature as keyof typeof aiData] && note) {
      console.log('NoteDetailsPage: Loading AI data for feature:', feature);
      setAiLoading(prev => ({ ...prev, [feature]: true }));
      
      try {
        const plainText = aiService.stripHtmlTags(note.content);
        console.log('NoteDetailsPage: Plain text extracted:', plainText.substring(0, 100) + '...');
        
        switch (feature) {
          case 'summary':
            console.log('NoteDetailsPage: Calling generateSummary...');
            const summary = await aiService.generateSummary(plainText);
            console.log('NoteDetailsPage: Summary received:', summary);
            setAiData(prev => ({ ...prev, summary }));
            break;
          case 'tags':
            const tags = await aiService.generateTags(plainText);
            setAiData(prev => ({ ...prev, tags }));
            break;
          case 'grammar':
            const grammar = await aiService.checkGrammar(plainText);
            setAiData(prev => ({ ...prev, grammar }));
            break;
          case 'glossary':
            const glossary = await aiService.generateGlossary(plainText);
            setAiData(prev => ({ ...prev, glossary }));
            break;
        }
      } catch (error) {
        console.error(`Error loading AI ${feature}:`, error);
        setError(`Failed to load AI ${feature}`);
      } finally {
        setAiLoading(prev => ({ ...prev, [feature]: false }));
      }
    } else {
      console.log('NoteDetailsPage: AI data already exists for feature:', feature);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4deeea]/20 border-t-[#4deeea] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading note details...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {error || 'Note not found'}
          </h3>
          <button
            onClick={() => navigate('/notes')}
            className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

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
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] flex items-center space-x-2">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Mobile AI Panel Overlay */}
      {aiPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setAiPanelOpen(false)}
        />
      )}

      {/* AI Features Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md border-l border-[#4deeea]/30 transform transition-transform duration-300 z-50 lg:translate-x-0 ${aiPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Panel Header */}
        <div className="p-6 border-b border-[#4deeea]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-[#4deeea]" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">AI Features</h2>
            </div>
            <button
              onClick={() => setAiPanelOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="p-6 space-y-4 overflow-y-auto h-full pb-32">
          {/* AI Feature Buttons */}
          <div className="space-y-3">
            {/* AI Summary Button */}
            <button
              onClick={() => handleAiFeatureClick('summary')}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                activeAiFeature === 'summary'
                  ? 'bg-[#4deeea]/20 border-[#4deeea] text-white'
                  : 'bg-black/30 border-[#4deeea]/20 text-gray-300 hover:bg-[#4deeea]/10 hover:border-[#4deeea]/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-[#4deeea]" />
                <span className="font-medium">AI Summary</span>
                {aiLoading.summary && (
                  <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin ml-auto"></div>
                )}
              </div>
            </button>

            {/* Suggested Tags Button */}
            <button
              onClick={() => handleAiFeatureClick('tags')}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                activeAiFeature === 'tags'
                  ? 'bg-[#4deeea]/20 border-[#4deeea] text-white'
                  : 'bg-black/30 border-[#4deeea]/20 text-gray-300 hover:bg-[#4deeea]/10 hover:border-[#4deeea]/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-[#4deeea]" />
                <span className="font-medium">Suggested Tags</span>
                {aiLoading.tags && (
                  <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin ml-auto"></div>
                )}
              </div>
            </button>

            {/* Grammar Check Button */}
            <button
              onClick={() => handleAiFeatureClick('grammar')}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                activeAiFeature === 'grammar'
                  ? 'bg-[#4deeea]/20 border-[#4deeea] text-white'
                  : 'bg-black/30 border-[#4deeea]/20 text-gray-300 hover:bg-[#4deeea]/10 hover:border-[#4deeea]/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#4deeea]" />
                <span className="font-medium">Grammar Check</span>
                {aiLoading.grammar && (
                  <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin ml-auto"></div>
                )}
              </div>
            </button>

            {/* Glossary Button */}
            <button
              onClick={() => handleAiFeatureClick('glossary')}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                activeAiFeature === 'glossary'
                  ? 'bg-[#4deeea]/20 border-[#4deeea] text-white'
                  : 'bg-black/30 border-[#4deeea]/20 text-gray-300 hover:bg-[#4deeea]/10 hover:border-[#4deeea]/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-[#4deeea]" />
                <span className="font-medium">Glossary</span>
                {aiLoading.glossary && (
                  <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin ml-auto"></div>
                )}
              </div>
            </button>
          </div>

          {/* AI Feature Content */}
          {activeAiFeature && (
            <div className="mt-6 bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-lg p-4">
              {activeAiFeature === 'summary' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-[#4deeea]" />
                    <h3 className="font-semibold text-white">AI Summary</h3>
                  </div>
                  {aiLoading.summary ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin"></div>
                      <span className="text-sm">Generating summary...</span>
                    </div>
                  ) : aiData.summary ? (
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{aiData.summary.summary}</p>
                      {aiData.summary.keyPoints.length > 0 && (
                        <div>
                          <h4 className="text-white text-xs font-medium mb-2">Key Points:</h4>
                          <ul className="space-y-1">
                            {aiData.summary.keyPoints.map((point, index) => (
                              <li key={index} className="text-gray-400 text-xs flex items-start space-x-2">
                                <span className="text-[#4deeea] mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Click to generate AI summary</p>
                  )}
                </div>
              )}

              {activeAiFeature === 'tags' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-5 w-5 text-[#4deeea]" />
                    <h3 className="font-semibold text-white">Suggested Tags</h3>
                  </div>
                  {aiLoading.tags ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin"></div>
                      <span className="text-sm">Generating tags...</span>
                    </div>
                  ) : aiData.tags ? (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {aiData.tags.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#4deeea]/20 border border-[#4deeea]/30 rounded-full text-xs text-[#4deeea] hover:bg-[#4deeea]/30 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs">
                        Confidence: {Math.round(aiData.tags.confidence * 100)}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Click to generate AI tags</p>
                  )}
                </div>
              )}

              {activeAiFeature === 'grammar' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-[#4deeea]" />
                    <h3 className="font-semibold text-white">Grammar Check</h3>
                  </div>
                  {aiLoading.grammar ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin"></div>
                      <span className="text-sm">Checking grammar...</span>
                    </div>
                  ) : aiData.grammar ? (
                    <div>
                      {aiData.grammar.length > 0 ? (
                        <div className="space-y-2">
                          {aiData.grammar.map((error, index) => (
                            <div key={index} className="p-2 bg-black/30 rounded border border-gray-700/50">
                              <p className="text-gray-300 text-xs mb-1">
                                <span className="line-through text-red-400">{error.text}</span>
                              </p>
                              <p className="text-green-400 text-xs">
                                <span className="font-medium">Suggested:</span> {error.suggestion}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-400 text-sm">✓ No grammar errors found!</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Click to check grammar</p>
                  )}
                </div>
              )}

              {activeAiFeature === 'glossary' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <BookOpen className="h-5 w-5 text-[#4deeea]" />
                    <h3 className="font-semibold text-white">Glossary</h3>
                  </div>
                  {aiLoading.glossary ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-[#4deeea]/30 border-t-[#4deeea] rounded-full animate-spin"></div>
                      <span className="text-sm">Generating glossary...</span>
                    </div>
                  ) : aiData.glossary ? (
                    <div>
                      {aiData.glossary.length > 0 ? (
                        <div className="space-y-2">
                          {aiData.glossary.map((item, index) => (
                            <div key={index} className="p-2 bg-black/30 rounded border border-gray-700/50">
                              <p className="text-[#4deeea] text-sm font-medium">{item.term}</p>
                              <p className="text-gray-400 text-xs">{item.definition}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No key terms identified</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Click to generate glossary</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] border border-[#4deeea]/30 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Delete Note</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete this note?
              </p>
              <div className="bg-black/30 border border-gray-700/50 rounded-lg p-3">
                <h4 className="text-white font-medium mb-1">{note.title}</h4>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {stripHtmlTags(note.content).substring(0, 80)}...
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-black/50 border border-[#4deeea]/30 text-white px-4 py-3 rounded-lg hover:bg-black/70 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteNote();
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:mr-80 relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a1a1a]/90 via-[#1a2f2f]/90 to-[#0f1f1f]/90 backdrop-blur-md border border-[#4deeea]/30 rounded-xl mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Notes</span>
              </button>
              
              <button
                onClick={() => setAiPanelOpen(true)}
                className="lg:hidden flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Brain className="h-5 w-5" />
                <span>AI Features</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleLock}
                className={`p-2 rounded-lg transition-colors ${
                  note.is_encrypted
                    ? 'text-yellow-400 bg-yellow-400/20'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20'
                }`}
                title={note.is_encrypted ? 'Unlock note' : 'Lock note'}
              >
                {note.is_encrypted ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </button>
              <button
                onClick={handleTogglePin}
                className={`p-2 rounded-lg transition-colors ${
                  note.is_pinned
                    ? 'text-[#4deeea] bg-[#4deeea]/20'
                    : 'text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20'
                }`}
                title={note.is_pinned ? 'Unpin note' : 'Pin note'}
              >
                {note.is_pinned ? <PinOff className="h-5 w-5" /> : <Pin className="h-5 w-5" />}
              </button>
              <button
                onClick={() => navigate(note.is_encrypted ? `/notes/encrypted/${note.id}` : `/notes/edit/${note.id}`)}
                className="p-2 rounded-lg text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20 transition-colors"
                title="Edit note"
              >
                <Edit3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                title="Delete note"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Note Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              {note.title}
              {note.is_pinned && (
                <Pin className="h-7 w-7 text-[#4deeea] fill-current" />
              )}
              {note.is_encrypted && (
                <Lock className="h-7 w-7 text-yellow-400" />
              )}
            </h1>
          </div>
        </div>

        {/* Note Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Calendar className="h-5 w-5 text-[#4deeea]" />
              <h3 className="font-semibold text-white">Created</h3>
            </div>
            <p className="text-gray-300 text-sm">{formatDate(note.created_at)}</p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-[#4deeea]" />
              <h3 className="font-semibold text-white">Last Updated</h3>
            </div>
            <p className="text-gray-300 text-sm">{formatDate(note.updated_at)}</p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <User className="h-5 w-5 text-[#4deeea]" />
              <h3 className="font-semibold text-white">Status</h3>
            </div>
            <div className="flex items-center justify-center space-x-2">
              {note.is_pinned && (
                <span className="px-3 py-1 bg-[#4deeea]/20 border border-[#4deeea]/30 rounded-full text-xs text-[#4deeea] font-medium">
                  Pinned
                </span>
              )}
              {note.is_encrypted && (
                <span className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-xs text-yellow-400 font-medium">
                  Encrypted
                </span>
              )}
              {!note.is_pinned && !note.is_encrypted && (
                <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-xs text-gray-400 font-medium">
                  Standard
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Note Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200/50">
          <div className="prose prose-lg max-w-none">
            {aiData.glossary && aiData.glossary.length > 0 ? (
              <GlossaryHighlighter
                content={note.content || '<p class="text-gray-500 italic">This note is empty.</p>'}
                glossaryTerms={aiData.glossary}
                className="text-gray-800 leading-relaxed text-left"
              />
            ) : aiData.grammar && aiData.grammar.length > 0 ? (
              <GrammarChecker
                content={note.content || '<p class="text-gray-500 italic">This note is empty.</p>'}
                grammarErrors={aiData.grammar}
                className="text-gray-800 leading-relaxed text-left"
              />
            ) : (
              <div 
                className="text-gray-800 leading-relaxed text-left"
                dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-gray-500 italic">This note is empty.</p>' }}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default NoteDetailsPage;
