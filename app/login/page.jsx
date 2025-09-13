"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Your original email login logic - preserved exactly
    const handleEmailLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/mcq-round";
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    // Your original Google login logic - preserved exactly
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError("");
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/mcq-round";
        } catch (err) {
            setError(err.message);
        }
        setGoogleLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email && password && !isLoading) {
            handleEmailLogin();
        }
    };

    return (
        <div className="min-h-screen bg-[#2C3333] relative overflow-hidden flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-[#A5C9CA] rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#395B64] rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A5C9CA] rounded-full blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#A5C9CA]/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#A5C9CA] to-[#395B64] rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                            <LogIn className="w-8 h-8 text-[#2C3333]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#E7F6F2] mb-2">Welcome Back</h1>
                        <p className="text-[#A5C9CA]/80">Please sign in to continue to MCQ Round</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-[#E7F6F2] text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5C9CA]/60" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full bg-[#2C3333]/50 border border-[#395B64]/50 rounded-lg pl-12 pr-4 py-3 text-[#E7F6F2] placeholder-[#A5C9CA]/60 focus:border-[#A5C9CA] focus:bg-[#2C3333]/70 focus:outline-none transition-all duration-300 hover:border-[#A5C9CA]/70"
                                disabled={isLoading || googleLoading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block text-[#E7F6F2] text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5C9CA]/60" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full bg-[#2C3333]/50 border border-[#395B64]/50 rounded-lg pl-12 pr-12 py-3 text-[#E7F6F2] placeholder-[#A5C9CA]/60 focus:border-[#A5C9CA] focus:bg-[#2C3333]/70 focus:outline-none transition-all duration-300 hover:border-[#A5C9CA]/70"
                                disabled={isLoading || googleLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A5C9CA]/60 hover:text-[#A5C9CA] transition-colors duration-200"
                                disabled={isLoading || googleLoading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Email Login Button */}
                    <button
                        onClick={handleEmailLogin}
                        disabled={!email || !password || isLoading || googleLoading}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 mb-4 ${
                            !email || !password || isLoading || googleLoading
                                ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed border border-[#395B64]/30'
                                : 'bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] shadow-lg shadow-[#A5C9CA]/30 hover:shadow-[#A5C9CA]/50 border border-[#A5C9CA]'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-[#2C3333]/30 border-t-[#2C3333] rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                <span>Login with Email</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#395B64]/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#395B64]/20 text-[#A5C9CA]/80">or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading || googleLoading}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 ${
                            isLoading || googleLoading
                                ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed border border-[#395B64]/30'
                                : 'bg-white/10 hover:bg-white/20 text-[#E7F6F2] border border-[#395B64]/50 hover:border-[#A5C9CA]/70 shadow-lg shadow-black/10 hover:shadow-black/20'
                        }`}
                    >
                        {googleLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-[#E7F6F2]/30 border-t-[#E7F6F2] rounded-full animate-spin"></div>
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Login with Google</span>
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-[#A5C9CA]/50 text-xs">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
