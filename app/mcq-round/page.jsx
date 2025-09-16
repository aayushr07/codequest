"use client";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { mcqQuestions } from "@/data/mcqQuestions";
import {
  Trophy,
  Clock,
  User,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flag,
  Eye,
  AlertTriangle,
  BookOpen,
  Target,
  Users,
  Star,
  Check,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// Utility functions for shuffling
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleQuestionOptions = (question) => {
  const optionsWithIndex = question.options.map((option, index) => ({
    option,
    originalIndex: index
  }));
  
  const shuffledOptions = shuffleArray(optionsWithIndex);
  
  return {
    ...question,
    options: shuffledOptions.map(item => item.option),
    correct_option: shuffledOptions.findIndex(item => item.originalIndex === question.correct_option)
  };
};

const TOTAL_QUESTIONS = 45; // Limit to 45 questions

export default function MCQRoundPage() {
  const [answers, setAnswers] = useState(new Array(TOTAL_QUESTIONS).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [score, setScore] = useState(null);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);

  // Team-related states
  const [userTeam, setUserTeam] = useState(null);
  const [teamSubmissions, setTeamSubmissions] = useState([]);
  const [combinedTeamScore, setCombinedTeamScore] = useState(0);
  const [loadingTeamData, setLoadingTeamData] = useState(true);

  // New states for test already taken check
  const [testAlreadyTaken, setTestAlreadyTaken] = useState(false);
  const [userPreviousScore, setUserPreviousScore] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Shuffled questions state
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Initialize shuffled questions on component mount
  useEffect(() => {
    if (mcqQuestions && mcqQuestions.length > 0) {
      // First shuffle all questions
      const allShuffledQuestions = shuffleArray([...mcqQuestions]);
      
      // Take only the first TOTAL_QUESTIONS (45)
      const selectedQuestions = allShuffledQuestions.slice(0, TOTAL_QUESTIONS);
      
      // Then shuffle options for each selected question
      const questionsWithShuffledOptions = selectedQuestions.map(question => 
        shuffleQuestionOptions(question)
      );
      
      setShuffledQuestions(questionsWithShuffledOptions);
      
      // Reset answers array to match the new question count
      setAnswers(new Array(TOTAL_QUESTIONS).fill(null));
      
      console.log(`Selected ${TOTAL_QUESTIONS} questions from ${mcqQuestions.length} total questions`);
    }
  }, []); // Only run once on mount

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !submitted && user && !testAlreadyTaken && shuffledQuestions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted && user && !testAlreadyTaken && shuffledQuestions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted, user, testAlreadyTaken, shuffledQuestions.length]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserTeam(currentUser.email);
      } else {
        alert("Please login first.");
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's team information from MongoDB
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
          await fetchTeamScores(data.team, userEmail);
        } else {
          // No team found, check if user has taken test individually
          await checkIndividualTestStatus(userEmail);
        }
      } else {
        console.error('Failed to fetch user team');
        await checkIndividualTestStatus(userEmail);
      }
      setLoadingTeamData(false);
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("Error fetching user team:", error);
      await checkIndividualTestStatus(userEmail);
      setLoadingTeamData(false);
      setInitialDataLoaded(true);
    }
  };

  // Check if individual user has already taken the test
  const checkIndividualTestStatus = async (userEmail) => {
    try {
      const response = await fetch(`/api/submit-mcq?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.submission) {
          setTestAlreadyTaken(true);
          setUserPreviousScore(data.submission);
          setSubmitted(true);
          setScore(`${data.submission.score} / ${data.submission.totalQuestions}`);
        }
      } else if (response.status === 404) {
        // No previous submission found, user can take the test
        setTestAlreadyTaken(false);
      }
    } catch (error) {
      console.error("Error checking individual test status:", error);
    }
  };

  // Fetch team scores from MongoDB
  const fetchTeamScores = async (team, userEmail) => {
    if (!team || !team.members) return;

    try {
      const response = await fetch('/api/teams/getTeamScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeamSubmissions(data.submissions || []);
        setCombinedTeamScore(data.combinedScore || 0);

        // Check if current user has already taken the test
        if (data.testAlreadyTaken && data.userPreviousScore) {
          setTestAlreadyTaken(true);
          setUserPreviousScore(data.userPreviousScore);
          setSubmitted(true);
          setScore(`${data.userPreviousScore.score} / ${data.userPreviousScore.totalQuestions}`);
        }
      } else {
        console.error('Failed to fetch team scores');
      }
    } catch (error) {
      console.error("Error fetching team scores:", error);
    }
  };

  // Navigation functions
  const goToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < TOTAL_QUESTIONS && !testAlreadyTaken) {
      setCurrentQuestion(questionIndex);
      setVisitedQuestions(prev => new Set([...prev, questionIndex]));
      setShowQuestionPalette(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1 && !testAlreadyTaken) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0 && !testAlreadyTaken) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const toggleFlag = (questionIndex = currentQuestion) => {
    if (testAlreadyTaken) return;
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionIndex)) {
      newFlagged.delete(questionIndex);
    } else {
      newFlagged.add(questionIndex);
    }
    setFlaggedQuestions(newFlagged);
  };

  const selectOption = (optionIndex) => {
    if (testAlreadyTaken) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (testAlreadyTaken || shuffledQuestions.length === 0) return;

    setIsLoading(true);
    let calculatedScore = 0;

    // Calculate score using shuffled questions
    shuffledQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct_option) {
        calculatedScore++;
      }
    });

    setScore(`${calculatedScore} / ${TOTAL_QUESTIONS}`);
    setSubmitted(true);

    if (user) {
      try {
        const response = await fetch("/api/submit-mcq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            teamId: userTeam?.id || null,
            teamName: userTeam?.name || null,
            answers,
            score: calculatedScore,
            totalQuestions: TOTAL_QUESTIONS,
            questionsUsed: shuffledQuestions // Store the specific questions used
          }),
        });

        const data = await response.json();

        if (response.status === 409) {
          // Test already submitted
          alert("You have already submitted this test. Your previous score will be considered.");
          setTestAlreadyTaken(true);
          if (data.existingScore !== undefined) {
            setScore(`${data.existingScore} / ${TOTAL_QUESTIONS}`);
          }
        } else if (response.ok) {
          console.log("Score submitted successfully!");
          // Refresh team scores after submission
          if (userTeam) {
            await fetchTeamScores(userTeam, user.email);
          }
        } else {
          throw new Error(data.error || "Submission failed");
        }
      } catch (error) {
        console.error("Error submitting score:", error);
        alert("There was an error submitting your score. Please try again.");
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Question status functions
  const getQuestionStatus = (index) => {
    if (answers[index] !== null) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    if (visitedQuestions.has(index)) return 'visited';
    return 'unvisited';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-[#A5C9CA] text-[#2C3333] border-[#A5C9CA]';
      case 'flagged': return 'bg-yellow-500 text-[#2C3333] border-yellow-500';
      case 'visited': return 'bg-red-500 text-white border-red-500';
      default: return 'bg-[#395B64] text-[#A5C9CA] border-[#395B64]';
    }
  };

  // Statistics
  const answeredCount = answers.filter(a => a !== null).length;
  const flaggedCount = flaggedQuestions.size;
  const visitedCount = visitedQuestions.size;
  const unvisitedCount = TOTAL_QUESTIONS - visitedCount;

  // Loading state - wait for both user auth and questions to be ready
  if (user === null || !initialDataLoaded || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#2C3333] flex items-center justify-center">
        <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#A5C9CA]/30 border-t-[#A5C9CA] rounded-full animate-spin"></div>
            <span className="text-[#E7F6F2] text-lg">
              {!user ? "Authenticating..." : shuffledQuestions.length === 0 ? "Preparing questions..." : "Loading test data..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Test Already Taken Screen
  if (testAlreadyTaken && userPreviousScore) {
    const scoreNum = userPreviousScore.score;
    const totalNum = userPreviousScore.totalQuestions;
    const percentage = Math.round((scoreNum / totalNum) * 100);
    const submissionDate = new Date(userPreviousScore.submissionDate || userPreviousScore.submittedAt);

    return (
      <div className="min-h-screen bg-[#2C3333] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#A5C9CA] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#395B64] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 text-center hover:border-[#A5C9CA]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#A5C9CA]/10">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <AlertCircle className="w-16 h-16 text-[#2C3333]" />
            </div>

            <h1 className="text-5xl font-bold text-[#E7F6F2] mb-6">Test Already Completed!</h1>
            <p className="text-[#A5C9CA]/80 text-lg mb-8">
              You have already taken this MCQ test. Your submitted score will be considered for the competition.
            </p>

            {/* Previous Score Display */}
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#E7F6F2] mb-4">Your Previous Score</h2>
              <div className="text-6xl font-bold text-[#A5C9CA] mb-4">
                {scoreNum} / {totalNum}
              </div>
              <div className="text-2xl font-semibold text-[#E7F6F2]/80 mb-4">
                {percentage}%
              </div>
              <div className="text-[#A5C9CA]/70 text-sm">
                Submitted on: {submissionDate.toLocaleDateString()} at {submissionDate.toLocaleTimeString()}
              </div>

              {userTeam && (
                <div className="mt-4 pt-4 border-t border-[#395B64]/30">
                  <div className="text-[#E7F6F2]/80 text-sm mb-2">Team: {userTeam.name}</div>
                  <div className="text-[#A5C9CA] font-bold">Combined Team Score: {combinedTeamScore}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/"}
                className="bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#A5C9CA]/30"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#395B64]/40 hover:bg-[#395B64]/60 text-[#E7F6F2] font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-[#395B64] hover:border-[#A5C9CA]/50"
              >
                Logout
              </button>
            </div>

            {/* Warning Message */}
            <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold text-sm">
                  Only one attempt is allowed per participant. Your first submission is final.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen with team information (existing code remains the same)
  if (submitted && score) {
    const scoreNum = parseInt(score.split(' / ')[0]);
    const totalNum = parseInt(score.split(' / ')[1]);
    const percentage = Math.round((scoreNum / totalNum) * 100);

    return (
      <div className="min-h-screen bg-[#2C3333] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#A5C9CA] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#395B64] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Individual Score Card */}
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 text-center hover:border-[#A5C9CA]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#A5C9CA]/10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#A5C9CA] to-[#395B64] rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <User className="w-12 h-12 text-[#2C3333]" />
              </div>
              <h2 className="text-3xl font-bold text-[#E7F6F2] mb-4">Your Score</h2>
              <div className="text-6xl font-bold text-[#A5C9CA] mb-2 hover:scale-110 transition-transform duration-300">
                {score}
              </div>
              <div className="text-2xl font-semibold text-[#E7F6F2]/80 mb-6">
                {percentage}%
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#395B64]/20 rounded-lg p-3 hover:bg-[#395B64]/30 transition-colors duration-300">
                  <div className="text-[#A5C9CA] text-xl font-bold">{scoreNum}</div>
                  <div className="text-[#E7F6F2]/70 text-xs">Correct</div>
                </div>
                <div className="bg-[#395B64]/20 rounded-lg p-3 hover:bg-[#395B64]/30 transition-colors duration-300">
                  <div className="text-red-400 text-xl font-bold">{totalNum - scoreNum}</div>
                  <div className="text-[#E7F6F2]/70 text-xs">Incorrect</div>
                </div>
                <div className="bg-[#395B64]/20 rounded-lg p-3 hover:bg-[#395B64]/30 transition-colors duration-300">
                  <div className="text-[#A5C9CA] text-xl font-bold">{totalNum}</div>
                  <div className="text-[#E7F6F2]/70 text-xs">Total</div>
                </div>
              </div>
            </div>

            {/* Team Score Card */}
            <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 text-center hover:border-[#A5C9CA]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#A5C9CA]/10">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                {userTeam ? <Users className="w-12 h-12 text-[#2C3333]" /> : <User className="w-12 h-12 text-[#2C3333]" />}
              </div>
              <h2 className="text-3xl font-bold text-[#E7F6F2] mb-4">
                {userTeam ? 'Team Score' : 'Individual'}
              </h2>
              {userTeam ? (
                <>
                  <div className="text-6xl font-bold text-yellow-400 mb-2 hover:scale-110 transition-transform duration-300">
                    {combinedTeamScore}
                  </div>
                  <div className="text-xl font-semibold text-[#E7F6F2]/80 mb-6">
                    {userTeam.name}
                  </div>
                  <div className="space-y-3 mb-6">
                    {teamSubmissions.map((memberScore, index) => (
                      <div key={memberScore.id} className="bg-[#395B64]/20 rounded-lg p-4 flex justify-between items-center hover:bg-[#395B64]/30 transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${memberScore.userEmail === user.email ? 'bg-[#A5C9CA]' : 'bg-[#395B64]'
                            }`}>
                            {memberScore.userEmail === user.email ? (
                              <Star className="w-4 h-4 text-[#2C3333]" />
                            ) : (
                              <User className="w-4 h-4 text-[#A5C9CA]" />
                            )}
                          </div>
                          <span className="text-[#E7F6F2] text-sm truncate max-w-32">
                            {memberScore.userEmail === user.email ? 'You' : memberScore.userEmail}
                          </span>
                        </div>
                        <div className="text-[#A5C9CA] font-bold">
                          {memberScore.score}/{memberScore.totalQuestions}
                        </div>
                      </div>
                    ))}
                    {userTeam.members && teamSubmissions.length < userTeam.members.length && (
                      <div className="text-[#E7F6F2]/60 text-sm italic">
                        {userTeam.members.length - teamSubmissions.length} teammate(s) haven't submitted yet
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-[#A5C9CA] mb-4">Solo Player</div>
                  <div className="text-[#E7F6F2]/70 mb-6">
                    Competing individually
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Combined Results Summary */}
          <div className="mt-8 bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 text-center hover:border-[#A5C9CA]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#A5C9CA]/10">
            <div className="w-32 h-32 bg-gradient-to-br from-[#A5C9CA] to-[#395B64] rounded-full flex items-center justify-center mx-auto mb-8 hover:scale-110 transition-transform duration-300 animate-bounce">
              <Trophy className="w-16 h-16 text-[#2C3333]" />
            </div>
            <h1 className="text-5xl font-bold text-[#E7F6F2] mb-6">Excellent Work!</h1>
            <p className="text-[#A5C9CA]/80 text-lg mb-4">
              Great job completing the MCQ round, {user.email}!
              {userTeam && ` Your team "${userTeam.name}" is now ready to compete!`}
            </p>
            <p className="text-[#E7F6F2]/60 text-sm mb-8">
              You answered {TOTAL_QUESTIONS} randomized questions selected from our question bank.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/"}
                className="bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#A5C9CA]/30"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#395B64]/40 hover:bg-[#395B64]/60 text-[#E7F6F2] font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-[#395B64] hover:border-[#A5C9CA]/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shuffledQuestions[currentQuestion]) {
    return (
      <div className="min-h-screen bg-[#2C3333] flex items-center justify-center">
        <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-xl p-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#A5C9CA]/30 border-t-[#A5C9CA] rounded-full animate-spin"></div>
            <span className="text-[#E7F6F2] text-lg">Loading question...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#2C3333] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#A5C9CA] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#395B64] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A5C9CA] rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-[#395B64]/10 backdrop-blur-sm border-b border-[#395B64]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#A5C9CA] p-3 rounded-xl hover:bg-[#E7F6F2] transition-colors duration-300">
                <BookOpen className="w-8 h-8 text-[#2C3333]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E7F6F2]">MCQ Assessment</h1>
                <p className="text-[#A5C9CA]/80 text-sm">
                  Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
                  {userTeam && ` • Team: ${userTeam.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className="flex items-center space-x-2 bg-[#395B64]/20 border border-[#395B64]/30 px-4 py-2 rounded-xl hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-300">
                <Clock className="w-5 h-5 text-[#A5C9CA]" />
                <span className={`font-mono text-lg font-bold ${timeLeft < 600 ? 'text-red-400 animate-pulse' : 'text-[#E7F6F2]'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Team info or User info */}
              <div className="flex items-center space-x-2 bg-[#395B64]/20 border border-[#395B64]/30 px-4 py-2 rounded-xl hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-300">
                {userTeam ? <Users className="w-5 h-5 text-[#A5C9CA]" /> : <User className="w-5 h-5 text-[#A5C9CA]" />}
                <span className="text-[#E7F6F2] text-sm truncate max-w-32">{user?.email}</span>
              </div>

              {/* Question palette toggle */}
              <button
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
                className="bg-[#395B64]/20 hover:bg-[#395B64]/40 border border-[#395B64]/30 px-4 py-2 rounded-xl transition-all duration-300 text-[#A5C9CA] hover:border-[#A5C9CA]/50"
              >
                <Target className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 text-red-400 hover:text-red-300 hover:border-red-400/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Question Panel */}
        <div className="flex-1">
          {/* Progress Stats with Team Info */}
          <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-6 mb-6 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#E7F6F2]">Progress Overview</h3>
              <div className="flex items-center space-x-2">
                {userTeam && (
                  <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">{userTeam.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 bg-[#A5C9CA]/20 px-3 py-1 rounded-full border border-[#A5C9CA]/30">
                  <Target className="w-4 h-4 text-[#A5C9CA]" />
                  <span className="text-[#A5C9CA] text-sm font-medium">{TOTAL_QUESTIONS} Questions</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#A5C9CA]">{answeredCount}</div>
                <div className="text-[#E7F6F2]/70 text-sm">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{flaggedCount}</div>
                <div className="text-[#E7F6F2]/70 text-sm">Flagged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{visitedCount - answeredCount}</div>
                <div className="text-[#E7F6F2]/70 text-sm">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E7F6F2]/60">{unvisitedCount}</div>
                <div className="text-[#E7F6F2]/70 text-sm">Unvisited</div>
              </div>
            </div>
          </div>

          {/* Current Question */}
          <div className="bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-8 mb-6 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-[#A5C9CA] text-[#2C3333] px-4 py-2 rounded-lg font-bold">
                  Q{currentQuestion + 1}
                </div>
                <button
                  onClick={() => toggleFlag()}
                  disabled={testAlreadyTaken}
                  className={`p-2 rounded-lg transition-all duration-300 ${testAlreadyTaken ? 'opacity-50 cursor-not-allowed' : ''} ${flaggedQuestions.has(currentQuestion)
                    ? 'bg-yellow-500 text-[#2C3333] shadow-lg hover:bg-yellow-400'
                    : 'bg-[#395B64]/40 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300'
                    }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
              {timeLeft < 600 && !testAlreadyTaken && (
                <div className="flex items-center space-x-2 text-red-400 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Time running out!</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-[#E7F6F2] mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => selectOption(idx)}
                  disabled={testAlreadyTaken}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-500 transform ${testAlreadyTaken ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02] group'} ${answers[currentQuestion] === idx
                    ? 'border-[#A5C9CA] bg-[#A5C9CA]/20 text-[#E7F6F2] shadow-lg shadow-[#A5C9CA]/25 hover:shadow-[#A5C9CA]/40'
                    : 'border-[#395B64] bg-[#395B64]/20 text-[#A5C9CA] hover:border-[#A5C9CA]/70 hover:bg-[#A5C9CA]/10 hover:text-[#E7F6F2]'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${answers[currentQuestion] === idx
                      ? 'border-[#A5C9CA] bg-[#A5C9CA]'
                      : 'border-[#395B64] group-hover:border-[#A5C9CA]'
                      }`}>
                      {answers[currentQuestion] === idx && <CheckCircle className="w-4 h-4 text-[#2C3333]" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-lg">{String.fromCharCode(65 + idx)}.</span>
                      <span className="ml-3 font-medium">{option}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0 || testAlreadyTaken}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${currentQuestion === 0 || testAlreadyTaken
                ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed'
                : 'bg-[#395B64]/40 text-[#E7F6F2] hover:bg-[#395B64]/60 border border-[#A5C9CA]/50 transform hover:scale-105'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowQuestionPalette(true)}
                className="px-6 py-3 bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A5C9CA]/30"
              >
                Question Palette
              </button>
            </div>

            {currentQuestion === TOTAL_QUESTIONS - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={testAlreadyTaken || isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${testAlreadyTaken || isLoading
                  ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed'
                  : 'bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] shadow-lg hover:shadow-[#A5C9CA]/30 transform hover:scale-105'
                  }`}
              >
                <span>{isLoading ? 'Submitting...' : 'Submit'}</span>
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={testAlreadyTaken}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${testAlreadyTaken
                  ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed'
                  : 'bg-[#395B64]/40 text-[#E7F6F2] hover:bg-[#395B64]/60 border border-[#395B64]/30 hover:border-[#A5C9CA]/50 transform hover:scale-105'
                  }`}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Side Panel - Question Palette */}
        {showQuestionPalette && (
          <div className="w-80 bg-[#395B64]/20 backdrop-blur-sm border border-[#395B64]/30 rounded-2xl p-6 hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#A5C9CA]/10 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E7F6F2]">Question Palette</h3>
              <button
                onClick={() => setShowQuestionPalette(false)}
                className="text-[#A5C9CA] hover:text-[#E7F6F2] transition-colors duration-300"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#A5C9CA] rounded border"></div>
                <span className="text-[#E7F6F2]/80">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                <span className="text-[#E7F6F2]/80">Flagged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span className="text-[#E7F6F2]/80">Visited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#395B64] rounded border"></div>
                <span className="text-[#E7F6F2]/80">Unvisited</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, idx) => {
                const status = getQuestionStatus(idx);
                const isCurrent = idx === currentQuestion;
                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    disabled={testAlreadyTaken}
                    className={`w-12 h-12 rounded-lg border-2 font-bold transition-all duration-300 text-sm ${testAlreadyTaken ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'} ${isCurrent
                      ? 'ring-2 ring-[#A5C9CA] ring-offset-2 ring-offset-[#2C3333] scale-110'
                      : ''
                      } ${getStatusColor(status)}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || testAlreadyTaken}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isLoading || testAlreadyTaken
                ? 'bg-[#395B64]/30 text-[#A5C9CA]/50 cursor-not-allowed'
                : 'bg-[#A5C9CA] hover:bg-[#E7F6F2] text-[#2C3333] shadow-lg hover:shadow-[#A5C9CA]/30 transform hover:scale-105'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#2C3333]/30 border-t-[#2C3333] rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {testAlreadyTaken ? 'Test Completed' : 'Submit Test'}
                </>
              )}
            </button>

            {!testAlreadyTaken && answeredCount < TOTAL_QUESTIONS && !isLoading && (
              <p className="text-[#A5C9CA]/70 text-sm mt-3 text-center animate-pulse">
                {TOTAL_QUESTIONS - answeredCount} questions remaining
              </p>
            )}

            {testAlreadyTaken && (
              <p className="text-yellow-400 text-sm mt-3 text-center">
                Test already completed
              </p>
            )}

            {/* Shuffle Info */}
            <div className="mt-4 p-3 bg-[#A5C9CA]/10 border border-[#A5C9CA]/20 rounded-lg">
              <p className="text-[#A5C9CA]/80 text-xs text-center">
                Questions and options are randomized for each participant
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
