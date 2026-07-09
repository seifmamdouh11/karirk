import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

async function checkDashboardData() {
  try {
    await connectDB();

    console.log("\n=== JOBS FETCHED BY ADMIN DASHBOARD ===");
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Total jobs: ${jobs.length}`);
    console.log(`Jobs with status 'active': ${jobs.filter(j => (j as any).status === 'active').length}`);
    console.log(`Jobs with undefined status: ${jobs.filter(j => (j as any).status === undefined).length}`);
    
    console.log("\n=== FIRST JOB DETAILS ===");
    if (jobs.length > 0) {
      console.log(JSON.stringify(jobs[0], null, 2));
    }

    console.log("\n=== ALL STATUS VALUES ===");
    const statuses = jobs.map((j: any) => j.status).filter((v, i, arr) => arr.indexOf(v) === i);
    console.log(statuses);

    process.exit(0);
  } catch (error) {
    console.error("Check failed:", error);
    process.exit(1);
  }
}

checkDashboardData();
