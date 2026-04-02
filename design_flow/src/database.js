import { supabase } from './supabaseClient'

// Disable RLS in the table editor for all other tables //

// ===
// USER TABLES
// ===
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

// ===
// TEAM TABLE
// ===

export async function getTeam(teamID) {
    const {data, error} = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamID)
        .single();
    return {data, error};
}
// When rendering, you need to render as item.teams.name rather than item.name

export async function getUserTeams(userID) {
    const {data, error} = await supabase
        .from('team_members')
        .select('teams(*)')
        .eq('user_id', userID)
    return {data, error};
}

// ===
// DEADLINE TABLE
// ===

export async function getDeadlines(userID) {
    const {data, error} = await supabase
        .from('assignments')
        .select('*')
        .eq('assigned_to', userID)
    return {data, error};
}

export async function getMostRecentDeadlines(userID) {
    const {data, error} = await supabase
        .from('assignments')
        .select('*')
        .eq('assigned_to', userID)
        .order('deadline', {ascending: true})
        .limit(3);
    return {data, error};
}

// -- SESSION -- //

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// -- MEMBERS -- //

export async function getMembers(TeamId) {
    const {data, error} = await supabase
        .from('team_members')
        .select('*, users(*)')
        .eq('team_id', TeamId)
    return {data, error}
}


