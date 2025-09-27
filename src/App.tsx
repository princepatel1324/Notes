import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import NoteDetailsPage from './pages/NoteDetailsPage';
import EditorPage from './pages/EditorPage';
import EncryptedNotePage from './pages/EncryptedNotePage';
import SearchResultsPage from './pages/SearchResultsPage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/notes/new" element={<EditorPage />} />
      <Route path="/notes/view/:id" element={<NoteDetailsPage />} />
      <Route path="/notes/edit/:id" element={<EditorPage />} />
      <Route path="/notes/encrypted/:id" element={<EncryptedNotePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;