import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { set } from "firebase/database";
import firebase from "firebase/compat/app";
import { auth } from "../../index.js";
import { useNavigate, NavigateFunction } from "react-router-dom";

export const registerUser = async (
    name: string,
    email: string,
    password: string, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
) => {
    try {
        setLoading(true);

        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            email, 
            password, 
        );
        const result = userCredential.user
        
        await sendEmailVerification(result);
        alert('A verification email has been sent to your email address.');
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
        navigate('/login');
    }
        //create a new user 

        //send an email varification to the user
    
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
