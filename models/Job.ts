import mongoose, { Schema } from "mongoose";


function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const jobSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    location: { type: String },
    salary: { type: String, required: true },
    type: { type: String, enum: ["full-time", "part-time", "contract", "temporary", "internship", "remote", "hybrid"], required: true },
    company: { type: String, required: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    country: { type: String, required: true },
    status: { type: String, default: "active" },
    applyLink: { type: String, required: true },
}, {
    timestamps: true
});

jobSchema.pre("save", function () {
    if (!this.slug) {
        const baseSlug = slugify(`${this.title}-${this.company}`);
        this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);


export default Job;