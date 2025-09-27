import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Pin, Edit3, Trash2, Menu, X, PinOff, FileText, Lock, Unlock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { getAllNotes, deleteNote, togglePinNote, toggleLockNote, verifyPasswordForLockedNote, Note } from '../services/notesService';

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned'>('all');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [error, setError] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'view' | 'unlock'>('view');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [noteToAccess, setNoteToAccess] = useState<Note | null>(null);

  // Load notes from database
  const loadNotes = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoadingNotes(true);
      } else {
        setIsSyncing(true);
      }
      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
      setLastSyncTime(new Date());
      setError('');
    } catch (error) {
      console.error('Error loading notes:', error);
      setError('Failed to load notes. Please try again.');
    } finally {
      if (showLoading) {
        setIsLoadingNotes(false);
      } else {
        setIsSyncing(false);
      }
    }
  };

  // Load notes when component mounts or user changes
  useEffect(() => {
    if (!loading && user) {
      loadNotes();
    }
  }, [loading, user]);

  // Polling effect for real-time updates
  useEffect(() => {
    if (!user) return;

    const pollInterval = setInterval(() => {
      // Only poll if we're not currently loading and have notes
      if (!isLoadingNotes && notes.length > 0) {
        loadNotes(false); // Silent refresh without loading indicator
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [user, isLoadingNotes, notes.length]);

  // Handle visibility change to prevent unnecessary reloads
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && !isLoadingNotes) {
        // Only refresh if it's been more than 5 minutes since last sync
        const now = new Date();
        const timeSinceLastSync = lastSyncTime ? now.getTime() - lastSyncTime.getTime() : Infinity;
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeSinceLastSync > fiveMinutes) {
          loadNotes(false); // Silent refresh
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, isLoadingNotes, lastSyncTime]);

  // Filter and search notes - moved before conditional returns
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply filter
    if (activeFilter === 'pinned') {
      filtered = filtered.filter(note => note.is_pinned);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort: pinned notes first, then by updated date
    return filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [notes, searchQuery, activeFilter]);

  // Redirect to sign in if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

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
                <FileText className="h-8 w-8 text-white animate-bounce" />
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
              Initializing NotesAI
            </h3>
            <p className="text-gray-400 text-sm">
              Setting up your secure workspace...
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

  const pinnedNotes = notes.filter(note => note.is_pinned);
  const totalNotes = notes.length;

  const toggleLock = async (noteId: string) => {
    try {
      const updatedNote = await toggleLockNote(noteId);
      if (updatedNote) {
        // Update the notes list with the updated note
        setNotes(prev => prev.map(note =>
          note.id === noteId ? updatedNote : note
        ));
      } else {
        setError('Failed to toggle lock status');
      }
    } catch (error) {
      console.error('Error toggling lock:', error);
      setError('Failed to toggle lock status');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setNoteToDelete(note);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      const success = await deleteNote(noteToDelete.id);
      if (success) {
        // Remove the note from the list
        setNotes(prev => prev.filter(note => note.id !== noteToDelete.id));
        setShowDeleteModal(false);
        setNoteToDelete(null);
      } else {
        setError('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const isValid = await verifyPasswordForLockedNote(password);
      if (isValid) {
        setIsPasswordVerified(true);
        setShowPasswordModal(false);
        setPassword('');
        
        // Navigate to note details page
        if (noteToAccess) {
          navigate(`/notes/view/${noteToAccess.id}`);
        }
      } else {
        setPasswordError('Incorrect password. Please try again.');
        setIsShaking(true);
        setPassword('');
        
        // Remove shake animation after it completes
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Failed to verify password. Please try again.');
      setIsShaking(true);
      setPassword('');
      
      // Remove shake animation after it completes
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit(e as any);
    }
  };

  const handleLockedNoteClick = (note: Note) => {
    if (note.is_encrypted) {
      setNoteToAccess(note);
      setPasswordAction('view');
      setShowPasswordModal(true);
    } else {
      navigate(`/notes/view/${note.id}`);
    }
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    // Strip HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
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


      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md border-r border-[#4deeea]/30 transform transition-transform duration-300 z-50 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#4deeea]/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">Notes</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            {totalNotes} notes • {pinnedNotes.length} pinned
            {lastSyncTime && (
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-[#4deeea] animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-xs">
                  {isSyncing ? 'Syncing...' : `Last sync: ${lastSyncTime.toLocaleTimeString()}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="p-6 space-y-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-[#4deeea]/20 text-[#4deeea] border border-[#4deeea]/30'
                : 'text-gray-400 hover:text-white hover:bg-black/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>All Notes</span>
              <span className="ml-auto text-xs bg-black/30 px-2 py-1 rounded-full">
                {totalNotes}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveFilter('pinned')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeFilter === 'pinned'
                ? 'bg-[#4deeea]/20 text-[#4deeea] border border-[#4deeea]/30'
                : 'text-gray-400 hover:text-white hover:bg-black/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Pin className="h-5 w-5" />
              <span>Pinned Notes</span>
              <span className="ml-auto text-xs bg-black/30 px-2 py-1 rounded-full">
                {pinnedNotes.length}
              </span>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="px-6 pb-6">
          <div className="bg-black/30 backdrop-blur-sm border border-[#4deeea]/20 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Quick Stats</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Total Notes</span>
                <span>{totalNotes}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Pinned</span>
                <span>{pinnedNotes.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Recent</span>
                <span>{notes.filter(n => new Date().getTime() - new Date(n.updated_at).getTime() < 7 * 24 * 60 * 60 * 1000).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0a1a1a]/90 via-[#1a2f2f]/90 to-[#0f1f1f]/90 backdrop-blur-md border-b border-[#4deeea]/30 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search Bar */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4deeea] focus:ring-1 focus:ring-[#4deeea] transition-all"
                />
                {searchQuery.trim() && (
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4deeea] hover:text-[#3dd9d4] transition-colors"
                    title="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* New Note Button */}
              <button
                onClick={() => setShowNewNoteModal(true)}
                className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="p-6 relative">
          {/* Loading State - Centered in Notes Board */}
          {isLoadingNotes && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md z-40 flex items-center justify-center rounded-xl">
              <div className="text-center flex flex-col items-center justify-center">
                {/* Animated Logo */}
                <div className="relative mb-8 flex items-center justify-center">
                  <div className="w-16 h-16 relative">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#4deeea]/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4deeea] animate-spin"></div>
                    
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] animate-pulse"></div>
                    
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white animate-bounce" />
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
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">
                    Loading Notes
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Syncing with cloud...
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
          )}

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first note to get started'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewNoteModal(true)}
                  className="bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200"
                >
                  Create First Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleLockedNoteClick(note)}
                  className={`group bg-black/50 backdrop-blur-sm border rounded-xl p-6 hover:bg-black/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                    note.is_pinned 
                      ? 'border-[#4deeea]/50 bg-[#4deeea]/5' 
                      : 'border-[#4deeea]/30 hover:border-[#4deeea]/50'
                  }`}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-2 flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#4deeea] transition-colors line-clamp-2">
                        {note.title}
                      </h3>
                      {note.is_encrypted && (
                        <div className="flex-shrink-0 mt-1">
                          <Lock className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    {note.is_pinned && (
                      <div className="flex-shrink-0 ml-2">
                        <Pin className="h-4 w-4 text-[#4deeea] fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Note Content Preview */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {truncateContent(note.content)}
                  </p>

                  {/* Note Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {formatDate(new Date(note.updated_at))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(note.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          note.is_encrypted
                            ? 'text-yellow-400 hover:bg-yellow-400/20'
                            : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20'
                        }`}
                        title={note.is_encrypted ? 'Unlock note' : 'Lock note'}
                      >
                        {note.is_encrypted ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          note.is_pinned
                            ? 'text-[#4deeea] hover:bg-[#4deeea]/20'
                            : 'text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20'
                        }`}
                        title={note.is_pinned ? 'Unpin note' : 'Pin note'}
                      >
                        {note.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(note.is_encrypted ? `/notes/encrypted/${note.id}` : `/notes/edit/${note.id}`);
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#4deeea] hover:bg-[#4deeea]/20 transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
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

      {/* New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] border border-[#4deeea]/30 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] bg-clip-text text-transparent">Create New Note</h3>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-400 mb-6">
              This is a placeholder modal. In the full implementation, this would contain a form to create a new note.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="flex-1 bg-black/50 border border-[#4deeea]/30 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Placeholder for creating note
                 navigate('/notes/new');
                  setShowNewNoteModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-4 py-2 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal - Full Screen Overlay */}
      {showPasswordModal && noteToAccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br from-[#0a1a1a]/95 via-[#1a2f2f]/95 to-[#0f1f1f]/95 backdrop-blur-md border border-[#4deeea]/30 rounded-2xl p-8 w-full max-w-md shadow-2xl ${isShaking ? 'animate-shake' : ''}`}>
            {/* Back Button */}
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassword('');
                setPasswordError('');
                setIsShaking(false);
                setNoteToAccess(null);
              }}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <X className="h-5 w-5" />
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
              Enter Password to View Note
            </h2>
            <p className="text-gray-400 text-center mb-8">
              This note is encrypted and requires a password to access
            </p>

            {/* Note Preview */}
            <div className="bg-black/30 border border-gray-700/50 rounded-lg p-3 mb-6">
              <h4 className="text-white font-medium mb-1">{noteToAccess.title}</h4>
              <p className="text-gray-400 text-sm line-clamp-2">
                {truncateContent(noteToAccess.content, 80)}
              </p>
            </div>

            {/* Password Input */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your account password"
                  className="w-full px-4 py-3 pr-12 bg-black/50 backdrop-blur-sm border border-[#4deeea]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4deeea] focus:ring-1 focus:ring-[#4deeea] transition-all"
                  autoFocus
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
              {passwordError && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!password.trim()}
                className="w-full bg-gradient-to-r from-[#4deeea] to-[#3dd9d4] text-black px-6 py-3 rounded-lg font-semibold hover:from-[#3dd9d4] hover:to-[#2dc4be] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>View Note</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noteToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a1a1a] via-[#1a2f2f] to-[#0f1f1f] border border-[#4deeea]/30 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Delete Note</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete this note?
              </p>
              <div className="bg-black/30 border border-gray-700/50 rounded-lg p-3">
                <h4 className="text-white font-medium mb-1">{noteToDelete.title}</h4>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {truncateContent(noteToDelete.content, 80)}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteNote}
                className="flex-1 bg-black/50 border border-[#4deeea]/30 text-white px-4 py-3 rounded-lg hover:bg-black/70 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNote}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
};

export default NotesPage;