"use client";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { 
  BookOpen, 
  Clock, 
  User, 
  Users, 
  Trophy, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  LogIn, 
  LogOut, 
  Star,
  Shield,
  Zap,
  Award,
  ArrowDown
} from "lucide-react";

export default function MCQHomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTeam, setUserTeam] = useState(null);
  const [loadingTeamData, setLoadingTeamData] = useState(false);

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserTeam(currentUser.email);
      } else {
        setUser(null);
        setUserTeam(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's team information
  const fetchUserTeam = async (userEmail) => {
    try {
      setLoadingTeamData(true);
      const response = await fetch('/api/teams/getUserTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.team) {
          setUserTeam(data.team);
        }
      }
      setLoadingTeamData(false);
    } catch (error) {
      console.error("Error fetching user team:", error);
      setLoadingTeamData(false);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserTeam(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleStartTest = () => {
    if (user) {
      window.location.href = "/mcq-round";
    } else {
      window.location.href = "/login";
    }
  };

  const scrollToRules = () => {
    document.getElementById('rules-section').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const rules = [
    {
      icon: Clock,
      title: "Time Limit",
      description: "You have 45 minutes to complete all questions. The test will auto-submit when time runs out.",
      color: "text-blue-400"
    },
    {
      icon: Target,
      title: "Question Navigation",
      description: "You can navigate between questions freely. Use the question palette to jump to any question.",
      color: "text-green-400"
    },
    {
      icon: CheckCircle,
      title: "Answer Selection",
      description: "Click on any option to select your answer. You can change your answer anytime before submission.",
      color: "text-[#A5C9CA]"
    },
    {
      icon: AlertTriangle,
      title: "Flagging Questions",
      description: "Flag questions you want to review later. Flagged questions are highlighted for easy identification.",
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "Team Participation",
      description: "If you're part of a team, your individual score contributes to the combined team score.",
      color: "text-purple-400"
    },
    {
      icon: Shield,
      title: "Single Attempt",
      description: "You can only attempt the test once. Make sure you're ready before starting the assessment.",
      color: "text-red-400"
    },
    {
      icon: Trophy,
      title: "Scoring System",
      description: "Each correct answer gives you 1 point. There's no negative marking for incorrect answers.",
      color: "text-amber-400"
    },
    {
      icon: Zap,
      title: "Technical Requirements",
      description: "Ensure stable internet connection. The test auto-saves your progress as you answer questions.",
      color: "text-cyan-400"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2C3333] flex items-center justify-center">
        <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#A5C9CA]/30 border-t-[#A5C9CA] rounded-full animate-spin"></div>
            <span className="text-[#E7F6F2] text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C3333] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#A5C9CA] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#395B64] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A5C9CA] rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-[#395B64]/10 backdrop-blur-sm border-b border-[#395B64]/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#A5C9CA] p-3 rounded-xl hover:bg-[#E7F6F2] transition-colors duration-300">
                <BookOpen className="w-8 h-8 text-[#2C3333]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E7F6F2]">CodeQuest MCQ</h1>
                <p className="text-[#A5C9CA]/80 text-sm">CSI-AIML Committee Presents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 bg-[#395B64]/20 border border-[#395B64]/30 px-4 py-2 rounded-xl hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-300">
                    {userTeam ? <Users className="w-5 h-5 text-[#A5C9CA]" /> : <User className="w-5 h-5 text-[#A5C9CA]" />}
                    <span className="text-[#E7F6F2] text-sm truncate max-w-32">{user.email}</span>
                    {loadingTeamData && <div className="w-4 h-4 border-2 border-[#A5C9CA]/30 border-t-[#A5C9CA] rounded-full animate-spin"></div>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 text-red-400 hover:text-red-300 hover:border-red-400/50"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-br from-[#A5C9CA] to-[#395B64] rounded-full flex items-center justify-center mx-auto mb-8 hover:scale-110 transition-transform duration-300 animate-bounce">
            <Trophy className="w-16 h-16 text-[#2C3333]" />
          </div>
          <h1 className="text-6xl font-bold text-[#E7F6F2] mb-6">
            Welcome to <span className="text-[#A5C9CA]">CodeQuest</span>
          </h1>
          <p className="text-2xl text-[#E7F6F2]/80 mb-8">
            Where Algorithms Meet Ambition
          </p>
          <p className="text-lg text-[#A5C9CA]/80 max-w-3xl mx-auto mb-12">
            Test your programming knowledge with our comprehensive MCQ assessment. 
            {userTeam && ` Compete as part of team "${userTeam.name}" and combine your scores for maximum impact!`}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center mb-16">
            {user ? (
              <>
                <button
                  onClick={handleStartTest}
                  className="flex items-center space-x-3 bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A5C9CA]/30"
                >
                  <Play className="w-6 h-6" />
                  <span>Start MCQ Test</span>
                </button>
                <button
                  onClick={scrollToRules}
                  className="flex items-center space-x-3 bg-[#395B64]/40 hover:bg-[#395B64]/60 text-[#E7F6F2] px-8 py-4 rounded-xl font-bold text-lg border border-[#395B64]/30 hover:border-[#A5C9CA]/50 transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                  <span>Learn the Rules</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-3 bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A5C9CA]/30"
                >
                  <LogIn className="w-6 h-6" />
                  <span>Login to Start</span>
                </button>
                <button
                  onClick={scrollToRules}
                  className="flex items-center space-x-3 bg-[#395B64]/40 hover:bg-[#395B64]/60 text-[#E7F6F2] px-8 py-4 rounded-xl font-bold text-lg border border-[#395B64]/30 hover:border-[#A5C9CA]/50 transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                  <span>Learn the Rules</span>
                </button>
              </>
            )}
          </div>

          {/* Team Information */}
          {user && userTeam && (
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-6 mb-12 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#2C3333]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#E7F6F2]">Team: {userTeam.name}</h3>
                  <p className="text-[#A5C9CA]/80 text-sm">
                    {userTeam.members ? `${userTeam.members.length} members` : 'Loading team info...'}
                  </p>
                </div>
              </div>
              <p className="text-[#E7F6F2]/80 text-center">
                Your score will be combined with your teammates for the final team ranking!
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-6 text-center hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10">
              <Clock className="w-12 h-12 text-[#A5C9CA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E7F6F2] mb-2">45 Minutes</h3>
              <p className="text-[#E7F6F2]/70">Total Time Limit</p>
            </div>
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-6 text-center hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10">
              <Target className="w-12 h-12 text-[#A5C9CA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E7F6F2] mb-2">Multiple Choice</h3>
              <p className="text-[#E7F6F2]/70">Question Format</p>
            </div>
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-6 text-center hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10">
              <Award className="w-12 h-12 text-[#A5C9CA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E7F6F2] mb-2">No Negative</h3>
              <p className="text-[#E7F6F2]/70">Marking System</p>
            </div>
          </div>
        </div>

        {/* Enhanced Rules Section - Always Visible */}
        <div id="rules-section" className="mb-16">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#A5C9CA] to-[#395B64] rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-[#2C3333]" />
            </div>
            <h2 className="text-4xl font-bold text-[#E7F6F2] mb-4">Test Rules & Guidelines</h2>
            <p className="text-[#A5C9CA]/80 text-lg max-w-2xl mx-auto">
              Master these guidelines to maximize your performance and ensure a smooth testing experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {rules.map((rule, index) => {
              const IconComponent = rule.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-6 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-[#395B64]/40 ${rule.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#E7F6F2] mb-2">{rule.title}</h3>
                      <p className="text-[#E7F6F2]/80 leading-relaxed">{rule.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">⚡ Critical Reminder</h3>
                <div className="space-y-2 text-[#E7F6F2]/90">
                  <p className="leading-relaxed">
                    🎯 This is a <strong className="text-yellow-300">one-time assessment</strong> - once you start, there's no going back
                  </p>
                  <p className="leading-relaxed">
                    🌐 Ensure you have a <strong className="text-yellow-300">stable internet connection</strong> throughout the test
                  </p>
                  <p className="leading-relaxed">
                    🔄 Your progress is <strong className="text-yellow-300">automatically saved</strong> as you answer each question
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#A5C9CA]/10 to-[#395B64]/10 rounded-2xl p-8 border border-[#A5C9CA]/20">
          <Star className="w-16 h-16 text-[#A5C9CA] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#E7F6F2] mb-4">Ready to Begin Your Journey?</h3>
          <p className="text-[#E7F6F2]/80 mb-6 max-w-2xl mx-auto">
            You've got all the information you need. It's time to showcase your programming prowess!
          </p>
          <button
            onClick={handleStartTest}
            className="bg-gradient-to-r from-[#A5C9CA] to-[#395B64] hover:from-[#E7F6F2] hover:to-[#A5C9CA] text-[#2C3333] px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A5C9CA]/30"
          >
            {user ? 'Start Your Assessment' : 'Login to Begin'}
          </button>
        </div>
      </div>
    </div>
  );
}
