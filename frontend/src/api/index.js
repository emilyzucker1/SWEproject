import { getAuth } from "firebase/auth";

export async function saveUserToBackend(userData) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error("No authenticated user found");

  // Get Firebase ID token for secure backend verification
  const idToken = await currentUser.getIdToken();

  const response = await fetch("http://localhost:5001/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save user: ${errorText}`);
  }

  return await response.json();
}
