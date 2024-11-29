import "./App.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoIosPlay } from "react-icons/io";
function App() {
  const [surahs, setSurahs] = useState([]);
  const audioRef = useRef(null);
  const [currentAyahs, setCurrentAyahs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lodding, setLodding] = useState(true);

  async function show() {
    try{

      const res = await axios.get("http://api.alquran.cloud/v1/quran/ar.alafasy")
                 setSurahs(res.data.data.surahs);
         
    }catch(error) {
      console.error("There was an error fetching the data!");
    }
    setTimeout(() => {
      setLodding(false);
    }, 2000);
  }

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, [currentAyahs, currentIndex]);

  const handleAudioEnd = () => {
    if (currentIndex < currentAyahs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      audioRef.current.src = currentAyahs[currentIndex + 1].audio;
      audioRef.current.play();
    }
  };

  const playSurah = (ayahs) => {
    setCurrentAyahs(ayahs);
    setCurrentIndex(0);
    if (audioRef.current) {
      audioRef.current.src = ayahs[0].audio;
      audioRef.current.play();
    }
  };

  return (
    <div className="App">
      <h1>القران الكريم</h1>
      <ul className="data">
        {lodding ? (
          <div className="loader"></div>
        ) : (
          surahs.map((surah) => (
            <li key={surah.number} className="items">
              <h2>{surah.name}</h2>
              <h4>{surah.ayahs.juz}</h4>
              <button onClick={() => playSurah(surah.ayahs)} className="btn">
                تشغيل <IoIosPlay />
              </button>
            </li>
          ))
        )}
      </ul>
      <audio ref={audioRef} controls style={{ display: "none" }} />
    </div>
  );
}

export default App;
