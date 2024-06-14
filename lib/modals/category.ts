import { Schema, model, models } from "mongoose";
import { title } from "process";

const categorySchema = new Schema(
  {
    title: { type: "string", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", categorySchema);

export default Category;
