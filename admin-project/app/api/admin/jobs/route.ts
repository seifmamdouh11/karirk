import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const secret = request.headers.get("secret")
        if (secret !== process.env.ADMIN_SECRET) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const body = await request.json();
        const job = new Job({
            title: body.title?.trim(),
            description: body.description?.trim(),
            country: body.country?.trim(),
            category: body.category?.trim(),
            type: body?.type?.toLowerCase(),
            salary: body.salary?.trim(),
            company: body.company?.trim(),
            location: body.location?.trim(),
            status: body.status?.trim(),
            applyLink: body.applyLink?.trim(),
        });
        await job.save();
        return Response.json({ job }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/admin/jobs:", error);
        return Response.json({ error: "Failed to create job" }, { status: 500 });
    }
}
