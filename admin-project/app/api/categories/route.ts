import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    // Fetch all categories sorted by name
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Separate parents and subcategories
    const parentCategories = categories.filter((c: any) => !c.parent);
    const subcategories = categories.filter((c: any) => c.parent);

    // Map subcategories to parents
    const hierarchicalCategories = parentCategories.map((parent: any) => ({
      _id: parent._id,
      name: parent.name,
      slug: parent.slug,
      subcategories: subcategories
        .filter((sub: any) => sub.parent.toString() === parent._id.toString())
        .map((sub: any) => ({
          _id: sub._id,
          name: sub.name,
          slug: sub.slug,
        })),
    }));

    return NextResponse.json(
      {
        success: true,
        data: hierarchicalCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
