import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

type CategoryDocument = {
  _id: { toString(): string };
  parent?: unknown;
  name: string;
  slug: string;
};

export async function GET() {
  try {
    await connectDB();
    // Fetch all categories sorted by name
    const categories = await Category.find().sort({ name: 1 }).lean() as CategoryDocument[];

    // Separate parents and subcategories
    const parentCategories = categories.filter((c) => !c.parent);
    const subcategories = categories.filter((c) => c.parent);

    // Map subcategories to parents
    const hierarchicalCategories = parentCategories.map((parent) => ({
      _id: parent._id,
      name: parent.name,
      slug: parent.slug,
      subcategories: subcategories
        .filter((sub) => sub.parent?.toString() === parent._id.toString())
        .map((sub) => ({
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
