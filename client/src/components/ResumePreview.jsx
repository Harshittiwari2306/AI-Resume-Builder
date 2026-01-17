import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({data , template , accentColor , classes = ""}) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5d0f5da7-496c-42aa-bac3-fd43d77817e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResumePreview.jsx:7',message:'ResumePreview received props',data:{template,accentColor,hasAccentColor:!!accentColor,accentColorType:typeof accentColor},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const renderTemplate = () =>{
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5d0f5da7-496c-42aa-bac3-fd43d77817e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResumePreview.jsx:10',message:'renderTemplate called',data:{template,accentColor},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>;
        }
    }

  return (
    <div className='w-full bg-gray-100'>
      <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
        {renderTemplate()}
      </div>
      <style jsx>
        {`
        @page{
        size: letter;
        margin: 0;
        }
        @media print {
        html,body{
        width:8.5in;
        height: 11in;
        overflow: hidden;
        }
        body*{
        visibility: hidden;
        }
        #resume-preview, #resume-preview * {
        visibility: visible;
        }
        #resume-preview{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0
        box-shadow: none!important;
        borderr: none !important;
        }
        }
        `}
      </style>
    </div>
  )
}

export default ResumePreview
