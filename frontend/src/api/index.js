import { getAuth } from "firebase/auth";

const API_BASE = "http://localhost:5001/api";

async function getAuthHeaders() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No authenticated user found");
  const idToken = await currentUser.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
}

export async function saveUserToBackend(userData) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save user: ${errorText}`);
  }

  return await response.json();
}

// Prompts API
export async function getPrompts() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/prompts`, { headers });
  if (!response.ok) throw new Error("Failed to fetch prompts");
  return await response.json();
}

export async function createPrompt(title, searchQuery) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/prompts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, searchQuery }),
  });
  if (!response.ok) throw new Error("Failed to create prompt");
  return await response.json();
}

export async function updatePrompt(id, updates) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/prompts/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update prompt");
  return await response.json();
}

export async function deletePrompt(id) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/prompts/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Failed to delete prompt");
  return await response.json();
}

export async function usePrompt(id) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/prompts/${id}/use`, {
    method: "PATCH",
    headers,
  });
  if (!response.ok) throw new Error("Failed to update prompt usage");
  return await response.json();
}

// GIF Search API
export async function searchGifs(query, limit = 20) {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ q: query, limit: limit.toString() });
  const response = await fetch(`${API_BASE}/gifs/search?${params}`, { headers });
  if (!response.ok) throw new Error("Failed to search GIFs");
  return await response.json();
}

export async function saveGifToUser(gifUrl) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/gifs`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url: gifUrl }),
  });
  if (!response.ok) throw new Error("Failed to save GIF");
  return await response.json();
}

export async function getSavedGifs() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/me/gifs`, { headers });
  if (!response.ok) throw new Error("Failed to fetch saved GIFs");
  return await response.json();
}

