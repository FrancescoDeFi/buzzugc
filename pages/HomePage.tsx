import React, { useState } from 'react';

interface HomePageProps {
  onNavigateToLogin?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is AI UGC and how does it work?",
      answer: "AI UGC (User Generated Content) uses artificial intelligence to create videos with AI avatars. Simply write your script, choose an avatar, and our AI generates professional videos in minutes."
    },
    {
      question: "Who can benefit from using AI UGC?",
      answer: "Content creators, marketers, educators, businesses, and anyone who needs to create video content quickly and efficiently without appearing on camera themselves."
    },
    {
      question: "Will I find the right actors for my use case?",
      answer: "Yes! We offer a diverse selection of AI avatars with different demographics, styles, and presentations to match your brand and message perfectly."
    },
    {
      question: "Are the actors real or AI actors?",
      answer: "Our actors are AI-generated avatars that look and sound remarkably realistic, providing consistent quality and availability 24/7."
    },
    {
      question: "Do AI actors grant permissions for commercial use?",
      answer: "Yes, all AI avatars come with full commercial usage rights, so you can use the generated videos for any business purpose."
    },
    {
      question: "How long does it take to generate my videos?",
      answer: "Most videos are generated within 2-5 minutes, depending on the length and complexity of your script."
    },
    {
      question: "Does it work in different languages?",
      answer: "Yes! Our platform supports multiple languages, allowing you to create content for global audiences."
    },
    {
      question: "Can I control the way the actors move and their backgrounds?",
      answer: "Absolutely! You can customize gestures, expressions, backgrounds, and more to create the perfect video for your needs."
    }
  ];

  const features = [
    {
      icon: "🎬",
      title: "AI Actors",
      description: "Realistic AI avatars that bring your scripts to life"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate videos in minutes, not hours"
    },
    {
      icon: "🎯",
      title: "Full Control",
      description: "Customize every aspect of your video content"
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Say goodbye to expensive video production"
    },
    {
      icon: "🌍",
      title: "Multi-Language",
      description: "Create content in multiple languages"
    },
    {
      icon: "📊",
      title: "Scale Content",
      description: "Produce unlimited videos at scale"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="ml-2 text-xl font-semibold">buzzUGC</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-700 hover:text-black transition-colors">Features</a>
                <a href="/pricing" className="text-gray-700 hover:text-black transition-colors">Pricing</a>
                <a href="#showcase" className="text-gray-700 hover:text-black transition-colors">Examples</a>
                <a href="#faq" className="text-gray-700 hover:text-black transition-colors">FAQ</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateToLogin}
                className="text-gray-700 hover:text-black transition-colors"
              >
                Login
              </button>
              <button
                onClick={onNavigateToLogin}
                className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              Create AI videos for your 🎯
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The fastest way to<br />
            create <span className="text-blue-500">AI videos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Write your script → Pick an avatar → Generate video
          </p>
          <button
            onClick={onNavigateToLogin}
            className="bg-black text-white px-8 py-4 rounded-full text-lg hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            Create Your First Ad
          </button>
        </div>
      </section>

      {/* Video Showcase */}
      <section id="showcase" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'AI Avatar Demo 1', src: '/videos/advideo1.mp4' },
              { title: 'AI Avatar Demo 2', src: '/videos/advideo2.mp4' },
              { title: 'AI Avatar Demo 3', src: '/videos/advideo3.mp4' },
            ].map((v) => (
              <div key={v.title} className="relative rounded-2xl overflow-hidden group">
                <div className="aspect-[9/16] bg-black">
                  <video
                    src={v.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm">{v.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Column - Captivating Scripts */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Captivating scripts
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Editable and tailored to engage, our scripts are the foundation of impactful ads.
                </p>
              </div>

              {/* Script Editor Mockup */}
              <div className="bg-white rounded-2xl p-6 text-gray-900">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Write your Script</h3>
                  <p className="text-sm text-gray-600">Don't worry, you can always change later...</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] text-sm leading-relaxed">
                  <p className="mb-3">I am having a weird addiction, and you might have it too without even knowing. It's called ODA.</p>
                  <p className="mb-3">Every night after work, I find myself alone at home. And what do I do for 2-3 minutes, almost like a ritual? I swipe and scroll through dating apps, hoping for a connection, a spark, anything real.</p>
                  <p className="mb-3">But tonight, I'm breaking this cycle. Thanks to TimeLaff, I'm stepping out of the virtual world and into a real one.</p>
                  <p className="mb-3">TimeLaff organizes dinners every Wednesday, bringing together 8 strangers for an evening of genuine conversation and connection. No screens, no swipes, just real faces and stories.</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">2490 / 5000</div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">4 Actors selected</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg mt-4 font-medium hover:bg-blue-700 transition-colors">
                  GENERATE 3 VIDEOS WITH THIS SCRIPT
                </button>
              </div>
            </div>

            {/* Right Column - AI Actors and Bulk Creation */}
            <div className="space-y-16">

              {/* Engaging AI Actors */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Engaging AI Actors
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Choose from a library of 100s of attention grabbing AI Actors.
                </p>

                {/* Actor Selection Grid */}
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-gray-900 font-semibold mb-4">Select the actors you'd like to have for your ad</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { name: 'Aaron',   src: '/images/Aaron.jpeg' },
                      { name: 'Chloe',   src: '/images/Chloe.jpeg' },
                      { name: 'Ryan',    src: '/images/Ryan.jpeg' },
                      { name: 'Devin',   src: '/images/Devin.jpeg' },
                      { name: 'Elena',   src: '/images/Elena.jpeg' },
                      { name: 'Ethan',   src: '/images/Ethan.jpeg' },
                      { name: 'Grace',   src: '/images/Grace.jpeg' },
                      { name: 'Luca',    src: '/images/Luca.jpeg' },
                      { name: 'Max',     src: '/images/Max.jpeg' },
                      { name: 'Sofia',   src: '/images/Sofia.jpeg' },
                    ].map((actor) => (
                      <div key={actor.name} className="aspect-square rounded-lg overflow-hidden relative bg-gray-100">
                        <img src={actor.src} alt={actor.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-black/80 text-white text-xs px-1 py-0.5 rounded text-center font-medium">
                            {actor.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bulk Creation */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Bulk Creation
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Quickly Generate dozens of variations to experiment and succeed at scale.
                </p>

                {/* Bulk Creation Mockup */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg">
                      Duplicate
                    </button>
                    <div className="absolute -bottom-2 -right-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
                          <span className="text-white text-xs">👆</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Say goodbye to time-consuming<br />
              and costly video ad production
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Write Your Script</h3>
              <p className="text-gray-600">Create compelling copy that converts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose AI Actor</h3>
              <p className="text-gray-600">Select from diverse, realistic avatars</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Video</h3>
              <p className="text-gray-600">Get professional videos in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Take full control of the outcome
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Customize your videos with advanced features and maintain consistency across all your content.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-800 text-lg">
                <li>Instant UGC in 2 minutes</li>
                <li>Replace talent with 300+ licensed AI creators</li>
                <li>Add your AI avatar and show up everywhere, 24/7</li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-gray-400">Videos Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Happy Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-400">AI Avatars</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2min</div>
              <div className="text-gray-400">Avg. Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Have questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const open = expandedFaq === index;
              return (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0"
                    onClick={() => setExpandedFaq(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Smoothly collapsing/expanding content */}
                  <div className="px-6">
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to create your first AI video?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators using AI to scale their content
          </p>
          <button
            onClick={onNavigateToLogin}
            className="bg-white text-black px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Creating Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-black font-bold text-lg">B</span>
                </div>
                <span className="ml-2 text-xl font-semibold">buzzUGC</span>
              </div>
              <p className="text-gray-400 text-sm">The fastest way to create AI videos</p>
              <p className="text-gray-400 text-sm">Vienna, Austria</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 BuzzUGC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
