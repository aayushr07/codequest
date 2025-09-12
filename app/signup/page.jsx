"use client";

import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = "/mcq-round";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
            <h1>Sign Up</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem" }}
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem" }}
                />
            </div>

            <button onClick={handleSignup} style={{ width: "100%", padding: "0.5rem" }}>
                Create Account
            </button>
        </div>
    );
}
