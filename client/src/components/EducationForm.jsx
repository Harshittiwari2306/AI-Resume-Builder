import { GraduationCap, Plus, Trash } from "lucide-react";
import React from "react";

const EducationForm = ({ data = [], onChange = () => {} }) => {
  const addEducation = () => {
    const newEducation = {
      institute: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500"
                >
                  <Trash className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.institute}
                  onChange={(e) =>
                    updateEducation(index, "institute", e.target.value)
                  }
                  placeholder="Institute Name"
                  className="px-3 py-2 border rounded-lg"
                />

                <input
                  value={education.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  placeholder="Degree"
                  className="px-3 py-2 border rounded-lg"
                />

                <input
                  value={education.field}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  placeholder="Field of Study"
                  className="px-3 py-2 border rounded-lg"
                />

                <input
                  type="month"
                  value={education.graduation_date}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <input
                value={education.gpa}
                onChange={(e) =>
                  updateEducation(index, "gpa", e.target.value)
                }
                placeholder="GPA (optional)"
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
