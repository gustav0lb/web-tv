"use client";

import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const videoList = [
  {
    src: "/assets/video01.mp4",
    title: "Como beber um copo de água",
    description: "Tutorial de como beber água.",
  },
  {
    src: "/assets/video02.mp4",
    title: "Como abrir uma porta",
    description: "Tutorial de como abrir uma porta.",
  },
  {
    src: "/assets/video03.mp4",
    title: "Como assobiar",
    description: "Tutorial de como assobiar.",
  },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videoList[0]);
  const [showVolume, setShowVolume] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const changeTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.duration, time));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !muted;
    video.muted = newMuted;
    setMuted(newMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);

    const handleEnded = () => {
      const currentIndex = videoList.findIndex(v => v.src === selectedVideo.src);
      const nextIndex = (currentIndex + 1) % videoList.length;
      setSelectedVideo(videoList[nextIndex]);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("ended", handleEnded);
    };
  }, [selectedVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play();
    setPlaying(true);
  }, [selectedVideo]);

  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout((window as any).controlsTimeout);
      (window as any).controlsTimeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    const videoWrapper = videoRef.current?.parentElement;
    if (videoWrapper) {
      videoWrapper.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (videoWrapper) {
        videoWrapper.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#111] text-white">
      <div className="flex flex-col lg:flex-row w-full h-screen">
        {/* Lista lateral */}
        <aside className="w-full lg:w-[20vw] bg-[#1e1e2e] p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Lista de Vídeos</h2>
          {videoList.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideo(video)}
              className={`block w-full text-left p-2 mb-2 rounded ${
                selectedVideo.src === video.src
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm text-gray-300">{video.description}</p>
            </button>
          ))}
        </aside>

        {/* Player principal */}
        <div className="flex-1 flex items-center justify-center bg-[#111] relative">
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              src={selectedVideo.src}
              controls={false}
            />

            {/* Controles */}
            {controlsVisible && (
              <div
                ref={controlsRef}
                className="absolute bottom-0 w-full px-6 pb-4 pt-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center gap-2"
              >
                {/* Barra de tempo */}
                <input
                  type="range"
                  min={0}
                  max={videoRef.current?.duration ?? 0}
                  step={0.01}
                  value={currentTime}
                  onChange={(e) => changeTime(Number(e.target.value))}
                  className="w-full mb-1"
                />

                {/* Tempo atual e duração */}
                <div className="w-full flex justify-between text-sm text-gray-300 px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(videoRef.current?.duration || 0)}</span>
                </div>

                {/* Linha de controles */}
                <div className="w-full flex items-center justify-between mt-1">
                  <div className="flex items-center gap-4">
                    <button onClick={() => changeTime(currentTime - 10)}>
                      <FaBackward size={24} />
                    </button>
                    <button onClick={togglePlayPause}>
                      {playing ? <FaPause size={24} /> : <FaPlay size={24} />}
                    </button>
                    <button onClick={() => changeTime(currentTime + 10)}>
                      <FaForward size={24} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="relative flex items-center"
                      onMouseEnter={() => setShowVolume(true)}
                      onMouseLeave={() => setShowVolume(false)}
                    >
                      <button onClick={toggleMute}>
                        {muted || volume === 0 ? (
                          <FaVolumeMute size={24} />
                        ) : (
                          <FaVolumeUp size={24} />
                        )}
                      </button>
                      {showVolume && (
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={muted ? 0 : volume}
                          onChange={(e) => changeVolume(Number(e.target.value))}
                          className="w-24 ml-2"
                        />
                      )}
                    </div>
                    <button onClick={toggleFullscreen}>
                      <FaExpand size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
