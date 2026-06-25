/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Sliders, 
  Database, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  Award, 
  Flame, 
  Info, 
  Volume2, 
  VolumeX, 
  Sparkle,
  Bookmark,
  Calendar,
  MapPin,
  HelpCircle,
  Activity
} from 'lucide-react';
import { MatchData, MatchEvent } from './types';
import { PRESET_MATCHES } from './presets';
import GalaxyCanvas from './components/GalaxyCanvas';

export default function App() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(30); // 30 minutes of match = 1s real time
  const [crystallized, setCrystallized] = useState<boolean>(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Audio settings
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  
  // Feed of recently triggered event descriptions in the UI
  const [triggeredEventsLog, setTriggeredEventsLog] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Load Argentina vs France 2022 by default
  useEffect(() => {
    setMatchData(PRESET_MATCHES[0]);
  }, []);

  // Smooth playback timeline ticker
  useEffect(() => {
    if (!isPlaying || crystallized || !matchData) return;

    let lastTime = performance.now();
    let animationId: number;

    const tick = () => {
      const now = performance.now();
      const deltaMs = now - lastTime;
      lastTime = now;

      // playbackSpeed determines how many match-minutes pass per real-world second (1000ms)
      const minutesPassed = deltaMs * (playbackSpeed / 1000);

      setCurrentTime((prev) => {
        const lastEvent = matchData.timeline[matchData.timeline.length - 1];
        const maxMin = lastEvent ? lastEvent.minute : 90;
        const next = prev + minutesPassed;
        
        if (next >= maxMin) {
          setIsPlaying(false);
          setCrystallized(true);
          return maxMin;
        }
        return next;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, playbackSpeed, crystallized, matchData]);

  // Audio synthesizers for multi-sensory artistic feedback (sine/triangle waves via Web Audio API)
  const playCosmicSound = (type: string) => {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      if (type === 'GOAL') {
        // Majestic glowing synthesizer chord
        const frequencies = [130.81, 196.00, 261.63, 329.63, 392.00]; // C3, G3, C4, E4, G4
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          // Exponential frequency glide upwards (simulating supernova expand)
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 2.0);
          
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.5);
        });
      } 
      else if (type === 'YELLOW_CARD') {
        // Amber energy pulse - bright resonant chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.4); // A5 sweep
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } 
      else if (type === 'RED_CARD') {
        // Deep warning red rumble (gravity collapse)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120.00, now);
        osc.frequency.linearRampToValueAtTime(35.00, now + 1.5); // Deep dive
        
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
      } 
      else if (type === 'SUBSTITUTION') {
        // Energetic particle shift - sweeping clean arpeggio
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
          
          gain.gain.setValueAtTime(0.05, now + (idx * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (idx * 0.08));
          osc.stop(now + (idx * 0.08) + 0.3);
        });
      }
    } catch (e) {
      console.warn('Web Audio synthesis failed or blocked by autoplay policy.');
    }
  };

  // Callback from p5 canvas when an event is crossed
  const handleEventTriggered = (event: MatchEvent) => {
    playCosmicSound(event.type);

    let emoji = '🪐';
    if (event.type === 'GOAL') emoji = '✨ GOAL!';
    if (event.type === 'YELLOW_CARD') emoji = '🟨 YELLOW CARD';
    if (event.type === 'RED_CARD') emoji = '🟥 RED CARD';
    if (event.type === 'SUBSTITUTION') emoji = '🔄 SUB';
    if (event.type === 'HALF_TIME') emoji = '⏱️ HALFTIME';
    if (event.type === 'FULL_TIME') emoji = '🏆 FULLTIME';

    const timestamp = `${event.minute}'`;
    const message = `[${timestamp}] ${emoji} - ${event.player || ''} ${event.detail || ''}`;
    
    setTriggeredEventsLog((prev) => [...prev.slice(-30), message]);
    
    // Auto scroll logs
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  // Perform search call to backend
  const handleSearchMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setIsPlaying(false);
    setCrystallized(false);
    setCurrentTime(0);
    setTriggeredEventsLog([]);

    try {
      const res = await fetch('/api/match-galaxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error('Cosmic search failed to reach database');
      }

      const data = await res.json();
      setMatchData(data);
      setSearchQuery('');
    } catch (err: any) {
      setSearchError(err.message || 'Error connecting to the soccer star system.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePresetSelect = async (presetId: string) => {
    setIsPlaying(false);
    setCrystallized(false);
    setCurrentTime(0);
    setTriggeredEventsLog([]);
    setSearchError(null);

    const preset = PRESET_MATCHES.find(p => p.id === presetId);
    if (preset) {
      setMatchData(preset);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setCrystallized(false);
    setTriggeredEventsLog([]);
  };

  const maxDuration = matchData 
    ? matchData.timeline[matchData.timeline.length - 1].minute 
    : 90;

  return (
    <div className="min-h-screen bg-[#040406] text-zinc-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Top ambient starry glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main Header / Navigation */}
      <header className="relative z-10 border-b border-zinc-900 bg-black/40 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-600 p-[1px] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <div className="w-full h-full bg-[#08080C] rounded-[11px] flex items-center justify-center">
              <Sparkle className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
          <div>
            <h1 id="app-title" className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
              The 90-Minute Universe
            </h1>
            <p className="text-xs text-zinc-400">Match Event Generative Galaxy Render</p>
          </div>
        </div>

        {/* Real-time search form */}
        <form onSubmit={handleSearchMatch} className="flex items-center gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search ANY match (e.g. Argentina vs France 2022)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 text-sm rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 border border-zinc-700/50 hover:border-zinc-600/50 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              'Transmute'
            )}
          </button>
        </form>

        {/* Audio Toggler */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
            audioEnabled 
              ? 'bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400' 
              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-500'
          }`}
          title={audioEnabled ? 'Mute Celestial Synthesizer' : 'Enable Celestial Synthesizer'}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: The Generative p5.js Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="h-[520px] md:h-[620px] w-full relative">
            <GalaxyCanvas 
              matchData={matchData}
              currentTime={currentTime}
              isPlaying={isPlaying}
              speed={playbackSpeed}
              crystallized={crystallized}
              onEventTriggered={handleEventTriggered}
              onCrystallizedChange={setCrystallized}
            />
          </div>

          {/* PLAYBACK CONTROL CONSOLE */}
          <div className="bg-zinc-950/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4">
            
            {/* Timeline slider and timestamp info */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Match Timeline
                </span>
                <span className="text-sm font-semibold text-zinc-200 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                  {Math.floor(currentTime)}' <span className="text-[10px] text-zinc-500">/ {maxDuration}'</span>
                </span>
              </div>
              
              {/* Timeline range bar */}
              <div className="relative group">
                <input 
                  type="range" 
                  min="0" 
                  max={maxDuration} 
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => {
                    setCurrentTime(parseFloat(e.target.value));
                    if (crystallized) setCrystallized(false);
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-900 accent-cyan-500 outline-none transition-all group-hover:bg-zinc-800"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(currentTime / maxDuration) * 100}%, #18181b ${(currentTime / maxDuration) * 100}%, #18181b 100%)`
                  }}
                />
              </div>
            </div>

            {/* Main Action Control row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={() => {
                    if (crystallized) setCrystallized(false);
                    setIsPlaying(!isPlaying);
                  }}
                  disabled={!matchData}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer ${
                    isPlaying 
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40' 
                      : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-950/40'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                </button>

                {/* Rewind/Reset */}
                <button
                  onClick={handleRestart}
                  disabled={!matchData}
                  className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all text-zinc-400 hover:text-white cursor-pointer"
                  title="Rewind to Kickoff"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller Selectors */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Warp Speed:
                </span>
                <div className="flex items-center bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                  {[5, 15, 30, 60, 120].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`text-xs font-mono px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        playbackSpeed === s 
                          ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
                          : 'border border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Crystallization state trigger */}
              <button
                onClick={() => setCrystallized(!crystallized)}
                disabled={!matchData}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-2 ${
                  crystallized 
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/30' 
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${crystallized ? 'animate-pulse text-cyan-400' : 'text-zinc-500'}`} />
                {crystallized ? 'Crystallized Star-map' : 'Crystallize Galaxy'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Match Info, Poetry, Live Log, Presets (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* ACTIVE MATCH METADATA PANEL */}
          {matchData ? (
            <div className="bg-zinc-950/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4">
              
              {/* Competition header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-bold">
                    {matchData.competition}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{matchData.date}</span>
                    {matchData.stadium && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{matchData.stadium}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Display board */}
              <div className="grid grid-cols-7 items-center justify-center py-2 relative">
                
                {/* Home team */}
                <div className="col-span-3 flex flex-col items-center justify-center gap-1 text-center">
                  <span 
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md shadow-black/60"
                    style={{ backgroundColor: matchData.homeTeam.color }}
                  >
                    <span className="text-[10px] font-bold text-white font-mono uppercase">
                      {matchData.homeTeam.code || matchData.homeTeam.name.substring(0, 3)}
                    </span>
                  </span>
                  <p className="text-xs font-semibold text-zinc-200 mt-1 truncate w-full">{matchData.homeTeam.name}</p>
                </div>

                {/* Score vs */}
                <div className="col-span-1 flex flex-col items-center justify-center font-mono">
                  <div className="flex items-center gap-1.5 text-2xl font-black text-white">
                    <span>{matchData.score.home}</span>
                    <span className="text-zinc-600 text-lg">:</span>
                    <span>{matchData.score.away}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider">Score</span>
                </div>

                {/* Away team */}
                <div className="col-span-3 flex flex-col items-center justify-center gap-1 text-center">
                  <span 
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md shadow-black/60"
                    style={{ backgroundColor: matchData.awayTeam.color }}
                  >
                    <span className="text-[10px] font-bold text-white font-mono uppercase">
                      {matchData.awayTeam.code || matchData.awayTeam.name.substring(0, 3)}
                    </span>
                  </span>
                  <p className="text-xs font-semibold text-zinc-200 mt-1 truncate w-full">{matchData.awayTeam.name}</p>
                </div>
              </div>

              {/* Poetic AI Cosmos Summary */}
              {matchData.summary && (
                <div className="bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-xl text-xs text-zinc-400 italic leading-relaxed relative">
                  <Sparkles className="w-4 h-4 text-cyan-500/40 absolute -top-1.5 -right-1.5 bg-[#08080C] p-0.5 rounded-full" />
                  <p>{matchData.summary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 text-center text-sm text-zinc-500 py-10">
              No match selected. Seek out a football star system.
            </div>
          )}

          {/* EVENTS LIVE TRIGGERS FEED */}
          <div className="bg-zinc-950/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex-1 flex flex-col min-h-[220px]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Event Horizon Logs
            </h3>
            
            <div 
              ref={logContainerRef}
              className="flex-1 overflow-y-auto max-h-[180px] flex flex-col gap-2 pt-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 font-mono text-[10.5px] leading-normal"
            >
              {triggeredEventsLog.length === 0 ? (
                <p className="text-zinc-600 italic py-6 text-center">Press Play or slide timeline to trigger stellar transformations...</p>
              ) : (
                triggeredEventsLog.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded-lg border text-zinc-300 transition-all ${
                      log.includes('✨') 
                        ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-200' 
                        : log.includes('🟥') 
                          ? 'bg-rose-950/20 border-rose-500/20 text-rose-200'
                          : log.includes('🟨') 
                            ? 'bg-amber-950/20 border-amber-500/20 text-amber-200'
                            : 'bg-zinc-900/30 border-zinc-800/40'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HISTORICAL PRESETS & EXPLORER */}
          <div className="bg-zinc-950/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold border-b border-zinc-900 pb-2 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> Classic Presets
            </h3>
            
            <div className="flex flex-col gap-2">
              {PRESET_MATCHES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-3 text-left rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    matchData?.id === preset.id
                      ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200 shadow-md shadow-indigo-950/10'
                      : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700/50 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 truncate max-w-[85%]">
                    <span className="text-[11px] font-bold truncate">
                      {preset.homeTeam.name} {preset.score.home} - {preset.score.away} {preset.awayTeam.name}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      {preset.competition} ({preset.date.substring(0, 4)})
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              ))}
            </div>
          </div>

          {/* PHILOSOPHY BLOCK */}
          <div className="bg-zinc-950/40 p-4.5 rounded-xl border border-zinc-900 flex flex-col gap-2 text-xs leading-relaxed text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-wider text-zinc-500 uppercase">
              <HelpCircle className="w-4 h-4 text-zinc-500" /> Artistic Philosophy
            </div>
            <p>
              In <strong className="text-zinc-300">The 90-Minute Universe</strong>, competitive struggle is mapped to gravitational thermodynamics. 
              The central orbit represents the match baseline, with home and away team matter spiraling in conflicting directions.
            </p>
            <p className="text-[10px] text-zinc-500">
              When crystallization is triggered, rotational velocity slows to an absolute zero, and particles are locked into static diamond constellations — an immutable visual stamp of that specific match's geometric history.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-zinc-500 font-mono mt-auto relative z-10 bg-black/20">
        <p>© 2026 The 90-Minute Universe. Generated on a canvas of stars.</p>
        <p className="flex items-center gap-1.5 mt-2 md:mt-0">
          <Cpu className="w-3.5 h-3.5" /> Powered by Gemini API & p5.js
        </p>
      </footer>
    </div>
  );
}
