import { NextResponse } from "next/server";
import Post from "@/models/Post";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { title, description, category, status } = await req.json();
    if (!title || !description || !category || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }
    const newPost = new Post({
      title,
      description,
      category,
      status,
    });
    await newPost.save();

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating post",
      },
      { status: 500 },
    );
  }
}
