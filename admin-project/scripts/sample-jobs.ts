import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

async function sampleJobs() {
  try {
    await connectDB();

    console.log("\n=== FIRST 3 JOBS ===");
    const jobs = await Job.find().limit(3).lean();
    console.log(JSON.stringify(jobs, null, 2));

    console.log("\n=== JOBS WITH MISSING STATUS ===");
    const missingStatus = await Job.find({ status: { $in: [null, "", undefined] } }).limit(5).lean();
    console.log(`Found ${missingStatus.length} jobs with missing/empty status`);
    if (missingStatus.length > 0) {
      console.log(JSON.stringify(missingStatus[0], null, 2));
    }

    console.log("\n=== ALL JOBS SUMMARY ===");
    const total = await Job.countDocuments();
    const active = await Job.countDocuments({ status: "active" });
    const pending = await Job.countDocuments({ status: "pending" });
    const other = await Job.countDocuments({ status: { $nin: ["active", "pending"] } });
    
    console.log(`Total: ${total}`);
    console.log(`Active: ${active}`);
    console.log(`Pending: ${pending}`);
    console.log(`Other/Empty: ${other}`);

    process.exit(0);
  } catch (error) {
    console.error("Check failed:", error);
    process.exit(1);
  }
}

sampleJobs();
