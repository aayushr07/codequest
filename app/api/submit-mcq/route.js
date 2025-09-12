"use server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(req) {
  const { 
    userId, 
    userEmail, 
    teamId, 
    teamName, 
    answers, 
    score, 
    totalQuestions 
  } = await req.json();

  // Validation
  if (!userId || !userEmail || !answers || score === undefined || !totalQuestions) {
    return new Response(
      JSON.stringify({ 
        error: "Missing required fields: userId, userEmail, answers, score, totalQuestions" 
      }), 
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const scoresCollection = db.collection("mcq_scores");

    // Check if user has already submitted
    const existingSubmission = await scoresCollection.findOne({
      $or: [
        { userId: userId },
        { userEmail: userEmail }
      ]
    });

    if (existingSubmission) {
      return new Response(
        JSON.stringify({ 
          error: "MCQ already submitted for this user",
          existingScore: existingSubmission.score,
          submittedAt: existingSubmission.submittedAt
        }), 
        { status: 409 }
      );
    }

    // Calculate percentage
    const percentage = Math.round((score / totalQuestions) * 100);

    // Prepare submission data
    const submissionData = {
      userId,
      userEmail,
      teamId: teamId || null,
      teamName: teamName || null,
      answers,
      score,
      totalQuestions,
      percentage,
      submittedAt: new Date(),
      timestamp: new Date().toISOString(),
      // Additional metadata
      correctAnswers: score,
      incorrectAnswers: totalQuestions - score,
      status: "completed"
    };

    // Insert the submission
    const result = await scoresCollection.insertOne(submissionData);

    // Return success response
    return new Response(
      JSON.stringify({
        message: "MCQ submission successful!",
        submissionId: result.insertedId.toString(),
        score: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        submittedAt: submissionData.submittedAt,
        teamInfo: teamId ? {
          teamId,
          teamName
        } : null
      }), 
      { status: 201 }
    );

  } catch (err) {
    console.error("Error submitting MCQ:", err);
    return new Response(
      JSON.stringify({ 
        error: "Failed to submit MCQ. Please try again.",
        details: err.message 
      }), 
      { status: 500 }
    );
  }
}

// Optional: GET method to retrieve submission details
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const userEmail = url.searchParams.get('userEmail');

    if (!userId && !userEmail) {
      return new Response(
        JSON.stringify({ error: "Either userId or userEmail is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hackathon");
    const scoresCollection = db.collection("mcq_scores");

    const query = userId ? { userId } : { userEmail };
    const submission = await scoresCollection.findOne(query);

    if (!submission) {
      return new Response(
        JSON.stringify({ message: "No submission found for this user" }),
        { status: 404 }
      );
    }

    // Remove sensitive data if needed
    const { _id, ...submissionData } = submission;
    submissionData.id = _id.toString();

    return new Response(
      JSON.stringify({
        message: "Submission retrieved successfully",
        submission: submissionData
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error retrieving submission:", err);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve submission" }),
      { status: 500 }
    );
  }
}