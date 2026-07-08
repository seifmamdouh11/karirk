import React from "react";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import EditPostClient from "./EditPostClient";

export const metadata = {
  title: "Edit Post - Admin",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  try {
    const post = await Post.findById(id).lean();
    if (!post) return notFound();
    
    return <EditPostClient initialPost={JSON.parse(JSON.stringify(post))} />;
  } catch (error) {
    return notFound();
  }
}
