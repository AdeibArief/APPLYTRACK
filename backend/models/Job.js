import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Saved", "Applied", "Interviewing", "Offer", "Rejected"],
      default:'Applied'
    },
    source: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Jobs = mongoose.model("Jobs", JobSchema);

export default Jobs;
