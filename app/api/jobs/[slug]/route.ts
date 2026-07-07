import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    try {
        await connectDB();
        const { slug } = await params;
        
        console.log("Fetching job:", slug);
        const job = await Job.findOne({ slug });
        console.log("Job found:", job);
        
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }
        return NextResponse.json({ job }, { status: 200 });
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
    }
}