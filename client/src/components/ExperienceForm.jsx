import { Briefcase, Loader2, Plus, Sparkles, Trash } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    onChange([
      ...data,
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false,
      },
    ]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const generateDescription = async (index) => {
    const experience = data[index];
    if (!experience.position || !experience.company) return;

    setGeneratingIndex(index);

    const startDate = experience.start_date || "N/A";
    const endDate = experience.is_current
      ? "Present"
      : experience.end_date || "N/A";

    const prompt = `
Enhance the following job description for ATS:

Role: ${experience.position}
Company: ${experience.company}
Duration: ${startDate} to ${endDate}
Description: ${experience.description || ""}
`;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/ai/enhance-job-description",
        { userContent: prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      updateExperience(index, "description", res.data.enhancedContent);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">
            Add your job experience
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100
          text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">
            Click “Add Experience” to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">
                  Experience #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company name"
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  value={experience.position}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job title"
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="month"
                  value={experience.start_date}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="month"
                  value={experience.end_date}
                  disabled={experience.is_current}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border
                  disabled:bg-gray-100"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.is_current}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={() => generateDescription(index)}
                    disabled={
                      generatingIndex === index ||
                      !experience.position ||
                      !experience.company
                    }
                    className="flex items-center gap-1 px-2 py-1 text-xs
                    bg-purple-200 rounded hover:bg-purple-300
                    disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance with AI
                  </button>
                </div>

                <textarea
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-3 py-2 border rounded-lg"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
