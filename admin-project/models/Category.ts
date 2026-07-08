import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: Schema.Types.ObjectId, ref: "Category", default: null }
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;