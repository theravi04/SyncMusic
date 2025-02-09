import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://syncmusic-z92n.onrender.com/");

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useState(
    "https://samplelib.com/lib/preview/mp3/sample-15s.mp3"
  );

  useEffect(() => {
    socket.on("sync-music", ({ url, time, playing }) => {
      if (audioRef.current) {
        // Update the song URL via state to force re-render
        setSongUrl(url);

        // Wait until the audio source updates, then sync time and play state
        audioRef.current.currentTime = time;

        if (playing) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }

        setIsPlaying(playing);
      }
    });

    return () => socket.off("sync-music");
  }, []);

  const playMusic = () => {
    if (audioRef.current) {
      socket.emit("play-music", {
        url: songUrl,
        time: audioRef.current.currentTime,
        playing: true,
      });
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      socket.emit("pause-music", {
        url: songUrl,
        time: audioRef.current.currentTime,
        playing: false,
      });
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-4">
      <audio ref={audioRef} src={songUrl} controls />
      <button onClick={playMusic}>Play Music</button>
      <button onClick={pauseMusic}>Pause Music</button>
    </div>
  );
}
