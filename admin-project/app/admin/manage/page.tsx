import React from "react";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Post from "@/models/Post";
import ManageDashboardClient from "./ManageDashboardClient";

export const metadata = {
  title: "Admin Dashboard - Karirak",
};

export const dynamic = 'force-dynamic';

export default async function AdminManagePage() {
  await connectDB();

  // Fetch all jobs
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all posts
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .lean();

  const serializedJobs = JSON.parse(JSON.stringify(jobs));
  const serializedPosts = JSON.parse(JSON.stringify(posts));

  return <ManageDashboardClient initialJobs={serializedJobs} initialPosts={serializedPosts} />;
}
