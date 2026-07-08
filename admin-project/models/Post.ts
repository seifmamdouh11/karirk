import mongoose from "mongoose";
import Category from "./Category";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: async function (value: string) {
          const val = value.toLowerCase().trim();
          const count = await Category.countDocuments({
            $or: [{ name: val }, { slug: val }]
          });
          return count > 0;
        },
        message: "Category '{VALUE}' does not exist.",
      },
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  {
    timestamps: true,
  },
);

PostSchema.pre("save", function () {
  if (!this.slug) {
    const baseSlug = slugify(this.title);
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
