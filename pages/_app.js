import '../styles/globals.css';
import { useEffect, useRef } from 'react';
import BottomSleigh from '../components/BottomSleigh';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/christmas-music.mp3');
    audioRef.current.loop = true;

    const handleMusicSetting = () => {
      const isMusicEnabled = JSON.parse(localStorage.getItem('musicEnabled') ?? 'false');
      const volume = JSON.parse(localStorage.getItem('musicVolume') ?? '50');
      audioRef.current.volume = volume / 100;

      if (isMusicEnabled) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    };

    const handleVolumeChange = (event) => {
      if (audioRef.current) {
        audioRef.current.volume = event.detail / 100;
      }
    };

    window.addEventListener('musicSettingChanged', handleMusicSetting);
    window.addEventListener('volumeChanged', handleVolumeChange);
    handleMusicSetting();

    return () => {
      window.removeEventListener('musicSettingChanged', handleMusicSetting);
      window.removeEventListener('volumeChanged', handleVolumeChange);
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <BottomSleigh />
    </>
  );
}

export default MyApp;