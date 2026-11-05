import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Image as ImageIcon, Sparkles, Loader2, User, Bot, AlertCircle, X } from 'lucide-react';
import { ChatMessage, LanguageCode } from '../types';
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { sendChatMessage } from '../services/api';

interface AgriChatProps {
  language: LanguageCode;
  initialQuestion?: string;
  initialImage?: string;
}

export const AgriChat: React.FC<AgriChatProps> = ({
  language,
  initialQuestion = '',
  initialImage,
}) => {
  const t = translations[language];
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿ ರಕ್ಷಕ್ AI ಕೃಷಿ ಸಹಾಯಕ. ನಿಮ್ಮ ಬೆಳೆ, ಎಲೆ, ರೋಗಗಳು, ಕೀಟನಾಶಕಗಳು ಅಥವಾ ಬೀಜಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका एग्रीरक्षक AI कृषि सहायक हूँ। अपनी फसल, रोग, कीटनाशक, मिट्टी या बीज के बारे में बेझिझक सवाल पूछें।'
          : 'Namaste! I am your AgriRakshak AI agricultural assistant. Ask me anything about crop diseases, leaf problems, safe pesticides, soil, or seed selection.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>(initialQuestion);
  const [attachedImage, setAttachedImage] = useState<string | null>(initialImage || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsAvailable, setTtsAvailable] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech Recognition and Speech Synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsAvailable(true);
    }

    // Set up Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = langMeta.speechCode;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, langMeta.speechCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please type your question.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = langMeta.speechCode;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Recognition start error:', e);
        setIsRecording(false);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langMeta.speechCode;
    utterance.rate = 0.95;

    // Pick appropriate voice if present
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(langMeta.code));
    if (match) utterance.voice = match;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputQuery).trim();
    if (!query && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query || 'Please analyze this uploaded plant photograph.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: attachedImage || undefined,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputQuery('');
    const sentImage = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(newHistory, language, sentImage || undefined);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          'I am having trouble connecting to the agricultural server. Please ensure you have a network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    language === 'kn'
      ? 'ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿರುವುದು ಏಕೆ?'
      : language === 'hi'
      ? 'टमाटर के पत्ते पीले क्यों पड़ रहे हैं?'
      : 'Why are my tomato leaves turning yellow?',
    language === 'kn'
      ? 'ಭತ್ತದ ಬೆಳೆಯ ಬೆಂಕಿ ರೋಗವನ್ನು ಹೇಗೆ ತಡೆಗಟ್ಟುವುದು?'
      : language === 'hi'
      ? 'धान में झुलसा रोग की रोकथाम कैसे करें?'
      : 'How can I prevent blast disease in paddy?',
    language === 'kn'
      ? 'ಹತ್ತಿ ಬೆಳೆಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿಕೊರಕ ನಿಯಂತ್ರಣ ಹೇಗೆ?'
      : language === 'hi'
      ? 'कपास में गुलाबी सुंडी का नियंत्रण कैसे करें?'
      : 'How to control pink bollworm in cotton?',
    language === 'kn'
      ? 'ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜಗಳ ಮೊಳಕೆ ಪರೀಕ್ಷೆ ಹೇಗೆ ಮಾಡುವುದು?'
      : language === 'hi'
      ? 'बुवाई से पहले बीज अंकुरण परीक्षण कैसे करें?'
      : 'How do I test seed germination at home?',
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[750px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-1.5">
              {t.askAgriAI}
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-emerald-100">
              Multilingual Indian Farmer Advisor ({langMeta.nativeLabel})
            </p>
          </div>
        </div>

        {ttsAvailable && (
          <button
            onClick={() => handleSpeak(messages[messages.length - 1]?.content || '')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-rose-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-emerald-100'
            }`}
            title="Read last response aloud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
          </button>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 overflow-x-auto flex gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider self-center shrink-0 pl-1">
          Quick Questions:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shadow-2xs shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
              }`}
            >
              {msg.image && (
                <div className="mb-2 rounded-2xl overflow-hidden border border-white/20 max-h-48 bg-black/10">
                  <img
                    src={msg.image}
                    alt="Attached crop"
                    className="w-full h-auto object-cover max-h-48"
                  />
                </div>
              )}

              <div className="whitespace-pre-line">{msg.content}</div>

              <div
                className={`mt-2 text-[10px] flex items-center justify-between ${
                  msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleSpeak(msg.content)}
                    className="hover:text-emerald-700 p-0.5 rounded transition-colors"
                    title="Listen to this message"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-3xl rounded-tl-xs flex items-center gap-2 text-xs text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              AgriRakshak AI is consulting agricultural recommendations...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Thumbnail if attached */}
      {attachedImage && (
        <div className="px-5 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300">
            <img src={attachedImage} alt="Crop thumbnail" className="w-full h-full object-cover" />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-slate-600 font-medium">
            Photo attached to your question
          </span>
        </div>
      )}

      {/* Input Toolbar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-2xl transition-colors"
            title="Attach a crop or leaf photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageAttach}
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-2xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Speak your question'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : `Type question in ${langMeta.nativeLabel} or English...`
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputQuery.trim() && !attachedImage) || isLoading}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 disabled:hover:bg-emerald-600 shadow-md shadow-emerald-900/20"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
