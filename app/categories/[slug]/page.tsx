import React from "react";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Job from "@/models/Job";
import { notFound } from "next/navigation";
import CategoryDetailContent from "./CategoryDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const categoryDoc = await Category.findOne({
    $or: [{ slug }, { _id: slug.length === 24 ? slug : undefined }]
  }).lean();
  
  if (!categoryDoc) {
    return { title: "Category Not Found - Karirak" };
  }
  
  return {
    title: `${categoryDoc.name} Jobs - Karirak`,
    description: `Browse open vacancies and career pathways in the ${categoryDoc.name} industry.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const categoryDoc = await Category.findOne({
    $or: [{ slug }, { _id: slug.length === 24 ? slug : undefined }]
  }).lean();
  if (!categoryDoc) {
    notFound();
  }

  let categorySlugs = [categoryDoc.slug];
  if (!categoryDoc.parent) {
    const subcategories = await Category.find({ parent: categoryDoc._id }).lean();
    if (subcategories.length > 0) {
      categorySlugs = [categoryDoc.slug, ...subcategories.map((sub: any) => sub.slug)];
    }
  }

  const jobs = await Job.find({
    status: "active",
    category: { $in: categorySlugs }
  })
    .sort({ createdAt: -1 })
    .lean();

  const serializedJobs = JSON.parse(JSON.stringify(jobs));
  const serializedCategory = JSON.parse(JSON.stringify(categoryDoc));

  return <CategoryDetailContent category={serializedCategory} jobs={serializedJobs} />;
}
