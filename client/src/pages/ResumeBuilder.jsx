import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  GraduationCap,
  Sparkles,
  User,
  Briefcase,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadCloudIcon,
} from "lucide-react";

import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api"; // ✅ FIX 1

// ✅ FIX 2: normalize resume so reload does not reset
const normalizeResume = (resume) => ({
  _id: resume._id || "",
  title: resume.title || "",
  personal_info: resume.personal_info || {},
  professional_summary: resume.professional_summary || "",
  work_experience: resume.work_experience || [],
  education: resume.education || [],
  project: resume.project || [],
  skills: resume.skills || [],
  template: resume.template || "classic",
  accent_color: resume.accent_color || "#9333ea",
  public: resume.public || false,
});

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState(normalizeResume({}));
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "personal info", icon: User },
    { id: "summary", name: "summary", icon: FileText },
    { id: "experience", name: "experience", icon: Briefcase },
    { id: "education", name: "education", icon: GraduationCap },
    { id: "projects", name: "projects", icon: Folder },
    { id: "skills", name: "skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  /* LOAD */
  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.resume) {
        const normalized = normalizeResume(data.resume);
        setResumeData(normalized);
        document.title = normalized.title || "Resume";
      }
    } catch (error) {
      console.error("Load resume error:", error);
    }
  };

  useEffect(() => {
    if (resumeId && token) loadExistingResume();
  }, [resumeId, token]);

  /* SAVE */
  const saveResume = () => {
    let updatedResumeData = structuredClone(resumeData);

    // ✅ FIX 4: safe access
    if (
      updatedResumeData.personal_info &&
      typeof updatedResumeData.personal_info.image === "object"
    ) {
      delete updatedResumeData.personal_info.image;
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId);
    formData.append("resumeData", JSON.stringify(updatedResumeData));
    removeBackground && formData.append("removeBackground", "yes");

    if (resumeData.personal_info?.image instanceof File) {
      formData.append("image", resumeData.personal_info.image);
    }

    // ✅ FIX 5: return promise
    return api.put("/api/resumes/update", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* VISIBILITY */
  const changeResumevisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("public", JSON.stringify(!resumeData.public));

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FIX 6: sync with DB
      setResumeData((prev) => ({ ...prev, ...data.resume }));
      toast.success(data.message);
    } catch (error) {
      console.error("Error changing visibility:", error);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    navigator.share
      ? navigator.share({ url: resumeUrl, text: "My Resume" })
      : alert("Share not supported");
  };

  const downloadResume = () => window.print();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="relative lg:col-span-5 rounded-lg ">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((i) => Math.max(i - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((i) =>
                        Math.min(i + 1, sections.length - 1)
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Forms */}
              <div className="space-y-6">
               {activeSection.id === "personal" && (
  <PersonalInfoForm
    data={resumeData.personal_info}
    onChange={(data) =>
      setResumeData((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          ...data,
        },
      }))
    }
    removeBackground={removeBackground}
    setRemoveBackground={setRemoveBackground}
  />
)}


                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                      setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.work_experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        work_experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              <button
  onClick={() =>
    toast.promise(
      saveResume(),
      {
        loading: "Saving...",
        success: "Resume saved",
        error: "Save failed",
      }
    )
  }
  className="bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-300
  text-blue-600 ring hover:ring-blue-400 transition-all
  rounded-md px-6 py-2 mt-6 text-sm"
>
  Save Changes
</button>

            </div>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
                  rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}
                <button onClick={changeResumevisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs
                bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
                ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "public" : "private"}
                </button>
                <button onClick={downloadResume}
                  className="flex items-center gap-2 px-6 py-2 text-xs
                bg-gradient-to-br from-green-100 to-green-200 text-green-600
                rounded-lg ring-green-300 gover:ring transition-colors"
                >
                  <DownloadCloudIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
