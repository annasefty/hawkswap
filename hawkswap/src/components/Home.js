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
        <div
            className="home-screen"
            style={{
                backgroundImage: `url("/images/lehigh-bg.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "2rem"
            }}
        >
            <Helmet>
                <title>Hawk Swap Marketplace</title>
                <link rel="icon" href="/favicon.ico" />
            </Helmet>
            <div className="home-box">
                <h1>HAWKSWAP MARKETPLACE</h1>
            </div>
            <button className="google-signin-button" onClick={handleGoogleSignIn}>
                <span className="google-text">SIGN IN</span>
                <img
                    src="/images/google-logo.png"
                    alt="Google logo"
                    className="google-logo"
                />
            </button>
        </div>

    );
};

export default Home;
