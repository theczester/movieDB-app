import React, { useState, useEffect } from "react";
import "./profile.css";
import axios from "axios";
import { Button, Input } from "antd";
import { useHistory } from "react-router-dom";

function Profile() {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPsswordTooShort, setIspasswordTooShort] = useState(false);
  const fetchUserData = () => {
    axios
      .post("/api/users/profile", { _id: userId })
      .then((res) => {
        const userInfo = res.data.user[0];
        setUser(userInfo);
        setEmail(userInfo.email);
      })
      .catch((err) => console.log(`Error ${err}`));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDeleteAccount = () => {
    axios.post("/api/users/delete", { _id: userId }).then((res) => {
      if (res.data.success) {
        history.replace("/login");
        history.push("/");
      } else {
        alert("Failed to delete account");
      }
    });
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/update", { _id: userId, newEmail: email })
      .then((res) => {
        if (res.data.success) {
          fetchUserData();
        } else {
          alert("Failed to update the email");
        }
      });
    window.location.reload();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setIspasswordTooShort(true);
      return null;
    }
    axios
      .post("/api/users/update", { _id: userId, newPassword: password })
      .then((res) => {
        if (res.data.success) {
          fetchUserData();
        } else {
          alert("Failed to change the password");
        }
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <h1 id="profile-name">Hi, {user.name}</h1>
        <div className="profile-picture-section">
          <img
            width="100px"
            height="100px"
            src={user.image}
            alt="profile image"
          />
          <Button id="change-profile-pic">Change profile picture</Button>
        </div>
        <h1 id="profile-modify">Modify Your Profil!</h1>
        <h2 className="labels">Update Your email</h2>
        <form className="profile-form" onSubmit={(e) => handleEmailUpdate(e)}>
          {user.email && (
            <Input
              placeholder="New email"
              className="profile-input"
              type="email"
              defaultValue={user.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <button className="profile-submit" type="submit">
            Update
          </button>
        </form>
        <h2 className="labels">Change Your Password</h2>
        <form
          className="profile-form"
          onSubmit={(e) => handlePasswordChange(e)}
        >
          <Input
            className="profile-input"
            type="password"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {isPsswordTooShort && (
            <p style={{ color: "#e40f0f", marginTop: "-1rem" }}>
              Password must be at least 6 characters!
            </p>
          )}
          <button className="profile-submit" type="submit">
            Change
          </button>
        </form>
        <Button
          onClick={() => handleDeleteAccount()}
          size="large"
          id="delete-btn"
        >
          Delete account
        </Button>
      </div>

      <div className="profile-right"></div>
    </div>
  );
}

export default Profile;
