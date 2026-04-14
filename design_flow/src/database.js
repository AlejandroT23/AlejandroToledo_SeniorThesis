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

// -- VERSIONS -- //

export async function createVersion({assignment_id, uploaded_by, title, description, version_number, drive_folder_id}) {
    const {data, error} = await supabase
        .from('versions')
        .insert({assignment_id, uploaded_by, title, description, version_number, drive_folder_id})
        .select()
        .single();
    return {data, error};
}

export async function getVersionsByAssignment(assignment_id) {
    const {data, error} = await supabase
        .from('versions')
        .select('*')
        .eq('assignment_id', assignment_id)
        .order('version_number', {ascending: true});
    return {data, error};
}

// THINK MORE ABOUT THIS ONE
// export async function getNextVersionNumber(assignment_id) {
//     const {data, error} = await supabase
//         .from()
//     return {data, error};
// }

// -- WORKFLOW MESSAGE -- //

export async function createWorkflowMessage({assignment_id, user_id, type, content, version_id}) {
    const {data, error} = await supabase
        .from('workflow_messages')
        .insert({assignment_id, user_id, type, content, version_id})
        .select()
        .single();
    return {data, error};
}

export async function getWorkflowMessages(assignment_id) {
    const {data, error} = await supabase
        .from('workflow_messages')
        .select('*')
        .eq('assignment_id', assignment_id)
    return {data, error};
}

// MAYBE CREATE LOG TABLE THAT KEEPS TRACK OF ORDER SO IT CAN BE DISPLAYED?

// -- ASSIGNMENTS -- //

export async function getAssignments(team_id) {
    
    console.log("team_id type: ", typeof team_id);
    console.log("team_id value: ", team_id);
    
    const {data, error} = await supabase
        .from('assignments')
        .select('*')
        .eq('team_id', team_id)
    return {data, error};
}

// -- TASKS -- //

export async function getTasks(assignment_id) {
    const {data, error} = await supabase
        .from('tasks')
        .select('*')
        .eq('assignment_host', assignment_id)
    return {data, error};
}

export async function createTasks(name, deadline, assignment_id) {
    const {data, error} = await supabase
        .from('tasks')
        .insert({name, assignment_id})
        .select()
        .single();
    return {data, error}
}

export async function updateTask(task_id, updated_val) {
    const {data, error} = await supabase
        .from('task')
        .update({is_completed: !updated_val})
        .eq('id', task_id)
        .select()
        .single();
    return {data, error}
}

export async function deleteTask(task_id) {
    const {error} = await supabase
        .from('task')
        .delete()
        .eq('')

    if (error) {
        console.log("Error: ", error)
        return {error}
    }

    return {error: null}
}