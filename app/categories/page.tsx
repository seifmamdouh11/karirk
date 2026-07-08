import React from "react";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import CategoriesContent from "./CategoriesContent";

export const metadata = {
  title: "Explore Industries - Karirak",
  description: "Browse all job categories and industries in the Arab world.",
};

export default async function CategoriesPage() {
  await connectDB();
  
  const categories = await Category.find().sort({ name: 1 }).lean();
  const parentCategories = categories.filter((c: any) => !c.parent);
  const subcategories = categories.filter((c: any) => c.parent);

  const hierarchicalCategories = parentCategories.map((parent: any) => ({
    _id: parent._id.toString(),
    name: parent.name,
    slug: parent.slug,
    subcategories: subcategories
      .filter((sub: any) => sub.parent.toString() === parent._id.toString())
      .map((sub: any) => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
      })),
  }));

  return <CategoriesContent categories={hierarchicalCategories} />;
}
