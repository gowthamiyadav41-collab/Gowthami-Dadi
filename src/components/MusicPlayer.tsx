import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO_STREAM_01',
    artist: 'SECTOR_7G',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'CORRUPTED_SECTOR',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'DATA_LEAK_DETECTED',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-black p-6 flex flex-col gap-5 border-2 border-magenta relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-magenta/20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-magenta/20" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        loop={false}
      />
      
      <div className="text-sm uppercase tracking-widest text-magenta border-b border-magenta/30 pb-2">
        &gt; ACTIVE_PROCESS: AUDIO_DECODER
      </div>
      
      <div className="aspect-square bg-black border border-cyan flex items-center justify-center overflow-hidden relative">
        {/* Animated bars */}
        <div className="absolute inset-0 flex items-end justify-center gap-2 p-4 opacity-50">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="w-4 bg-cyan"
              style={{
                height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
                transition: 'height 0.2s ease',
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)] pointer-events-none" />
        <div className="text-6xl text-magenta font-pixel opacity-20 z-10 glitch" data-text="ERR">ERR</div>
      </div>

      {/* Progress */}
      <div className="flex-1 w-full mt-2">
        <div className="flex justify-between text-sm text-cyan mb-2 font-terminal">
          <span>
            <span className="text-white font-bold">{currentTrack.title}</span> 
            <span className="text-magenta"> // {currentTrack.artist}</span>
          </span>
          <span>[{formatTime(audioRef.current?.currentTime || 0)} / {currentTrack.duration}]</span>
        </div>
        <div className="h-2 bg-black border border-cyan relative">
          <div 
            className="h-full bg-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={toggleMute}
          className="text-magenta hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={prevTrack}
            className="text-cyan hover:text-white transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-black border-2 border-cyan text-cyan flex items-center justify-center hover:bg-cyan hover:text-black transition-colors"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan hover:text-white transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-6" /> {/* Spacer */}
      </div>
    </div>
  );
}
