import { NextResponse } from "next/server";
import Post from "@/models/Post";
import connectDB from "@/lib/mongodb";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const secret = req.headers.get("secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    const { id } = await params;
    await connectDB();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 },
      );
    }
    const body = await req.json();
    const updatedPost = await Post.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (body.category) {
      updatedPost.category = body.category.toLowerCase().trim();
    }
    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Post updated successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating post:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Error updating post",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const secret = req.headers.get("secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    const { id } = await params;
    await connectDB();
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting post",
      },
      { status: 500 },
    );
  }
}
