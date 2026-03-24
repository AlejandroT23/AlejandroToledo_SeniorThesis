import { supabase } from './supabaseClient'

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

export async function userExist(userID) {
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
        .from('user')
        .insert({id, first_name, last_name, avatar, google_driver_token})
        .select()
        .single();
    return {data, error};
}