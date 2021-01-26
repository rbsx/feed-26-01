import React from "react";
import "./styles.css";

const TweetCard = ({ image, text, username }) => {
  return (
    <div className="tweet-card">
      <img src={image} alt={username} />
      <div className="tweet-card__content">
        <div>{username}</div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default TweetCard;
