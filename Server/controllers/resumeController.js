import { type } from "os";
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

/**
 * CREATE RESUME
 * POST /api/resumes/create
 */
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const resume = await Resume.create({ userId, title });

    return res.status(201).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE RESUME
 * DELETE /api/resumes/delete/:resumeId
 */
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET RESUME (PRIVATE)
 * GET /api/resume/get/:resumeId
 */
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET RESUME (PUBLIC)
 * GET /api/resume/public/:resumeId
 */
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      public: true,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE RESUME (TITLE / DATA / IMAGE)
 * PUT /api/resumes/update
 */
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, public: isPublic, removeBackground } = req.body;
    const image = req.file;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    let updatedData = {};

    // Handle resumeData safely
    if (resumeData) {
      updatedData =
        typeof resumeData === "string"
          ? JSON.parse(resumeData)
          : { ...resumeData };
    }

    // Handle public/private toggle
    if (typeof isPublic !== "undefined") {
      updatedData.public = JSON.parse(isPublic);
    }

    // Handle image upload
    if (image) {
      const stream = fs.createReadStream(image.path);

      const upload = await imageKit.files.upload({
        file: stream,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      updatedData.personal_info = {
        ...updatedData.personal_info,
        image: upload.url,
      };

      fs.unlinkSync(image.path);
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
