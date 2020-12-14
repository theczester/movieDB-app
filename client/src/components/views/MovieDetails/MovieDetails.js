import React, { useEffect, useState } from "react";
import { List, Avatar, Row, Col, Button, Descriptions } from "antd";
import axios from "axios";
import ReactPlayer from "react-player";

import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  IMAGE_SIZE,
  POSTER_SIZE,
} from "../../Config";
import GridCard from "../../commons/GridCard";
import MainImage from "../../commons/MainImage";
import Favorite from "./Sections/Favorite";

function MovieDetail(props) {
  const movieId = props.match.params.movieId;

  const [CommentLists, setCommentLists] = useState([]);
  const [Movie, setMovie] = useState([]);
  const [TRAILER_KEY, setTRAILER_KEY] = useState(false);
  const [CastToogle, setCastToogle] = useState(false);
  const [Casts, setCasts] = useState([]);
  const movieVariable = {
    movieId: movieId,
  };
  useEffect(() => {
    fetch(
      `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
    )
      .then((res) => res.json())
      .then((res) => {
        setMovie(res);
        setTRAILER_KEY(res.videos.results[0].key);

        fetch(`${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`)
          .then((res) => res.json())
          .then((res) => {
            setCasts(res.cast);
          });
      })
      .catch((err) => console.log(`Error ${err}`));

    axios.post("/api/comment/get", movieVariable).then((response) => {
      console.log(response);
      if (response.data.success) {
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get comments Info");
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  return (
    <div>
      {Movie.backdrop_path && (
        <MainImage
          image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}`}
          title={Movie.original_title}
          text={Movie.overview}
        />
      )}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Favorite
            userFrom={localStorage.getItem("userId")}
            movieId={movieId}
            movieInfo={Movie}
          />
        </div>

        <Descriptions title="Movie Info" bordered>
          <Descriptions.Item label="Title">
            {Movie.original_title}
          </Descriptions.Item>
          <Descriptions.Item label="Release date">
            {Movie.release_date}
          </Descriptions.Item>
          <Descriptions.Item label="Revenue">
            {Movie.revenue === 0 ? "Unknown" : Movie.revenue}
          </Descriptions.Item>
          <Descriptions.Item label="Length">
            {`${Math.floor(Movie.runtime / 60)}h ${Movie.runtime % 60}min`}
          </Descriptions.Item>
          <Descriptions.Item label="Rating" span={2}>
            {Movie.vote_average}
          </Descriptions.Item>
          <Descriptions.Item label="Number of ratings">
            {Movie.vote_count}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{Movie.status}</Descriptions.Item>
          <Descriptions.Item label="Popularity">
            {Movie.popularity}
          </Descriptions.Item>
        </Descriptions>
        {TRAILER_KEY && (
          <>
            <h1
              style={{
                textAlign: "center",
                fontSize: "4rem",
                margin: "4rem 0",
              }}
            >
              Trailer
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ReactPlayer
                style={{ marginBottom: "5rem" }}
                url={`https://www.youtube.com/watch?v=${TRAILER_KEY}`}
                width="1280px"
                controls={true}
                height="720px"
              />
            </div>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ margin: "3rem 0" }}
            onClick={() => setCastToogle(!CastToogle)}
          >
            {CastToogle ? "Hide Actors" : "Show Actors"}
          </Button>
        </div>
        {CastToogle && (
          <Row gutter={[16, 16]}>
            {Casts &&
              Casts.map((cast, index) => (
                <React.Fragment key={index}>
                  {cast.profile_path && (
                    <GridCard
                      actor
                      castInfo={cast}
                      image={`${IMAGE_BASE_URL}${POSTER_SIZE}${cast.profile_path}`}
                    />
                  )}
                </React.Fragment>
              ))}
          </Row>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LikeDislikes
            video
            videoId={movieId}
            userId={localStorage.getItem("userId")}
          />
        </div>
        <Comments
          movieTitle={Movie.original_title}
          CommentLists={CommentLists}
          postId={movieId}
          refreshFunction={updateComment}
        />
      </div>
    </div>
  );
}

export default MovieDetail;
