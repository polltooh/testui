export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Work+Sans:wght@300;400;500;600&display=swap');
      
      * { font-family: 'Work Sans', sans-serif; }
      .brand-font { font-family: 'Libre Baskerville', serif; }
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
      }

      .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      .fade-in { animation: fadeIn 0.4s ease-out forwards; }
      
      .chat-container::-webkit-scrollbar { width: 6px; }
      .chat-container::-webkit-scrollbar-track { background: transparent; }
      .chat-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      .chat-container::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

      .input-glow:focus {
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1), 0 0 20px rgba(14, 165, 233, 0.05);
      }

      .typing-dots span {
        animation: typing 1.4s infinite both;
        height: 4px;
        width: 4px;
        background-color: #94a3b8;
        display: inline-block;
        border-radius: 50%;
        margin: 0 1px;
      }

      .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
  );
}

