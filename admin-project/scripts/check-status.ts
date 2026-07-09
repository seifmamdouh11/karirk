import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Post from "@/models/Post";

async function checkStatus() {
  try {
    await connectDB();

    console.log("\n=== JOB STATUS DISTRIBUTION ===");
    const jobStats = await Job.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log(JSON.stringify(jobStats, null, 2));

    console.log("\n=== POST STATUS DISTRIBUTION ===");
    const postStats = await Post.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log(JSON.stringify(postStats, null, 2));

    const totalJobs = await Job.countDocuments();
    console.log(`\nTotal jobs in database: ${totalJobs}`);

    process.exit(0);
  } catch (error) {
    console.error("Check failed:", error);
    process.exit(1);
  }
}

checkStatus();
