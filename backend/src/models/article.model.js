import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: [true, "Slug is already exists!"],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);
