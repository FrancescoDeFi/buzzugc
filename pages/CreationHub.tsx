import React, { useState, useCallback, useEffect } from 'react';
import { AVATARS, LOADING_MESSAGES } from '../constants';
import type { Avatar } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import GeneratedVideo from '../components/GeneratedVideo';
import { generateUgcVideo } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

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

  // User creations from Supabase
  const [videoCreations, setVideoCreations] = useState<VideoCreation[]>([]);

  const formatRelativeTime = (iso: string): string => {
    const now = new Date();
    const then = new Date(iso);
    const diffMs = now.getTime() - then.getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (sec < 60) return 'just now';
    if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
    if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
    if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
    return then.toLocaleDateString();
  };

  const loadCreations = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setVideoCreations([]);
      return;
    }
    const { data, error } = await supabase
      .from('creations')
      .select('id, title, avatar_name, thumbnail_url, duration, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load creations', error);
      setVideoCreations([]);
      return;
    }
    const mapped: VideoCreation[] = (data ?? []).map((c: any) => ({
      id: String(c.id),
      thumbnail: c.thumbnail_url,
      title: c.title ?? 'Untitled',
      avatar: c.avatar_name ?? 'Unknown',
      createdAt: formatRelativeTime(c.created_at),
      duration: c.duration ?? undefined,
    }));
    setVideoCreations(mapped);
  }, []);

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

  useEffect(() => {
    loadCreations();
  }, [loadCreations]);

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
      // Save creation record for the current user
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (userId) {
          await supabase.from('creations').insert({
            user_id: userId,
            title: script.substring(0, 40) + (script.length > 40 ? '…' : ''),
            avatar_name: selectedAvatar.name,
            thumbnail_url: selectedAvatar.imageUrl,
            duration: null,
          });
          await loadCreations();
        }
      } catch (saveErr) {
        console.error('Failed to save creation', saveErr);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during video generation.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAvatar, script, loadCreations]);

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
            <span className="text-sm text-gray-600">{videoCreations.length} videos created</span>
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
          {videoCreations.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-lg">No creations yet.</p>
              <p>Start generating now — select an AI Actor and write a script.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAvatarPopup(true)}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  New Project
                </button>
              </div>
            </div>
          ) : (
            <>
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
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAvatarPopup(true)}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  New Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Bottom Input Section */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="w-[min(92vw,56rem)] bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl px-6 py-6">
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
                            {/* Badges removed per request (PRO/HD) */}
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
