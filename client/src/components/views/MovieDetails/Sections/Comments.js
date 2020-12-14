import React, { useState } from "react";
import { Button, Input, Typography } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
const { TextArea } = Input;
const { Title } = Typography;

function Comments(props) {
  const user = useSelector((state) => state.user);
  const [Comment, setComment] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert("Please Log in first");
    }

    const schema = {
      content: Comment,
      writer: user.userData._id,
      postId: props.postId,
    };

    axios.post("/api/comment/send", schema).then((response) => {
      if (response.data.success) {
        setComment("");
        props.refreshFunction(response.data.result);
      } else {
        alert("Failed to save Comment");
      }
    });
  };

  return (
    <div>
      <br />
      <Title level={3}>Share your thoughts about the movie!</Title>
      <hr />
      {props.CommentLists &&
        props.CommentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  CommentLists={props.CommentLists}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}
      {props.CommentLists && props.CommentLists === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          Be the first one to comment this movie!
        </div>
      )}
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={(e) => onSubmit(e)}
      >
        <TextArea
          style={{ width: "60%", borderRadius: "5px" }}
          onChange={(e) => setComment(e.currentTarget.value)}
          value={Comment}
          placeholder="Write you comment here"
        />
        <br />
        <Button
          style={{ width: "10%", height: "52px", marginTop: "-1.7rem" }}
          onClick={(e) => onSubmit(e)}
        >
          Comment
        </Button>
      </form>
    </div>
  );
}

export default Comments;
