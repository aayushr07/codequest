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

    // Find team where user is either player1 or player2
    const team = await teamsCollection.findOne({
      $or: [
        { player1Email: userEmail },
        { player2Email: userEmail }
      ]
    });

    if (!team) {
      return new Response(
        JSON.stringify({ 
          message: "No team found for this user",
          team: null 
        }), 
        { status: 200 }
      );
    }

    // Transform the team data to match the expected format
    const transformedTeam = {
      id: team._id.toString(),
      name: team.teamName,
      members: [team.player1Email, team.player2Email],
      player1Name: team.player1Name,
      player1Email: team.player1Email,
      player2Name: team.player2Name,
      player2Email: team.player2Email,
      year: team.year
    };

    return new Response(
      JSON.stringify({ 
        message: "Team found successfully",
        team: transformedTeam 
      }), 
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching user team:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}