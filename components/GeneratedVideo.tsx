import React from 'react';

interface GeneratedVideoProps {
  videoUrl: string;
  onReset: () => void;
}

const GeneratedVideo: React.FC<GeneratedVideoProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Video is Ready!</h3>
          <p className="text-gray-600">Your AI-generated video has been created successfully.</p>
        </div>

        {/* Video Player */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full max-w-md mx-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoUrl}
            download="buzzugc_video.mp4"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Video
          </a>

          <button
            onClick={onReset}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Another Video
          </button>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Share on Social Media
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              View Analytics
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Save to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedVideo;