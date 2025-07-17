"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  }

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }

    setPlaying(!playing);
  }

  // Atualiza currentTime enquanto o vídeo está tocando
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);

    video.addEventListener("timeupdate", updateTime);
    return () => {
      video.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-[#222222] flex justify-center items-center">
      <div className="w-[20vw] h-[70vh] bg-[#888888]">
        <div className="flex justify-center m-1">
          <video
            ref={videoRef}
            className="w-[80%]"
            src="./assets/video01.mp4"
          />
        </div>

        <div className="flex justify-center gap-4 m-2">
          <button onClick={playPause}>
            {playing ? (
              <FaPause className="text-black cursor-pointer" />
            ) : (
              <FaPlay className="text-black cursor-pointer" />
            )}
          </button>

          <button onClick={() => configCurrentTime(currentTime - 10)}>
            <FaBackward />
          </button>

          <button onClick={() => configCurrentTime(currentTime + 10)}>
            <FaForward />
          </button>
        </div>

        <input
          className="w-full"
          type="range"
          min={0}
          max={videoRef.current?.duration ?? 0}
          step={0.01}
          value={currentTime}
          onChange={e => configCurrentTime(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
