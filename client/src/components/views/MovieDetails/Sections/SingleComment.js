import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";
const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const schema = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: CommentValue,
    };

    axios.post("/api/comment/send", schema).then((res) => {
      if (res.data.success) {
        setCommentValue("");
        setOpenReply(!OpenReply);
        props.refreshFunction(res.data.result);
      } else {
        alert("Failed to send Comment");
      }
    });
  };

  const actions = [
    <LikeDislikes
      comment
      commentId={props.comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={() => setOpenReply(!OpenReply)} key="comment-basic-reply-to">
      Reply to{" "}
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={
          <Avatar src={props.comment.writer.image} alt="profile picture" />
        }
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "4rem",
            width: "30%",
            marginTop: "-1rem",
          }}
          onSubmit={() => onSubmit()}
        >
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={(e) => setCommentValue(e.target.value)}
            value={CommentValue}
            placeholder="Write you reply here"
          />
          <br />
          <Button
            style={{ width: "20%", height: "52px", marginTop: "-1.7rem" }}
            onClick={(e) => onSubmit(e)}
          >
            Reply
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
