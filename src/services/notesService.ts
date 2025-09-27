import { supabase } from '../lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_encrypted: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  is_pinned?: boolean;
  is_encrypted?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  is_pinned?: boolean;
  is_encrypted?: boolean;
}

// Get all notes for the current user
export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllNotes:', error);
    throw error;
  }
};

// Get a single note by ID
export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching note:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    return null;
  }
};

// Create a new note
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: noteData.title,
          content: noteData.content,
          is_pinned: noteData.is_pinned || false,
          is_encrypted: noteData.is_encrypted || false,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (id: string, noteData: UpdateNoteData): Promise<Note | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        ...noteData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateNote:', error);
    return null;
  }
};

// Delete a note
export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting note:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteNote:', error);
    return false;
  }
};

// Toggle pin status of a note
export const togglePinNote = async (id: string): Promise<Note | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the current note to toggle the pin status
    const currentNote = await getNoteById(id);
    if (!currentNote) {
      return null;
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        is_pinned: !currentNote.is_pinned,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling pin:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in togglePinNote:', error);
    return null;
  }
};

// Toggle lock status of a note (using is_encrypted field)
export const toggleLockNote = async (id: string): Promise<Note | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the current note to toggle the lock status
    const currentNote = await getNoteById(id);
    if (!currentNote) {
      return null;
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        is_encrypted: !currentNote.is_encrypted,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling lock:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in toggleLockNote:', error);
    return null;
  }
};

// Verify user password for locked notes
export const verifyPasswordForLockedNote = async (password: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Sign in with the provided password to verify it's correct
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};
