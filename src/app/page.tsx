"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // volume varia de 0 a 1
  const [muted, setMuted] = useState(false);

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

    video.muted = !muted;
    setMuted(!muted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", updateTime);
    return () => {
      video.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-[#222222] flex justify-center items-center">
      <div className="w-[20vw] h-[75vh] bg-[#888888] p-4 rounded-lg shadow-lg flex flex-col items-center">
        <video
          ref={videoRef}
          className="w-[100%] mb-4"
          src="./assets/video01.mp4"
        />

        {/* Play/Pause */}
        <div className="flex gap-4 mb-4">
          <button onClick={togglePlayPause}>
            {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          {/* -10s / +10s */}
          <button onClick={() => changeTime(currentTime - 10)}>
            <FaBackward size={20} />
          </button>
          <button onClick={() => changeTime(currentTime + 10)}>
            <FaForward size={20} />
          </button>
        </div>

        {/* Barra de tempo */}
        <input
          className="w-full mb-4"
          type="range"
          min={0}
          max={videoRef.current?.duration ?? 0}
          step={0.01}
          value={currentTime}
          onChange={e => changeTime(Number(e.target.value))}
        />

        {/* Volume + Mute */}
        <div className="w-full flex items-center gap-2">
          <button onClick={toggleMute}>
            {muted || volume === 0 ? (
              <FaVolumeMute size={18} />
            ) : (
              <FaVolumeUp size={18} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
