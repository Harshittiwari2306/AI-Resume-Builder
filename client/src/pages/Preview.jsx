import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/resumes/public/${resumeId}`
      );
      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) loadResume();
  }, [resumeId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-center text-6xl text-slate-400 font-medium">
          Resume not found
        </p>
        <Link
          to="/"
          className="mt-6 bg-green-500 hover:bg-green-600
          text-white rounded-full px-6 h-9 ring-offset-1 ring-1
          ring-green-400 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Go to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-2xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  );
};

export default Preview;
