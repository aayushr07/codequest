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
  const { userEmail } = await req.json();

  if (!userEmail) {
    return new Response(
      JSON.stringify({ error: "User email is required" }), 
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const teamsCollection = db.collection("teams");
    const scoresCollection = db.collection("mcq_scores"); // Assuming this is your scores collection name

    // First, find the user's team
    const team = await teamsCollection.findOne({
      $or: [
        { player1Email: userEmail },
        { player2Email: userEmail }
      ]
    });

    if (!team) {
      return new Response(
        JSON.stringify({ 
          error: "No team found for this user",
          submissions: [],
          combinedScore: 0
        }), 
        { status: 404 }
      );
    }

    // Get all team members' emails
    const teamMembers = [team.player1Email, team.player2Email];

    // Fetch MCQ scores for all team members
    const teamScores = await scoresCollection.find({
      userEmail: { $in: teamMembers }
    }).toArray();

    // Calculate combined team score
    const combinedScore = teamScores.reduce((total, score) => {
      return total + (score.score || 0);
    }, 0);

    // Transform scores data to match expected format
    const submissions = teamScores.map(score => ({
      id: score._id.toString(),
      userId: score.userId,
      userEmail: score.userEmail,
      score: score.score,
      totalQuestions: score.totalQuestions,
      submittedAt: score.submittedAt || score.timestamp,
      teamId: score.teamId,
      teamName: score.teamName
    }));

    return new Response(
      JSON.stringify({
        message: "Team scores retrieved successfully",
        team: {
          id: team._id.toString(),
          name: team.teamName,
          members: teamMembers
        },
        submissions,
        combinedScore,
        totalMembers: teamMembers.length,
        submittedMembers: submissions.length
      }), 
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching team scores:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}