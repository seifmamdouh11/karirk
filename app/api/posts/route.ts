import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const q = query.get("q");
    const category = query.get("category");

    await connectDB();
    const filter: any = { status: "published" };

    if (category) {
      const catSlug = category.toLowerCase().trim();
      
      // Find the category to see if it's a parent with subcategories
      const categoryDoc = await Category.findOne({ slug: catSlug });
      
      if (categoryDoc && !categoryDoc.parent) {
        // It is a parent category, find all its subcategories
        const subcategories = await Category.find({ parent: categoryDoc._id });
        const subSlugs = subcategories.map((c: any) => c.slug);
        
        // Match either the parent category slug or any of its subcategory slugs
        filter.category = { $in: [catSlug, ...subSlugs] };
      } else {
        // It's a specific subcategory or unknown, match exactly
        filter.category = catSlug;
      }
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
