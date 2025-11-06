import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, updateProfile } from "firebase/auth";
import { set } from "firebase/database";
import firebase from "firebase/compat/app";
import { auth } from "../../index.js";
import { useNavigate, NavigateFunction } from "react-router-dom";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
  navigate: NavigateFunction,
) {
  const auth = getAuth();

  try {
    setLoading(true);

    // Create the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's displayName with the provided name
    if (user) {
      await updateProfile(user, { displayName: name });
    }

    // Send a verification email
    alert("✅ Your account has been registered.");

    // Return the created user info
    return userCredential;
  } catch (error) {
    console.error("Error during registration:", error);
    //throw new Error(error.message || "Failed to register user");
  } finally {
    setLoading(false);
    navigate('/login');
  }
}

export const loginUserwithEmailandPassword = async (
    email: string, 
    password: string,
    navigate: NavigateFunction,
) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, 
            email, 
            password
        );
        const result = userCredential.user;
        navigate('/main')
    } catch (error) {
        alert("Your username or password is incorrect.");
        console.error("nothing happened");
    }
};

// Fetch protected user data from backend using Firebase ID token for auth.
// NOTE: The fetchUserData helper that used ID tokens to call a protected backend route
// was removed per request. If you want to reintroduce it later, we can add it back.
