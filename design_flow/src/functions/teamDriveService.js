// src/services/teamDriveService.js
// Combines Supabase team operations with Google Drive folder creation.
// Use these functions instead of raw Supabase inserts when creating
// teams or assignments, so Drive folders are always created in sync.

import {supabase} from '../supabaseClient';
import {
  createTeamFolders,
  createAssignmentFolder,
  shareWithUser,
  shareWithMultipleUsers,
} from '../services/driveService';

// ============================================================
// Team Creation + Drive Folder
// ============================================================

/**
 * Create a new team AND its Google Drive folder structure.
 *
 * Flow:
 * 1. Insert team row into Supabase
 * 2. Create Drive folders (TeamName/, _FinalProd/, _Native/)
 * 3. Update team row with the Drive folder IDs
 * 4. Add the creator as a team member with 'owner' role
 *
 * @param {object} teamData  - { team_name, deadline, desc, icon, color }
 * @param {string} userId    - Supabase auth user ID (uuid)
 * @param {string} driveToken - Google OAuth access token
 * @returns {{ team, driveFolders }}
 */
export async function createTeamWithDrive(teamData, userId, driveToken) {
  // 1. Insert team into Supabase
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      team_name: teamData.team_name,
      deadline: teamData.deadline || null,
      desc: teamData.desc || null,
      admin: userId,
      icon: teamData.icon || null,
      color: teamData.color || null,
      is_archived: false,
    })
    .select()
    .single();

  if (teamError) throw new Error(`Failed to create team: ${teamError.message}`);

  // 2. Create Drive folders
  let driveFolders = null;
  if (driveToken) {
    try {
      driveFolders = await createTeamFolders(driveToken, teamData.team_name);

      // 3. Update team with Drive folder IDs
      const { error: updateError } = await supabase
        .from('teams')
        .update({
          drive_folder_id: driveFolders.teamFolderId,
          drive_finalprod_folder_id: driveFolders.finalProdFolderId,
          drive_native_folder_id: driveFolders.nativeFolderId,
        })
        .eq('id', team.id);

      if (updateError) {
        console.warn('Team created but failed to save Drive folder IDs:', updateError);
      }
    } catch (driveErr) {
      // Team was created in DB — Drive failed. Log but don't throw.
      // User can retry linking Drive later.
      console.error('Drive folder creation failed:', driveErr);
    }
  }

  // 4. Add creator as owner in team_members
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    console.warn('Team created but failed to add owner to team_members:', memberError);
  }

  return { team, driveFolders };
}

// ============================================================
// Assignment Creation + Drive Folder
// ============================================================

/**
 * Create a new assignment AND its Drive subfolder inside the team folder.
 *
 * @param {object} assignmentData - { name, deadline, desc, assigned_to, team_id }
 * @param {string} teamDriveFolderId - the team's Drive folder ID
 * @param {string} driveToken
 * @returns {{ assignment, driveFolder }}
 */
export async function createAssignmentWithDrive(assignmentData, teamDriveFolderId, driveToken) {
  // 1. Insert assignment into Supabase
  const { data: assignment, error: assignError } = await supabase
    .from('assignments')
    .insert({
      name: assignmentData.name,
      deadline: assignmentData.deadline || null,
      desc: assignmentData.desc || null,
      team_id: assignmentData.team_id,
      assigned_to: assignmentData.assigned_to || null,
      folder_location: assignmentData.folder_location || null,
    })
    .select()
    .single();

  if (assignError) throw new Error(`Failed to create assignment: ${assignError.message}`);

  // 2. Create Drive subfolder for this assignment
  let driveFolder = null;
  if (driveToken && teamDriveFolderId) {
    try {
      driveFolder = await createAssignmentFolder(
        driveToken,
        assignmentData.name,
        teamDriveFolderId
      );

      // 3. Save the folder ID back to the assignment
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ drive_folder_id: driveFolder.id })
        .eq('id', assignment.id);

      if (updateError) {
        console.warn('Assignment created but failed to save Drive folder ID:', updateError);
      }
    } catch (driveErr) {
      console.error('Drive folder creation for assignment failed:', driveErr);
    }
  }

  return { assignment, driveFolder };
}

// ============================================================
// Member Sharing (Day 3 prep)
// ============================================================

/**
 * When a new member joins a team, share the team's Drive folder with them.
 *
 * @param {number} teamId
 * @param {string} memberEmail - the new member's email
 * @param {string} driveToken
 */
export async function addMemberAndShareDrive(teamId, userId, memberEmail, driveToken) {
  // 1. Add member to team_members table
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role: 'member',
    });

  if (memberError) throw new Error(`Failed to add member: ${memberError.message}`);

  // 2. Get the team's Drive folder ID
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('drive_folder_id')
    .eq('id', teamId)
    .single();

  if (teamError || !team?.drive_folder_id) {
    console.warn('Could not share Drive folder — team has no Drive folder ID');
    return;
  }

  // 3. Share the Drive folder with the new member
  if (driveToken && memberEmail) {
    try {
      await shareWithUser(driveToken, team.drive_folder_id, memberEmail, 'writer');
    } catch (shareErr) {
      console.error('Failed to share Drive folder with new member:', shareErr);
    }
  }
}

/**
 * Share a team's Drive folder with ALL current members.
 * Useful after initial team creation when adding multiple members.
 */
export async function shareTeamFolderWithAllMembers(teamId, driveToken) {
  // Get team's folder ID
  const { data: team } = await supabase
    .from('teams')
    .select('drive_folder_id')
    .eq('id', teamId)
    .single();

  if (!team?.drive_folder_id) return;

  // Get all member emails
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId);

  if (!members?.length) return;

  // Look up each member's email from auth (via users table or session)
  // NOTE: You may need to store email in your users table for this to work.
  // For now, this is a placeholder — adjust to match your users table.
  const userIds = members.map((m) => m.user_id);
  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .in('id', userIds);

  if (!users?.length) return;

  const emails = users.map((u) => u.email).filter(Boolean);
  await shareWithMultipleUsers(driveToken, team.drive_folder_id, emails, 'writer');
}