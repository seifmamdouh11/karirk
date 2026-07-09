import React from "react";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { notFound } from "next/navigation";
import EditJobClient from "./EditJobClient";

export const metadata = {
  title: "Edit Job - Admin",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  let job;
  try {
    job = await Job.findById(id).lean();
  } catch (error) {
    console.error(error);
    return notFound();
  }

  if (!job) return notFound();
  return <EditJobClient initialJob={JSON.parse(JSON.stringify(job))} />;
}
