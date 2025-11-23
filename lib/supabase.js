import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your .env.local file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper functions for creator operations
export async function getCreatorProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching creator profile:', error);
    return null;
  }

  return data;
}

export async function updateCreatorProfile(userId, updates) {
  // Don't allow updating email through this function (it's managed by auth)
  const { email, ...safeUpdates } = updates;
  
  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating creator profile:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function getCreatorGames(creatorId) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creator games:', error);
    return [];
  }

  return data;
}

export async function uploadGameFile(file, creatorId, gameId) {
  const fileName = `${creatorId}/${gameId}/main.pck`;
  
  const { data, error } = await supabase.storage
    .from('games')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading game file:', error);
    return { success: false, error };
  }

  const { data: urlData } = supabase.storage
    .from('games')
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}

export async function uploadThumbnail(file, creatorId, gameId) {
  const fileName = `${creatorId}/${gameId}/thumbnail.png`;
  
  const { data, error } = await supabase.storage
    .from('games')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading thumbnail:', error);
    return { success: false, error };
  }

  const { data: urlData } = supabase.storage
    .from('games')
    .getPublicUrl(fileName);

  return { success: true, url: urlData.publicUrl };
}

export async function createGame(gameData) {
  const { data, error } = await supabase
    .from('games')
    .insert([gameData])
    .select()
    .single();

  if (error) {
    console.error('Error creating game:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// Helper to get file URLs from storage
export function getGameFileUrl(creatorId, gameId, filename = 'main.pck') {
  const { data } = supabase.storage
    .from('games')
    .getPublicUrl(`${creatorId}/${gameId}/${filename}`);
  return data.publicUrl;
}

export function getThumbnailUrl(creatorId, gameId) {
  const { data } = supabase.storage
    .from('games')
    .getPublicUrl(`${creatorId}/${gameId}/thumbnail.png`);
  return data.publicUrl;
}

export async function updateGame(gameId, updates) {
  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', gameId)
    .select()
    .single();

  if (error) {
    console.error('Error updating game:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

