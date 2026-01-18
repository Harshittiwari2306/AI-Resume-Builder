import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },

    professional_summary: { type: String, default: "" },

    skills: [String],

    personal_info: {
      image: String,
      name: String,
      profession: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      website: String,
    },

    work_experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduation_date: String,
        gpa: String,
      },
    ],

    project: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model("Resume", ResumeSchema);
