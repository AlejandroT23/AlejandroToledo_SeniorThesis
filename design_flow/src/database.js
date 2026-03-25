import { supabase } from './supabaseClient'

// Disable RLS in the table editor for all other tables //

export async function getUser(userID) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', userID)
        .single();
    if (error) {
        return {data: null, error};
    } else {
        return {data, error: null};
    }
}

export async function userExists(userID) {
    const {data, error} = await supabase
        .from('users')
        .select('id')
        .eq('id', userID)
        .single();
    if (error) {
        return false;
    } else {
        return data;
    }
}

export async function createUser({ id, first_name, last_name, avatar, google_drive_token}) {
    const {data, error} = await supabase
        .from('users')
        .insert({id, first_name, last_name, avatar, google_drive_token})
        .select()
        .single();
    return {data, error};
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}