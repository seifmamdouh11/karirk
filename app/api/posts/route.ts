import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const q = query.get("q");
    const category = query.get("category");

    await connectDB();
    const filter: any = { status: "published" };

    if (category) {
      filter.category = category.toLowerCase().trim();
    }

    if (q) {
      const searchRegex = new RegExp(q, "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      {
        success: true,
        data: posts,
        total: posts.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
      },
      { status: 500 },
    );
  }
}

