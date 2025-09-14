import React, { useState, useCallback, useEffect } from 'react';
import { AVATARS, LOADING_MESSAGES } from '../constants';
import type { Avatar } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import GeneratedVideo from '../components/GeneratedVideo';
import { generateUgcVideo } from '../services/geminiService';

interface VideoCreation {
  id: string;
  thumbnail: string;
  title: string;
  avatar: string;
  createdAt: string;
  duration?: string;
}

const CreationHub: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAvatarPopup, setShowAvatarPopup] = useState<boolean>(false);

  // Filter states for avatar selection
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedSituation, setSelectedSituation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sample video creations
  const [videoCreations] = useState<VideoCreation[]>([
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      title: 'Marketing Campaign',
      avatar: 'Nathan',
      createdAt: '2 hours ago',
      duration: '0:45'
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b332c58f?w=400&h=600&fit=crop',
      title: 'Product Demo',
      avatar: 'Sarah',
      createdAt: '1 day ago',
      duration: '1:23'
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
      title: 'Brand Story',
      avatar: 'Michael',
      createdAt: '3 days ago',
      duration: '0:58'
    },
    {
      id: '4',
      thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
      title: 'Tutorial Video',
      avatar: 'Emma',
      createdAt: '1 week ago',
      duration: '2:15'
    },
    {
      id: '5',
      thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      title: 'Customer Testimonial',
      avatar: 'James',
      createdAt: '1 week ago',
      duration: '1:45'
    },
    {
      id: '6',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
      title: 'Social Media Ad',
      avatar: 'Lisa',
      createdAt: '2 weeks ago',
      duration: '0:30'
    }
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectAvatar = useCallback((avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarPopup(false);
  }, []);

  const handleGenerateVideo = useCallback(async () => {
    if (!selectedAvatar || !script.trim()) {
      setError("Please select an avatar and write a script.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const videoUrl = await generateUgcVideo(selectedAvatar.imageUrl, script);
      setGeneratedVideoUrl(videoUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during video generation.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAvatar, script]);

  const handleReset = useCallback(() => {
    setSelectedAvatar(null);
    setScript('');
    setGeneratedVideoUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Filter avatars based on selected filters
  const filteredAvatars = AVATARS.filter(avatar => {
    if (selectedGender !== 'all' && avatar.gender !== selectedGender) return false;
    if (selectedAge !== 'all' && avatar.ageGroup !== selectedAge) return false;
    if (selectedSituation !== 'all' && avatar.situation !== selectedSituation) return false;
    if (searchTerm && !avatar.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <LoadingIndicator message={loadingMessage} />;
  }

  if (generatedVideoUrl) {
    return <GeneratedVideo videoUrl={generatedVideoUrl} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Your Creations</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">6 videos created</span>
            <button
              onClick={() => setShowAvatarPopup(true)}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Video Gallery */}
      <div className="pb-80">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {videoCreations.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-6 border-l-gray-800 border-y-4 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {video.duration}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-gray-900 truncate">{video.title}</p>
                  <p className="text-sm text-gray-600">{video.avatar} • {video.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Talking Actors Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => setShowAvatarPopup(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
            >
              <span className="text-gray-700 font-medium">🎭 Select AI Actor</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedAvatar && (
              <div className="mt-3 flex items-center space-x-2">
                <img
                  src={selectedAvatar.imageUrl}
                  alt={selectedAvatar.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700">
                  Selected: <span className="font-semibold">{selectedAvatar.name}</span>
                </span>
              </div>
            )}
          </div>

          {/* Script Input */}
          <div className="mb-4">
            <textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              placeholder="Write your script here... Tell your story, describe your product, or share your message."
              className="w-full h-24 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white shadow-sm"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{script.length} / 5000</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Ready to generate</span>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5.5 21h13L17 4m-7 4v10m4-10v10" />
                </svg>
                <span>Voice</span>
              </button>

              <button
                onClick={() => setShowAvatarPopup(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add actors</span>
              </button>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={!selectedAvatar || !script.trim()}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selection Popup */}
      {showAvatarPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your AI Actor</h2>
              <button
                onClick={() => setShowAvatarPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex">
              {/* Filters Sidebar */}
              <div className="w-80 bg-gray-50 p-6 border-r border-gray-100">
                {/* Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search actors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium">Most Popular</span>
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Gender</h3>
                  <div className="space-y-1">
                    {['all', 'male', 'female'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedGender === gender
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Filter */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Age Group</h3>
                  <div className="space-y-1">
                    {['all', 'Adult', 'Senior', 'Young Adult', 'Kid'].map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age === 'all' ? 'all' : age)}
                        className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedAge === age
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div className="space-y-3 text-sm mb-6">
                  <div className="font-bold text-gray-900">Features</div>
                  <div className="space-y-1">
                    <div className="text-gray-600 hover:text-black cursor-pointer">Newly Added</div>
                    <div className="text-gray-600 hover:text-black cursor-pointer flex items-center">
                      <span>Premium Quality</span>
                      <span className="ml-1">💎</span>
                    </div>
                    <div className="text-gray-600 hover:text-black cursor-pointer flex items-center">
                      <span>HD Quality</span>
                      <span className="ml-1">🎥</span>
                    </div>
                  </div>
                </div>

                {/* Situation Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Background</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['AI Avatar', 'Office', 'Studio', 'Beach', 'Coffee Shop', 'Formal', 'Gaming', 'Gym'].map((situation) => (
                      <button
                        key={situation}
                        onClick={() => setSelectedSituation(situation === 'AI Avatar' ? 'all' : situation)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          selectedSituation === situation || (situation === 'AI Avatar' && selectedSituation === 'all')
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {situation}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar Grid */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[65vh]">
                <div className="grid grid-cols-4 gap-6">
                  {filteredAvatars.map((avatar) => (
                    <div key={avatar.id} className="group cursor-pointer" onClick={() => handleSelectAvatar(avatar)}>
                      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <img
                          src={avatar.imageUrl}
                          alt={avatar.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg">
                            <div className="font-bold text-center">{avatar.name}</div>
                            <div className="flex items-center justify-center space-x-2 mt-1">
                              {avatar.isPro && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">PRO</span>}
                              {avatar.isHD && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">HD</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationHub;