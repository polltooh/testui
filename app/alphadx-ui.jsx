 'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Activity, FileText, Compass, ChevronRight, Stethoscope, ClipboardCheck, FolderOpen, ScanLine, FileEdit, Watch, Pill, Dumbbell, Users, AudioLines } from 'lucide-react';

export default function AlphaDXInterface() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('doctor');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef(null);
  const [voiceError, setVoiceError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? '';
      }
      setMessage(transcript.trim());
    };

    recognition.onerror = (event) => {
      setVoiceError(event?.error ? `Voice error: ${event.error}` : 'Voice error');
      setIsVoiceMode(false);
    };

    recognition.onend = () => {
      setIsVoiceMode(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoiceMode = () => {
    setVoiceError('');

    const recognition = recognitionRef.current;
    if (!recognition) {
      setVoiceError('Voice mode is not supported in this browser.');
      return;
    }

    if (isVoiceMode) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      setIsVoiceMode(false);
      return;
    }

    try {
      recognition.start();
      setIsVoiceMode(true);
    } catch {
      // start() can throw if called twice without stopping
      setVoiceError('Unable to start voice mode. Please try again.');
      setIsVoiceMode(false);
    }
  };

  const navItems = [
    { id: 'doctor', label: 'Doctor', icon: Activity },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'explore', label: 'Explore', icon: Compass }
  ];

  const contentSections = {
    doctor: [
      { 
        id: 'clinic-intake', 
        title: 'Clinic Intakes', 
        description: 'Patient registrations and interviews',
        icon: Stethoscope,
        color: 'from-cyan-500 to-blue-600'
      },
      { 
        id: 'assessments', 
        title: 'Assessments and Diagnoses', 
        description: 'Clinical evaluations and diagnostic workflows',
        icon: ClipboardCheck,
        color: 'from-indigo-500 to-purple-600'
      }
    ],
    records: [
      { 
        id: 'medical-records', 
        title: 'Medical Records', 
        description: 'Comprehensive patient histories and documentation',
        icon: FolderOpen,
        color: 'from-emerald-500 to-teal-600'
      },
      { 
        id: 'imaging', 
        title: 'Imaging Report Analyses', 
        description: 'AI-powered radiology and scan interpretations',
        icon: ScanLine,
        color: 'from-blue-500 to-cyan-600'
      },
      { 
        id: 'visiting-notes', 
        title: 'Visiting Notes Summaries', 
        description: 'Structured summaries of patient encounters',
        icon: FileEdit,
        color: 'from-violet-500 to-indigo-600'
      },
      { 
        id: 'wearable-data', 
        title: 'Wearable Data', 
        description: 'Real-time health metrics and trend analyses',
        icon: Watch,
        color: 'from-pink-500 to-rose-600'
      }
    ],
    explore: [
      { 
        id: 'treatment-referral', 
        title: 'Treatment Referrals', 
        description: 'Specialist recommendations and care coordinations',
        icon: Users,
        color: 'from-amber-500 to-orange-600'
      },
      { 
        id: 'medications', 
        title: 'Medications', 
        description: 'Drug information, interactions, and prescriptions',
        icon: Pill,
        color: 'from-red-500 to-pink-600'
      },
      { 
        id: 'wearable-devices', 
        title: 'Wearable Devices', 
        description: 'Device recommendations and integrations',
        icon: Watch,
        color: 'from-teal-500 to-emerald-600'
      },
      { 
        id: 'activity-recommendations', 
        title: 'Activity Recommendations', 
        description: 'Personalized wellness and exercise recommendations',
        icon: Dumbbell,
        color: 'from-lime-500 to-green-600'
      }
    ]
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Work+Sans:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Work Sans', sans-serif;
        }
        
        .brand-font {
          font-family: 'Libre Baskerville', serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          transform: translateX(8px);
        }
        
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1),
                      0 0 20px rgba(14, 165, 233, 0.15);
        }
        
        .bg-pattern {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%);
        }
        
        .medical-grid {
          background-image: 
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .diagnostic-line {
          position: relative;
        }
        
        .diagnostic-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(14, 165, 233, 0.5) 50%, 
            transparent 100%);
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`
        w-64
        bg-white
        transition-all duration-500 ease-in-out
        border-r border-slate-200
        flex flex-col
        relative
        overflow-hidden
      `}>
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 pb-6 fade-in-up">
            <h1 className="brand-font text-3xl font-bold text-slate-900 tracking-tight">
              Alpha<span className="text-cyan-600">DX</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-xl
                    nav-item slide-in
                    transition-all duration-300
                    ${isActive 
                        ? 'bg-slate-100/80 text-slate-900 shadow-sm shadow-slate-900/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-slate-700' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">GH</span>
              </div>
              <div>
                <p className="text-slate-900 text-sm font-medium">Account</p>
                <p className="text-slate-500 text-xs">Active Session</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white px-8 pb-8 pt-12">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8 fade-in-up">
              <h2 className="text-3xl font-semibold text-slate-900 mb-2">
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-slate-600">
                {activeTab === 'doctor' && 'Patient care and diagnostic workflows'}
                {activeTab === 'records' && 'Comprehensive medical documentation and analysis'}
                {activeTab === 'explore' && 'Treatment options and wellness recommendations'}
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentSections[activeTab].map((section, index) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-xl hover:border-slate-300/50 transition-all duration-300 text-left fade-in-up hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I am here to help..."
                className="
                  w-full px-6 py-4 pr-16
                  bg-white
                  border-2 border-slate-200
                  rounded-2xl
                  text-slate-900 placeholder-slate-400
                  focus:outline-none focus:border-cyan-400
                  input-glow
                  transition-all duration-300
                  text-base
                "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceMode}
                  className={`
                    w-12 h-12
                    bg-black hover:bg-zinc-900
                    rounded-full
                    flex items-center justify-center
                    transition-all duration-300
                    shadow-md shadow-black/15
                    hover:shadow-lg hover:shadow-black/20
                    hover:scale-105
                    ${isVoiceMode ? 'ring-2 ring-black/30' : ''}
                  `}
                  title={isVoiceMode ? 'Stop voice mode' : 'Start voice mode'}
                >
                  <AudioLines className={`w-8 h-8 text-white ${isVoiceMode ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
            {voiceError ? (
              <p className="mt-2 text-xs text-red-600">{voiceError}</p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
