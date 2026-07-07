import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const q = query.get("q");

    if (!q) {
      return NextResponse.json({
        success: true,
        jobs: [],
        posts: []
      });
    }

    await connectDB();
    const searchRegex = new RegExp(q, "i");

    // Fetch matching active jobs, limit to 5
    const jobs = await Job.find({
      status: "active",
      $or: [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Fetch matching published posts, limit to 5
    const posts = await Post.find({
      status: "published",
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      jobs,
      posts
    });
  } catch (error) {
    console.error("Unified search failed:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
