import React from "react";
import { Col } from "antd";
function GridCard(props) {
  if (props.actor) {
    return (
      <Col lg={4} md={8} xs={24}>
        <div style={{ position: "relative", textAlign: "center" }}>
          <h2>{props.castInfo.name}</h2>
          <img
            style={{ width: "100%", height: "320px" }}
            alt
            src={props.image}
          />
          <h3>as {props.castInfo.character}</h3>
        </div>
      </Col>
    );
  } else {
    return (
      <Col lg={4} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/movie/${props.movieId}`}>
            <img
              style={{ width: "100%", height: "320px" }}
              alt
              src={props.image}
            />
          </a>
        </div>
      </Col>
    );
  }
}

export default GridCard;
