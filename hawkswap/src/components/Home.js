import React from "react";
import "../Home.css";
import { Helmet } from "react-helmet";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user.email.endsWith("@lehigh.edu")) {
                navigate("/marketplace");
            } else {
                await signOut(auth);
                navigate("/error");
            }
        } catch (error) {
            console.error("Login error:", error);
            navigate("/error");
        }
    };

    return (
        <div className="home-screen">
            <Helmet>
                <title>Hawk Swap Marketplace</title>
                <link rel="icon" href="/favicon.ico" />
            </Helmet>

            <img src="/images/hawk-logo.png" alt="Hawk Swap Logo" className="hawk-logo" />

            <button className="google-signin-button" onClick={handleGoogleSignIn}>
                <img
                    src="/images/google-logo.png"
                    alt="Google logo"
                    className="google-logo"
                />
                <span>Sign in with Google</span>
            </button>
        </div>
    );
};

export default Home;
