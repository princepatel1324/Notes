import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Pin, Edit3, Trash2, PinOff, FileText, Lock, ArrowLeft } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  isEncrypted?: boolean;
}

// Mock data for search results
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Q4 Planning',
    content: 'Discussed quarterly goals, budget allocation, and team restructuring. Key points: increase marketing spend by 20%, hire 3 new developers, focus on mobile app development. Next steps: Schedule follow-up meeting for next week.',
    isPinned: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'AI-powered note-taking app, Real-time collaboration features, Voice-to-text integration, Smart categorization system. Consider implementing machine learning for auto-tagging.',
    isPinned: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Recipe: Chocolate Chip Cookies',
    content: '2 cups flour, 1 cup butter, 3/4 cup brown sugar, 1/2 cup white sugar, 2 eggs, 2 tsp vanilla extract, 1 tsp baking soda, 1 tsp salt, 2 cups chocolate chips. Bake at 375°F for 9-11 minutes.',
    isPinned: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Book Recommendations',
    content: 'The Pragmatic Programmer, Clean Code, Design Patterns, System Design Interview, Atomic Habits, Deep Work. Focus on technical books for career development.',
    isPinned: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '5',
    title: 'Travel Itinerary - Japan',
    content: 'Day 1: Tokyo - Shibuya, Harajuku. Day 2: Kyoto - Fushimi Inari, Kiyomizu-dera. Day 3: Osaka - Dotonbori, Osaka Castle. Don\'t forget to try authentic ramen and sushi.',
    isPinned: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '6',
    title: 'Workout Plan',
    content: 'Monday: Chest & Triceps, Tuesday: Back & Biceps, Wednesday: Legs, Thursday: Shoulders, Friday: Cardio, Weekend: Rest. Focus on progressive overload and proper form.',
    isPinned: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: '7',
    title: 'Confidential Project Notes',
    content: 'This note contains sensitive information about the new product launch and is password protected.',
    isPinned: true,
    isEncrypted: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  }
];

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [notes, setNotes] = useState<Note[]>(mockNotes);

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

  // Filter notes based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      // Sort by relevance: pinned first, then by updated date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, searchQuery]);

  // Highlight search terms in text
  const highlightSearchTerm = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className="bg-yellow-300 text-gray-900 px-1 rounded font-semibold">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleNoteClick = (note: Note) => {
    if (note.isEncrypted) {
      navigate(`/notes/encrypted/${note.id}`);
    } else {
      navigate(`/notes/${note.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f]">
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
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0a1a1a]/90 via-[#1a2f2f]/90 to-[#0f1f1f]/90 backdrop-blur-md border-b border-[#4deeea]/30 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Notes</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <Search className="h-8 w-8 text-[#4deeea]" />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
                  Search Results
                </h1>
              </div>
              
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>

            {/* Search Query Display */}
            <div className="text-center">
              <p className="text-gray-300 text-lg">
                Results for: <span className="text-[#4deeea] font-semibold">"{searchQuery}"</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchResults.length} {searchResults.length === 1 ? 'note' : 'notes'} found
              </p>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!searchQuery.trim() ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No search query</h3>
              <p className="text-gray-500">Enter a search term to find your notes</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">
                No notes match your search for "{searchQuery}"
              </p>
              <button
                onClick={() => navigate('/notes')}
                className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200"
              >
                Back to All Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((note) => (
                <div
                  key={note.id}
                  className={`group bg-black/50 backdrop-blur-sm border rounded-xl p-6 hover:bg-black/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                    note.isPinned 
                      ? 'border-[#4deeea]/50 bg-[#4deeea]/5' 
                      : 'border-[#4deeea]/30 hover:border-[#4deeea]/50'
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-2 flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#4deeea] transition-colors line-clamp-2">
                        {highlightSearchTerm(note.title, searchQuery)}
                      </h3>
                      {note.isEncrypted && (
                        <div className="flex-shrink-0 mt-1">
                          <Lock className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    {note.isPinned && (
                      <div className="flex-shrink-0 ml-2">
                        <Pin className="h-4 w-4 text-[#4deeea] fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Note Content Preview */}
                  <div className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {highlightSearchTerm(truncateContent(note.content), searchQuery)}
                  </div>

                  {/* Note Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {formatDate(note.updatedAt)}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          note.isPinned
                            ? 'text-[#4deeea] hover:bg-[#4deeea]/20'
                            : 'text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20'
                        }`}
                        title={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNoteClick(note);
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20 transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;