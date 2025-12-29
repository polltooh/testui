'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './auth-context';
import ProfileModal from '../components/auth/ProfileModal';
import GlobalStyles from '../components/chat/GlobalStyles';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import { DoctorsView, RecordsView, ExploreView } from '../components/chat/MainViews';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useChatSessions } from '../hooks/useChatSessions';
import { useChatMessages } from '../hooks/useChatMessages';

export default function AlphaDXInterface() {
  const { userEmail, userName, isAuthenticated, chatHistory, setChatHistory } = useAuth();
  const [message, setMessage] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoPageOpen, setIsInfoPageOpen] = useState(false);
  const [isDiagnosisMode, setIsDiagnosisMode] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'doctors', 'records', 'explore'
  const prevDiagnosisModeRef = useRef(false);

  // Custom hooks
  const { isVoiceMode, voiceError, toggleVoiceMode } = useVoiceRecognition();
  const { sessions, isLoadingSessions, fetchSessions } = useChatSessions(isAuthenticated);
  const {
    isTyping,
    sessionId,
    decisionChain,
    isFetchingChain,
    loadSessionMessages,
    handleSendMessage,
    handleNewChat: handleNewChatFromHook
  } = useChatMessages(chatHistory, setChatHistory, isAuthenticated, fetchSessions);

  // No-op refs (logic handled internally or by state)

  // Popover state handled by props and state in components

  // Auto-close sidebar on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setIsSidebarOpen(false);
    }
  }, [isAuthenticated]);

  // Save guest history
  useEffect(() => {
    if (!isAuthenticated && chatHistory.length > 0) {
      localStorage.setItem('alphadx_guest_history', JSON.stringify(chatHistory));
    }
    if (isAuthenticated) {
      localStorage.removeItem('alphadx_guest_history');
    }
  }, [chatHistory, isAuthenticated]);

  // Detect toggle from normal to self-diagnosis mode and trigger greeting
  useEffect(() => {
    // Only trigger if:
    // 1. Toggled from false to true (normal -> self-diagnosis)
    // 2. Not currently typing
    // Works for both new conversations (no sessionId) and existing conversations
    if (isDiagnosisMode && !prevDiagnosisModeRef.current && !isTyping) {
      // Send a special message to trigger the greeting
      // The backend will detect the workflow type change and send the greeting
      handleModeSwitchTrigger();
    }
    prevDiagnosisModeRef.current = isDiagnosisMode;
  }, [isDiagnosisMode, isTyping]);

  const handleSendMessageWrapper = async (e) => {
    if (e) e.preventDefault();
    await handleSendMessage(message, isDiagnosisMode, setMessage);
  };

  const handleModeSwitchTrigger = async () => {
    // Trigger greeting when switching to self-diagnosis mode
    await handleSendMessage("", isDiagnosisMode, setMessage);
  };

  const handleToggleVoice = () => {
    toggleVoiceMode((transcript) => {
      setMessage(transcript);
    });
  };

  const handleNewChat = () => {
    handleNewChatFromHook();
    // Reset diagnosis mode toggle to normal mode and switch to chat view
    setIsDiagnosisMode(false);
    prevDiagnosisModeRef.current = false;
    setActiveView('chat');
    if (isAuthenticated) {
      fetchSessions();
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'chat') {
      // When switching back to chat, optionally start a new chat
      // handleNewChat(); // Uncomment if you want to auto-start new chat
    }
  };

  const handleLoadSession = (sessionId) => {
    loadSessionMessages(sessionId);
    setActiveView('chat');
  };

  return (
    <div className="flex h-screen-safe bg-[#fcfcfd] font-sans overflow-hidden">
      <GlobalStyles />

      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        userName={userName}
        onProfileOpen={() => setIsProfileOpen(true)}
        isInfoPageOpen={isInfoPageOpen}
        onToggleInfo={() => setIsInfoPageOpen(!isInfoPageOpen)}
        sessions={sessions}
        isLoadingSessions={isLoadingSessions}
        currentSessionId={sessionId}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative bg-[#fcfcfd] min-w-0 overflow-hidden">
        <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isAuthenticated={isAuthenticated}
          isInfoPageOpen={isInfoPageOpen}
          onToggleInfo={() => setIsInfoPageOpen(!isInfoPageOpen)}
          chatHistoryLength={chatHistory.length}
          onNewChat={handleNewChat}
        />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content - Switch between different views */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeView === 'chat' ? (
            // Chat View
            chatHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-6 fade-in-up">
                <div className="w-full -translate-y-8 md:-translate-y-16">
                  <h2 className="brand-font text-2xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12 tracking-tight leading-tight px-4">
                    Let's make sure your health is taken care of
                  </h2>
                  <div className="w-full max-w-3xl px-4">
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      onSubmit={handleSendMessageWrapper}
                      isTyping={isTyping}
                      isVoiceMode={isVoiceMode}
                      voiceError={voiceError}
                      onToggleVoice={handleToggleVoice}
                      isDiagnosisMode={isDiagnosisMode}
                      onToggleDiagnosisMode={() => setIsDiagnosisMode(!isDiagnosisMode)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ChatMessages messages={chatHistory} isTyping={isTyping} decisionChain={decisionChain} />
                <div className="px-4 md:px-6 pb-safe md:pb-12 pt-4 border-t border-slate-50 bg-white/50 backdrop-blur-md z-30">
                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSendMessageWrapper}
                    isTyping={isTyping}
                    isVoiceMode={isVoiceMode}
                    voiceError={voiceError}
                    onToggleVoice={handleToggleVoice}
                    isDiagnosisMode={isDiagnosisMode}
                    onToggleDiagnosisMode={() => setIsDiagnosisMode(!isDiagnosisMode)}
                  />
                </div>
              </>
            )
          ) : activeView === 'doctors' ? (
            <div className="flex-1 overflow-y-auto"><DoctorsView /></div>
          ) : activeView === 'records' ? (
            <div className="flex-1 overflow-y-auto"><RecordsView /></div>
          ) : activeView === 'explore' ? (
            <div className="flex-1 overflow-y-auto"><ExploreView /></div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
