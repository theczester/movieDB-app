import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";

function Favorite(props) {
  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const [Favorited, setFavorited] = useState(false);

  const schema = {
    userFrom: props.userFrom,
    movieId: props.movieId,
    movieTitle: props.movieInfo.original_title,
    moviePost: props.movieInfo.backdrop_path,
    movieRunTime: props.movieInfo.runtime,
    watched: false,
  };

  useEffect(() => {
    axios.post("/api/favorite/favoriteNumber", schema).then((res) => {
      if (res.data.success) {
        setFavoriteNumber(res.data.favoriteNumber);
      } else {
        alert("Failed to get favoriteNumber");
      }
    });

    axios.post("/api/favorite/favorited", schema).then((res) => {
      if (res.data.success) {
        setFavorited(res.data.favorited);
      } else {
        alert("Failed to get Favorite info");
      }
    });
  }, []);

  const handleAddToFavorite = () => {
    if (Favorited) {
      axios.post("/api/favorite/remove", schema).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(FavoriteNumber - 1);
          setFavorited(!Favorited);
        } else {
          alert("Failed to Remove From Favorite");
        }
      });
    } else {
      axios.post("/api/favorite/add", schema).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(FavoriteNumber + 1);
          setFavorited(!Favorited);
        } else {
          alert("Failed to Add To Favorite");
        }
      });
    }
  };

  return (
    <div>
      <Button onClick={handleAddToFavorite}>
        {Favorited ? "Remove from favorite" : "Add to favorite"}{" "}
        {FavoriteNumber}
      </Button>
    </div>
  );
}

export default Favorite;
