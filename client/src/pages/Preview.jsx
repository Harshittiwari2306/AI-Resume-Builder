import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5d0f5da7-496c-42aa-bac3-fd43d77817e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Preview.jsx:15',message:'loadResume called',data:{resumeId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const foundResume = dummyResumeData.find((resume) => resume._id === resumeId) || null;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5d0f5da7-496c-42aa-bac3-fd43d77817e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Preview.jsx:18',message:'Resume property check',data:{found:!!foundResume,hasAccent_color:!!foundResume?.accent_color,hasAccent_Color:!!foundResume?.accent_Color,accent_color:foundResume?.accent_color,accent_Color:foundResume?.accent_Color},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setResumeData(foundResume);

    setIsLoading(false);
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  // #region agent log
  const accentColorValue = resumeData?.accent_Color;
  const accent_colorValue = resumeData?.accent_color;
  fetch('http://127.0.0.1:7242/ingest/5d0f5da7-496c-42aa-bac3-fd43d77817e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Preview.jsx:32',message:'Before render - accent color values',data:{hasResumeData:!!resumeData,accent_Color:accentColorValue,accent_color:accent_colorValue,willPassToComponent:accentColorValue},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-2xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_Color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p
            className="text-center text-6xl text-slate-400
         font-medium"
          >
            Resume not found
          </p>
          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600
         text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1
         ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            go to home page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
