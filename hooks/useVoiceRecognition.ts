import { useEffect, useRef, useState } from 'react';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceRecognition() {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? '';
      }
      // Return transcript via callback
      if (recognitionRef.current?.onTranscript) {
        recognitionRef.current.onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
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

  const toggleVoiceMode = (onTranscript?: (transcript: string) => void) => {
    setVoiceError('');
    const recognition = recognitionRef.current;
    if (!recognition) {
      setVoiceError('Voice mode is not supported in this browser.');
      return;
    }
    
    if (onTranscript) {
      recognitionRef.current.onTranscript = onTranscript;
    }
    
    if (isVoiceMode) {
      try { recognition.stop(); } catch { }
      setIsVoiceMode(false);
      return;
    }
    try {
      recognition.start();
      setIsVoiceMode(true);
    } catch {
      setVoiceError('Unable to start voice mode. Please try again.');
      setIsVoiceMode(false);
    }
  };

  return { isVoiceMode, voiceError, toggleVoiceMode };
}

