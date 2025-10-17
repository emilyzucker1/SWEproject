import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { set } from "firebase/database";
import firebase from "firebase/compat/app";
import { auth } from "../../index";
import { useNavigate, NavigateFunction } from "react-router-dom";

export const forgotPassword = async (
    email: string, 
    navigate: NavigateFunction
) => {
    try {
        if (email === "") {
            alert("Please enter an email address.");
            return;
        }

        await sendPasswordResetEmail(auth, email);
        console.log("Auth object:", auth);
        console.log("Email being sent to:", email);
        navigate('/login');
    } catch (error: any) {
        console.error("Full error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        alert(`Error: ${error.code}`);
}
};