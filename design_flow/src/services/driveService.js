// src/services/driveService.js
// Google Drive API service - all Drive operations go through here
// Uses the user's provider_token from Supabase Google OAuth

const DRIVE_API = 'https://www.googleapis.com/drive/v3';

// ============================================================
// Helper
// ============================================================

async function driveRequest(endpoint, token, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${DRIVE_API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error('Drive API error:', res.status, errorBody);
    throw new Error(
      errorBody?.error?.message || `Drive API request failed (${res.status})`
    );
  }

  // 204 No Content (e.g. after delete)
  if (res.status === 204) return null;
  return res.json();
}

// ============================================================
// Folders
// ============================================================

/**
 * Create a folder in Google Drive.
 * @param {string} token   - Google OAuth access token
 * @param {string} name    - Folder name
 * @param {string|null} parentId - Parent folder ID (null = root of My Drive)
 * @returns {{ id: string, name: string }} created folder metadata
 */
export async function createFolder(token, name, parentId = null) {
  const body = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) {
    body.parents = [parentId];
  }
  return driveRequest('/files', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Create the full folder structure for a new team:
 *   TeamName/
 *     _FinalProd/
 *     _Native/
 *
 * @returns {{ teamFolderId, finalProdFolderId, nativeFolderId }}
 */
export async function createTeamFolders(token, teamName) {
  // Create the main team folder
  const teamFolder = await createFolder(token, teamName);

  // Create _FinalProd and _Native subfolders in parallel
  const [finalProd, native] = await Promise.all([
    createFolder(token, '_FinalProd', teamFolder.id),
    createFolder(token, '_Native', teamFolder.id),
  ]);

  return {
    teamFolderId: teamFolder.id,
    finalProdFolderId: finalProd.id,
    nativeFolderId: native.id,
  };
}

/**
 * Create a subfolder for an assignment inside the team folder.
 *
 * @returns {{ id: string, name: string }}
 */
export async function createAssignmentFolder(token, assignmentName, teamFolderId) {
  return createFolder(token, assignmentName, teamFolderId);
}

/**
 * Create a versioned subfolder (v1, v2, …) inside an assignment folder.
 *
 * @param {string} token
 * @param {string} assignmentFolderId
 * @param {number} versionNumber
 * @returns {{ id: string, name: string }}
 */
export async function createVersionFolder(token, assignmentFolderId, versionNumber) {
  return createFolder(token, `v${versionNumber}`, assignmentFolderId);
}

// ============================================================
// Sharing
// ============================================================

/**
 * Share a Drive folder/file with a user by email.
 * Role: 'writer' (can edit), 'reader' (view only), 'commenter'
 */
export async function shareWithUser(token, fileId, email, role = 'writer') {
  return driveRequest(`/files/${fileId}/permissions`, token, {
    method: 'POST',
    body: JSON.stringify({
      type: 'user',
      role,
      emailAddress: email,
    }),
  });
}

/**
 * Share a folder with multiple users at once.
 */
export async function shareWithMultipleUsers(token, fileId, emails, role = 'writer') {
  const results = await Promise.allSettled(
    emails.map((email) => shareWithUser(token, fileId, email, role))
  );

  const failures = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason?.message);

  if (failures.length > 0) {
    console.warn('Some share operations failed:', failures);
  }

  return results;
}

// ============================================================
// Listing
// ============================================================

/**
 * List files/folders inside a given folder.
 */
export async function listFolderContents(token, folderId) {
  const query = `'${folderId}' in parents and trashed = false`;
  return driveRequest(
    `/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,createdTime,modifiedTime,size)&orderBy=createdTime desc`,
    token,
    { method: 'GET' }
  );
}

/**
 * List only subfolders inside a given folder (for browsing versions).
 */
export async function listSubfolders(token, folderId) {
  const query = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  return driveRequest(
    `/files?q=${encodeURIComponent(query)}&fields=files(id,name,createdTime)&orderBy=name`,
    token,
    { method: 'GET' }
  );
}

// ============================================================
// File Upload
// ============================================================

/**
 * Upload a file to a specific Drive folder.
 * Uses the multipart upload endpoint for files up to ~5 MB.
 * For larger files you'd switch to resumable upload.
 *
 * @param {string} token
 * @param {File}   file      - browser File object
 * @param {string} folderId  - destination folder ID
 * @returns {{ id, name, mimeType }}
 */
export async function uploadFile(token, file, folderId) {
  const metadata = {
    name: file.name,
    parents: [folderId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Upload failed (${res.status})`);
  }

  return res.json();
}

/**
 * Upload multiple files to a folder. Returns array of results.
 */
export async function uploadFiles(token, files, folderId) {
  const results = await Promise.allSettled(
    files.map((file) => uploadFile(token, file, folderId))
  );
  return results;
}

// ============================================================
// Download
// ============================================================

/**
 * Get a download URL for a file. Works for non-Google-Docs files.
 */
export function getDownloadUrl(fileId) {
  return `${DRIVE_API}/files/${fileId}?alt=media`;
}

/**
 * Download a file as a blob.
 */
export async function downloadFile(token, fileId) {
  const res = await fetch(getDownloadUrl(fileId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  return res.blob();
}

// ============================================================
// Token Refresh
// ============================================================

/**
 * Refresh the Google access token using Supabase's built-in refresh.
 * Call this when a Drive request returns 401.
 *
 * @param {object} supabase - Supabase client instance
 * @returns {string|null}   - new provider_token or null
 */
export async function refreshDriveToken(supabase) {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Failed to refresh session:', error);
    return null;
  }
  return data?.session?.provider_token || null;
}