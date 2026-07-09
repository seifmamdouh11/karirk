import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Post from "@/models/Post";

async function migrateStatus() {
  try {
    await connectDB();

    console.log("Migrating jobs to status: active...");
    const jobResult = await Job.updateMany(
      { $or: [{ status: null }, { status: undefined }, { status: "pending" }] },
      { $set: { status: "active" } }
    );
    console.log(`Updated ${jobResult.modifiedCount} jobs to status: active`);

    console.log("Migrating posts to status: published...");
    const postResult = await Post.updateMany(
      { $or: [{ status: null }, { status: undefined }, { status: "draft" }] },
      { $set: { status: "published" } }
    );
    console.log(`Updated ${postResult.modifiedCount} posts to status: published`);

    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateStatus();
