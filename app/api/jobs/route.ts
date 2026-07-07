import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const country = query.get("country");
    const category = query.get("category");
    const type = query.get("type");
    const q = query.get("q");
    const featured = query.get("featured");

    await connectDB();
    const filter: any = { status: "active" };

    if (country) {
      filter.country = { $regex: new RegExp(`^${country}$`, "i") };
    }

    if (category) {
      const normalizedCategory = category.toLowerCase().trim();
      const catDoc = await Category.findOne({
        $or: [{ slug: normalizedCategory }, { name: new RegExp(`^${normalizedCategory}$`, "i") }]
      });

      if (catDoc) {
        if (!catDoc.parent) {
          // If parent category, get all subcategories
          const subcategories = await Category.find({ parent: catDoc._id });
          filter.category = {
            $in: [catDoc.slug, ...subcategories.map((sub: any) => sub.slug)]
          };
        } else {
          filter.category = catDoc.slug;
        }
      } else {
        filter.category = normalizedCategory;
      }
    }

    if (type) {
      filter.type = type;
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { title: regex },
        { company: regex },
        { description: regex },
        { location: regex }
      ];
    }

    const total = await Job.countDocuments(filter);

    let queryObj = Job.find(filter).sort({ createdAt: -1 });

    let jobs;
    if (featured === "true") {
      jobs = await queryObj.limit(6).lean();
    } else {
      const page = parseInt(query.get("page") || "1", 10);
      const limit = parseInt(query.get("limit") || "9", 10);
      const skip = (page - 1) * limit;
      jobs = await queryObj.skip(skip).limit(limit).lean();
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      total,
      page: featured === "true" ? 1 : parseInt(query.get("page") || "1", 10),
      limit: featured === "true" ? 6 : parseInt(query.get("limit") || "9", 10),
      totalPages: featured === "true" ? 1 : Math.ceil(total / (parseInt(query.get("limit") || "9", 10))),
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch jobs",
      },
      { status: 500 }
    );
  }
}

