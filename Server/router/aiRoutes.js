import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// test route (keep this while debugging)
aiRouter.get("/ping", (req, res) => {
  res.json({ ok: true });
});

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-description", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);

export default aiRouter;
