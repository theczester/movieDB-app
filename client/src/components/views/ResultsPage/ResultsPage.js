import React, { useEffect, useState, useRef } from "react";
import { Typography, Row, Select, Input } from "antd";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  IMAGE_SIZE,
  POSTER_SIZE,
} from "../../Config";
import MainImage from "../../commons/MainImage";
import GridCard from "../../commons/GridCard";
import { useHistory, useLocation } from "react-router-dom";
const { Title } = Typography;
const { Option } = Select;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function LandingPage(props) {
  let query = useQuery();
  const history = useHistory();
  const searchTerm = query.get("q");
  const buttonRef = useRef(null);

  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);
  const [sortBy, SetSortBy] = useState(
    query.get("sortBy") ? query.get("sortBy") : "popularity"
  );
  const [sortingMethod, SetSortingMethod] = useState(
    query.get("sortBy") ? query.get("sortingMethod") : "desc"
  );
  const [CurrentPage, setCurrentPage] = useState(0);
  const [minVoteCount, setMinVoteCount] = useState(
    query.get("minVoteCount") ? query.get("minVoteCount") : 500
  );

  let BASE_URL = props.search
    ? `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&vote_count.gte=100&query=${searchTerm}&page=`
    : `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&vote_count.gte=${minVoteCount}&sort_by=${sortBy}.${sortingMethod}&page=`;
  useEffect(() => {
    const endpoint = `${BASE_URL}1`;
    fetchMovies(endpoint);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((res) => {
        // console.log(result)
        // console.log('Movies',...Movies)
        // console.log('result',...result.results)
        setMovies([...Movies, ...res.results]);
        setMainMovieImage(MainMovieImage || res.results[0]);
        setCurrentPage(res.page);
      })
      .catch((err) => console.log(`Error ${err}`));
  };

  const loadMoreItems = () => {
    let endpoint = "";
    console.log("CurrentPage", CurrentPage);
    endpoint = `${BASE_URL}${CurrentPage + 1}`;
    fetchMovies(endpoint);
  };

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 1) {
      // loadMoreItems()
      console.log("clicked");
      buttonRef.current.click();
    }
  };
  const handleSortByChange = (value) => {
    SetSortBy(value);
    history.push(
      `/?sortBy=${value}&sortingMethod=${sortingMethod}&minVoteCount=${minVoteCount}`
    );
    window.location.reload();
  };

  const handleSortingMethodChange = (value) => {
    SetSortingMethod(value);
    history.push(
      `/?sortBy=${sortBy}&sortingMethod=${value}&minVoteCount=${minVoteCount}`
    );
    window.location.reload();
  };

  const handleMinVoteCountSubmit = (e) => {
    const value = e.target.value;
    setMinVoteCount(value);
    history.push(
      `/?sortBy=${sortBy}&sortingMethod=${sortingMethod}&minVoteCount=${value}`
    );
    window.location.reload();
  };
  return (
    <div style={{ width: "100%", margin: "0" }}>
      {MainMovieImage && (
        <MainImage
          image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
          title={MainMovieImage.original_title}
          text={MainMovieImage.overview}
        />
      )}

      <div style={{ width: "85%", margin: "1rem auto" }}>
        {Movies.length === 0 ? (
          <div>
            <h1>{`"${searchTerm}"`}</h1>
            <h1>There are no movies which match your search</h1>
            <h2 style={{ fontWeight: "lighter", color: "lightgray" }}>
              Try searching something else or go back to <a href="/">home</a>
            </h2>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                fontSize: "1.8rem",
                color: "black",
              }}
            >
              <span style={{ marginRight: "1rem" }}>
                {props.search
                  ? `Showing results for ${searchTerm}`
                  : "Sorted by "}
              </span>
              {!props.search && (
                <>
                  <Select
                    defaultValue={
                      query.get("sortBy") ? query.get("sortBy") : "popularity"
                    }
                    onChange={(value) => handleSortByChange(value)}
                    size="large"
                    style={{ width: 200, marginRight: "1rem" }}
                  >
                    <Option value="popularity">Popularity</Option>
                    <Option value="release_date">Release Date</Option>
                    <Option value="vote_average">Rating</Option>
                    <Option value="original_title">Title</Option>
                    <Option value="vote_count">Number of ratings</Option>
                  </Select>
                  <Select
                    onChange={(value) => handleSortingMethodChange(value)}
                    defaultValue={
                      query.get("sortBy") ? query.get("sortingMethod") : "desc"
                    }
                    size="large"
                    style={{ width: 200, marginRight: "1rem" }}
                  >
                    <Option value="asc">Ascending</Option>
                    <Option value="desc">Descending</Option>
                  </Select>
                  <span style={{ marginRight: "1rem", fontSize: "1.5rem" }}>
                    Min. number of ratings
                  </span>
                  <Input
                    size="large"
                    defaultValue={minVoteCount}
                    style={{ width: "5vw" }}
                    onChange={(e) => handleMinVoteCountSubmit(e)}
                  />
                </>
              )}
            </div>
            <hr />
          </div>
        )}
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.map((movie, index) => (
              <React.Fragment key={index}>
                {movie.poster_path && (
                  <GridCard
                    image={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                        : null
                    }
                    movieId={movie.id}
                    movieName={movie.original_title}
                  />
                )}
              </React.Fragment>
            ))}
        </Row>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Movies.length !== 0 && (
            <button
              ref={buttonRef}
              className="loadMore"
              onClick={loadMoreItems}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
