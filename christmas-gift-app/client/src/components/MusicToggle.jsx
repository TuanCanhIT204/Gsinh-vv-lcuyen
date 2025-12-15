import { useRef, useEffect } from 'react';

function MusicToggle() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .catch(() => {
        // nếu trình duyệt chặn autoplay thì thôi, nhưng nhiều máy vẫn phát được
      });
  }, []);

  return <audio ref={audioRef} loop src="/christmas-music.mp3" />;
}

export default MusicToggle;
