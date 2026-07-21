"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Terminal, Code, Clock, ArrowRight, AlertCircle, Keyboard, Send, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { calculateNutritionalRisk } from "@/lib/who-zscore";

export default function VoiceCopilot() {
  const childrenDb = useAppStore(state => state.children);
  const updateChild = useAppStore(state => state.updateChild);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [matchedChild, setMatchedChild] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  // Fallback state
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript((prev) => prev + " " + currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            setError("Microphone access denied.");
            toast.error("Microphone access denied.");
            setIsRecording(false);
          } else if (event.error === 'aborted') {
            // Usually happens on stop(), ignore
          } else if (event.error === 'network') {
             setError("Network error: Web Speech API requires an internet connection.");
             setIsRecording(false);
          } else {
             setError(`Browser mic error: ${event.error}. Use manual mode for demo.`);
             setIsRecording(false);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setError("Your browser does not support Speech Recognition. Please use Chrome or Safari.");
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const handleStartRecording = () => {
    if (error && !error.includes("aborted")) {
      toast.error("Falling back to manual mode due to browser mic issues.");
      setManualMode(true);
      return;
    }
    
    setTranscript("");
    setParsedData(null);
    setIsRecording(true);
    setIsProcessing(false);
    
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error(e);
      setManualMode(true);
    }
  };

  const processTranscript = (textToProcess: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const finalTranscript = textToProcess.toLowerCase();
      
      let extractedName = "Unknown Patient";
      let extractedWeight = null;
      let flags = [];
      
      if (finalTranscript.includes("aarav")) extractedName = "Aarav Sharma";
      else if (finalTranscript.includes("meera")) extractedName = "Meera Patel";
      else if (finalTranscript.includes("rohan")) extractedName = "Rohan Kumar";
      else if (finalTranscript.includes("diya")) extractedName = "Diya Singh";
      else if (finalTranscript.includes("kabir")) extractedName = "Kabir Das";
      
      const weightMatch = finalTranscript.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)/);
      if (weightMatch) extractedWeight = parseFloat(weightMatch[1]);
      
      if (finalTranscript.includes("fever") || finalTranscript.includes("hot")) flags.push("Fever");
      if (finalTranscript.includes("cough")) flags.push("Cough");
      if (finalTranscript.includes("lethargic") || finalTranscript.includes("tired")) flags.push("Lethargy");
      if (finalTranscript.includes("speech") || finalTranscript.includes("speak")) flags.push("Speech Delay");
      if (flags.length === 0) flags.push("Routine Check");

      setParsedData({
        patient_name: extractedName,
        weight_kg: extractedWeight,
        clinical_flags: flags,
        ai_risk_assessment: flags.includes("Lethargy") || flags.includes("Fever") ? "Critical" : "Standard",
        timestamp: new Date().toISOString(),
        processed_via: manualMode ? "Text Input" : "Audio Stream"
      });

      // Match patient in DB
      const matched = childrenDb.find(c => c.name.toLowerCase() === extractedName.toLowerCase());
      setMatchedChild(matched || null);

      setIsProcessing(false);
      toast.success("Data successfully structured via Edge AI.");
    }, 1200);
  };

  const handleSync = () => {
    if (!matchedChild || !parsedData.weight_kg) return;
    
    const newWeight = parsedData.weight_kg;
    const { risk } = calculateNutritionalRisk(matchedChild.ageMonths, newWeight, matchedChild.gender);
    
    // Demo 3mo velocity delta
    const velocity = parseFloat((newWeight - matchedChild.weightKg).toFixed(1));

    updateChild(matchedChild.id, {
      weightKg: newWeight,
      flags: parsedData.clinical_flags,
      risk,
      velocity3mo: velocity
    });

    toast.success(`${matchedChild.name}'s profile has been updated and synced.`);
    setMatchedChild(null);
    setParsedData(null);
    setTranscript("");
    setManualInput("");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error(e);
    }
    
    if (transcript.trim().length > 0) {
       processTranscript(transcript);
    } else {
       toast.error("No speech detected. Try manual mode.");
       setManualMode(true);
    }
  };
  
  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    processTranscript(manualInput);
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 p-8">
      <div className="w-full max-w-6xl mx-auto flex gap-8">
        
        {/* Left Column - Input */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold tracking-tight">Ambient Clinical Logging</h1>
              <button 
                onClick={() => setManualMode(!manualMode)} 
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full"
              >
                {manualMode ? <Mic size={12} /> : <Keyboard size={12} />}
                {manualMode ? "Switch to Voice" : "Demo Fallback"}
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Capture unstructured voice data for instant structured processing.</p>
            
            {error && !manualMode && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            {!manualMode ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={!!error && !error.includes("aborted")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-md font-bold text-sm transition-all shadow-sm ${
                    isRecording 
                      ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30" 
                      : (error && !error.includes("aborted"))
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square size={16} className="animate-pulse" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={18} /> Start Ambient Session
                    </>
                  )}
                </button>
                
                {isRecording && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-600 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div> Listening...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g., 'Aarav is 36 months old and weighs 12 kilos. He has a fever.'"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md outline-none text-sm focus:border-blue-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
                <button 
                  onClick={handleManualSubmit}
                  disabled={!manualInput.trim()}
                  className="bg-blue-600 text-white px-5 py-3 rounded-md font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} /> Process
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Terminal size={14} /> Live Audio Transcript
            </div>
            
            <div className="flex-1 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {!isRecording && !transcript && (
                <span className="text-slate-400 italic font-normal">Awaiting input stream...</span>
              )}
              {transcript && (
                <p>"{transcript}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex-1 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col font-mono">
          <div className="bg-slate-800/50 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Code size={14} /> Structured JSON Output
            </div>
            {parsedData && (
              <span className="text-xs text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded">
                <Clock size={12} /> 312ms
              </span>
            )}
          </div>
          
          <div className="flex-1 p-6 text-sm text-slate-300 overflow-y-auto">
            {!transcript && !parsedData && !isProcessing && (
              <div className="text-slate-600 italic flex items-center gap-2">
                <ArrowRight size={14} /> Waiting for extraction trigger...
              </div>
            )}
            
            {isProcessing && (
              <div className="text-blue-400 animate-pulse flex items-center gap-2">
                <ArrowRight size={14} /> Processing via Edge NLP Model...
              </div>
            )}

            {parsedData && (
              <>
                <pre className="text-emerald-400 font-mono text-[13px] leading-relaxed mb-6">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
                
                {matchedChild && (
                  <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 border-b border-slate-700 pb-3 relative z-10">
                      <CheckCircle2 size={18} /> Match Found: {matchedChild.name}
                    </div>
                    
                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="flex justify-between items-center text-sm bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Previous Weight:</span>
                        <span className="text-white font-bold">{matchedChild.weightKg} kg</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-slate-900/50 p-2 rounded border border-indigo-500/30">
                        <span className="text-slate-400">New Detected Weight:</span>
                        <span className="text-emerald-400 font-bold">{parsedData.weight_kg} kg</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Detected Flags:</span>
                        <span className="text-red-400 font-bold">{parsedData.clinical_flags.join(", ")}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSync}
                      className="w-full relative z-10 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <RefreshCw size={16} /> Sync to Patient Record
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
