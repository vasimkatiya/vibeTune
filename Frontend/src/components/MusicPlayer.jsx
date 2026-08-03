import { useContext, useRef, useState, useEffect } from "react";
import { playContext } from "../Context/PlaySongContext.jsx";
import { errorToast } from "../config/tostifyConfig";
import api from "../config/axiosConfig";
import '../CompStyle/player.css';

function MusicPlayer() {

  const audioRef = useRef(null);

  const [volume, setVolume] = useState(1);
  const [data, setdata] = useState({});
  const [loading, setLoading] = useState(false);

  const { current } = useContext(playContext);


  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);

    setVolume(value);

    if(audioRef.current){
      audioRef.current.volume = value;
    }
  };


  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const res = await api.get(`/songs/${current}`);
        setdata(res.data.song);

      } catch (error) {

        console.log(error);
        errorToast(error.response?.data?.message);

      }

    };


    if(current){
      fetchData();
    }

  }, [current]);


  return (
    <div className="player">

      <div className="ft">

        <div className="img">
          <img src={data.img} alt="" />
        </div>

        <p>{data.name}</p>

      </div>


      {
        data?.audio && (
          <audio
            ref={audioRef}
            src={data.audio}
            autoPlay
            controls

            onLoadStart={() => setLoading(true)}

            onCanPlay={() => setLoading(false)}

            onWaiting={() => setLoading(true)}
          />
        )
      }


      {
        loading && (
          <div className="loader">
            Loading...
          </div>
        )
      }


      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />

    </div>
  );
}

export default MusicPlayer;