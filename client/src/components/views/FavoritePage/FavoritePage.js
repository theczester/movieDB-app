import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import "./favorite.css";
import axios from "axios";
import { Button, Checkbox, Popover } from "antd";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";

function FavoritePage() {
  const schema = { userFrom: localStorage.getItem("userId") };
  const [FavoritedMovies, setFavoritedMovies] = useState([]);

  const fetchFavoriteMovies = () => {
    axios.post("/api/favorite/movies", schema).then((res) => {
      if (res.data.success) {
        setFavoritedMovies(res.data.favorites);
      } else {
        alert("Failed to get favorite movies");
      }
    });
  };
  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const handleRemove = (movieId) => {
    const schema = {
      userFrom: localStorage.getItem("userId"),
      movieId,
    };

    axios.post("/api/favorite/remove", schema).then((res) => {
      if (res.data.success) {
        fetchFavoriteMovies();
      } else {
        alert("Failed to Remove From Favorite");
      }
    });
  };

  const handleWatchedChange = (movieId, movieWatched) => {
    const schema = {
      userFrom: localStorage.getItem("userId"),
      movieId,
      updateTo: !movieWatched,
    };
    axios.post("/api/favorite/watched", schema).then((res) => {
      if (res.data.success) {
        fetchFavoriteMovies();
      } else {
        alert("Failed to Update Favorite");
      }
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Favorite Movies By Me </Title>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Movie Title</th>
            <th>Movie RunTime</th>
            <td>Mark as watched</td>
            <td>Remove from favorites</td>
          </tr>
        </thead>
        <tbody>
          {FavoritedMovies.map((movie) => {
            return (
              <tr>
                <Popover
                  content={
                    <div>
                      {movie.moviePost ? (
                        <img
                          src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.moviePost}`}
                          alt="The image couldn't be loaded"
                        />
                      ) : (
                        "There is no image for that movie"
                      )}
                    </div>
                  }
                  title={movie.movieTitle}
                >
                  <td className="pointer">{movie.movieTitle}</td>
                </Popover>

                <td>{movie.movieRunTime}</td>
                <td>
                  <Checkbox
                    onChange={() =>
                      handleWatchedChange(movie.movieId, movie.watched)
                    }
                    checked={movie.watched}
                    type="checkbox"
                  />
                </td>
                <td>
                  <Button onClick={() => handleRemove(movie.movieId)}>
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FavoritePage;
