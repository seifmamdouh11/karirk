import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest,{
    params
}:{
    params: Promise<{id: string}>
}){
    try{
        const secret = request.headers.get("secret")
        if (secret !== process.env.ADMIN_SECRET) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const {id} = await params;
        await connectDB();
        const body = await request.json();
        if(body.type){
           body.type = body.type.toLowerCase();
        }
        const job = await Job.findByIdAndUpdate(id, body, { new: true , runValidators:true});
        if(!job){
            return Response.json({ error: "Job not found" }, { status: 404 });
        }
        return Response.json({ job }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to update job" }, { status: 500 });
    }
}   

export async function DELETE(request:NextRequest,{
    params
}:{
    params: Promise<{id: string}>
}){
    try{
        const secret = request.headers.get("secret")
        if (secret !== process.env.ADMIN_SECRET) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const {id} = await params;
        await connectDB();
        const job = await Job.findByIdAndDelete(id);
        if(!job){
            return Response.json({ error: "Job not found" }, { status: 404 });
        }
        return Response.json({ job }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to delete job" }, { status: 500 });
    }
}