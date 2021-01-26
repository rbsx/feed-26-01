import React, { useState } from "react";

import TweetCard from "./components/TweetCard";
import { useInterval } from "./hooks/useInterval";

const COUNT = 3;
const DELAY = 2000;
const API_BASE_URL = `https://bumble-twitter-interview.herokuapp.com/silvia-rebelo/api?count=${COUNT}`;

const App = () => {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    let fetchURL = API_BASE_URL;

    // Get timestamp from last tweet of last batch
    // to drive the next batch of tweets
    if (tweets.length > 0) {
      const { timeStamp } = tweets[0];
      fetchURL = `${API_BASE_URL}&time=${timeStamp}&direction=1`;
    }

    return fetch(fetchURL)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.log(error));
  };

  useInterval(async () => {
    const newTweets = await fetchTweets();
    if (newTweets) {
      setTweets([...newTweets, ...tweets]);
    }
  }, DELAY);

  if (!tweets || tweets.length === 0) {
    return <div>Loading tweets...</div>;
  }

  return (
    <div className="app">
      {tweets &&
        tweets.map(({ id, ...tweet }) => <TweetCard key={id} {...tweet} />)}
    </div>
  );
};

export default App;
