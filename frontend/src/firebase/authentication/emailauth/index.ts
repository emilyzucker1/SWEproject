import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { set } from "firebase/database";
import firebase from "firebase/compat/app";
import { auth } from "../../index.js";
import { useNavigate, NavigateFunction } from "react-router-dom";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const auth = getAuth();

  try {
    setLoading(true);

    // Create the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send a verification email
    await sendEmailVerification(user);

    alert("✅ A verification email has been sent to your email address.");

    // Return the created user info
    return userCredential;
  } catch (error: any) {
    console.error("Error during registration:", error);
    throw new Error(error.message || "Failed to register user");
  } finally {
    setLoading(false);
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
