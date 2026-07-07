import mongoose from "mongoose";
import Job from "../../models/Job";
import Category from "../../models/Category";
import Post from "../../models/Post";
import { slugify } from "../../lib/helpers/slugify";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/karirak";

const taxonomy: Record<string, string[]> = {
  "Technology & IT": [
    "Android Development",
    "Computer Networking",
    "Computer Repair",
    "Cybersecurity",
    "Information Security",
    "iOS Development",
    "Network Support",
    "Software Testing",
    "Technical Support",
    "Web Development",
    "WordPress Design"
  ],
  "Creative & Design": [
    "Animation",
    "Graphic Design",
    "Illustration",
    "Interaction Design",
    "Interior Design",
    "Logo Design",
    "Packaging Design",
    "Print Design",
    "User Experience Design",
    "Visual Design",
    "Web Design"
  ],
  "Marketing & Sales": [
    "Advertising",
    "Blogging",
    "Content Strategy",
    "Copywriting",
    "Demand Generation",
    "Digital Marketing",
    "Email Marketing",
    "Growth Marketing",
    "Lead Generation",
    "Market Research",
    "Marketing Strategy",
    "Mobile Marketing",
    "Product Marketing",
    "Public Relations",
    "Search Engine Marketing (SEM)",
    "Search Engine Optimization (SEO)",
    "Social Media Marketing"
  ],
  "Finance & Admin": [
    "Accounting",
    "Bookkeeping",
    "Budgeting",
    "Business Analytics",
    "Change Management",
    "Financial Accounting",
    "Financial Advisory",
    "Financial Analysis",
    "Financial Planning",
    "Financial Reporting",
    "Wealth Management",
    "Data Entry",
    "File Management",
    "Filing",
    "Information Management",
    "Notary",
    "Virtual Assistance",
    "Administrative Assistance"
  ],
  "Legal": [
    "Bankruptcy Law",
    "Business Law",
    "Corporate Law",
    "DUI Law",
    "Family Law",
    "Immigration Law",
    "Labor and Employment Law",
    "Personal Injury Law",
    "Tax Law"
  ],
  "Hospitality & Events": [
    "Bartending",
    "Catering",
    "Corporate Events",
    "Event Photography",
    "Event Planning",
    "DJing",
    "Headshot Photography",
    "Nature Photography",
    "Portrait Photography",
    "Wedding Photography",
    "Wedding Planning"
  ],
  "Insurance & Healthcare": [
    "Healthcare Consulting",
    "Health Insurance",
    "Life Insurance",
    "Auto Insurance",
    "Commercial Insurance",
    "Insurance"
  ],
  "Management & HR": [
    "Coaching & Mentoring",
    "Consulting",
    "Executive Coaching",
    "HR Consulting",
    "Human Resources",
    "Leadership Development",
    "Life Coaching",
    "Management Consulting",
    "Negotiation",
    "Nonprofit Consulting",
    "Program Management",
    "Project Management",
    "Property Management",
    "Strategic Planning",
    "Team Building",
    "Training"
  ],
  "Writing & Translation": [
    "Editing",
    "Ghostwriting",
    "Grant Writing",
    "Resume Writing",
    "Technical Writing",
    "Translation",
    "User Experience Writing",
    "UX Research",
    "Writing"
  ]
};

async function seed() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // 1. Clear Existing Data
    console.log("Clearing existing collections...");
    await Category.deleteMany({});
    await Job.deleteMany({});
    await Post.deleteMany({});
    console.log("Existing collections cleared.");

    // 2. Seed Categories and Subcategories
    console.log("Inserting hierarchical categories...");
    const subcategoryNames: string[] = [];

    for (const [parentName, subcategories] of Object.entries(taxonomy)) {
      // Create Parent Category
      const parentDoc = await Category.create({
        name: parentName,
        slug: slugify(parentName),
        parent: null
      });

      // Create Subcategories
      const subcategoryDocs = subcategories.map((subName) => {
        subcategoryNames.push(subName);
        return {
          name: subName,
          slug: slugify(subName),
          parent: parentDoc._id
        };
      });
      await Category.insertMany(subcategoryDocs);
    }
    console.log("Seeded hierarchical categories successfully!");

    // 3. Seed Jobs linked to Subcategories
    console.log("Inserting seed jobs...");
    const jobs = [];
    const jobTypes = ["full-time", "part-time", "contract", "internship", "remote", "hybrid"];
    const locations = [
      { city: "Cairo", country: "Egypt" },
      { city: "Riyadh", country: "Saudi Arabia" },
      { city: "Dubai", country: "United Arab Emirates" },
      { city: "Amman", country: "Jordan" },
      { city: "Abu Dhabi", country: "United Arab Emirates" }
    ];
    const companies = ["TechMinds", "PixelCraft", "GrowthFlow", "FinEdge", "LegalEase", "ApexCorp"];

    for (let i = 1; i <= 20; i++) {
      const subCategory = subcategoryNames[i % subcategoryNames.length];
      const loc = locations[i % locations.length];
      const jobType = jobTypes[i % jobTypes.length];
      const company = companies[i % companies.length];

      jobs.push({
        title: `${subCategory} Specialist`,
        description: `Join us as a ${subCategory} Specialist at ${company}. We are seeking a passionate individual with expertise in this field to drive innovation and deliver premium experiences.`,
        location: `${loc.city}, ${loc.country}`,
        salary: `${5000 + (i * 500)} - ${8000 + (i * 700)} AED`,
        type: jobType,
        company: company,
        category: slugify(subCategory), // Store lowercase slugified string as per Job model requirements
        country: loc.country,
        status: "active",
        applyLink: `https://example.com/apply/job-${i}`
      });
    }

    const createdJobs = await Job.create(jobs);
    console.log(`Seeded ${createdJobs.length} jobs successfully!`);

    // 4. Seed Posts
    console.log("Inserting seed posts...");
    const posts = [];
    for (let i = 1; i <= 6; i++) {
      const subCategory = subcategoryNames[(i * 3) % subcategoryNames.length];
      posts.push({
        title: `Essential Skills for a Career in ${subCategory}`,
        description: `Discover the top industry demands, toolsets, and workflow tips to succeed as a modern professional in ${subCategory}.`,
        category: slugify(subCategory),
        status: "published"
      });
    }
    const createdPosts = await Post.create(posts);
    console.log(`Seeded ${createdPosts.length} posts successfully!`);

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    console.log("Disconnecting from database...");
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
