import React from "react";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Job from "@/models/Job";
import Post from "@/models/Post";
import Hero from "@/components/home/Hero";
import HomeContent from "@/components/home/HomeContent";
import SubscribeBanner from "@/components/home/SubscribeBanner";

export default async function Home() {
  await connectDB();

  // Load categories, featured jobs and latest posts
  const categories = await Category.find().sort({ name: 1 }).lean();
  const parentCategories = categories.filter((c: any) => !c.parent);

  const featuredJobs = await Job.find({ status: "active" }).sort({ createdAt: -1 }).limit(6).lean();

  const posts = await Post.find({ status: "published" }).sort({ createdAt: -1 }).limit(6).lean();

  const serializedJobs = JSON.parse(JSON.stringify(featuredJobs));
  const serializedPosts = JSON.parse(JSON.stringify(posts));
  const serializedParentCategories = JSON.parse(JSON.stringify(parentCategories));

  return (
    <main>
      <Hero />

      <div>
        <HomeContent
          parentCategories={serializedParentCategories}
          serializedJobs={serializedJobs}
          serializedPosts={serializedPosts}
        />
      </div>

      <div>
        <SubscribeBanner />
      </div>
    </main>
  );
}
