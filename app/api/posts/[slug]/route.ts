import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  },
) {
  try {
    const { slug } = await params;
    await connectDB();
    const post = await Post.find({ slug }).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        posts: post,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch post",
      },
      { status: 500 },
    );
  }
}
