import React, { useState } from "react";

import TweetCard from "./components/TweetCard";
import { useInterval } from "./hooks/useInterval";

const COUNT = 3;
const DELAY = 5000;
const API_BASE_URL = `https://bumble-twitter-interview.herokuapp.com/silvia-rebelo/api?count=${COUNT}`;

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [pausedTweets, setPausedTweets] = useState(false);
  const [loadMoreTweets, setLoadMoreTweets] = useState(false);

  window.addEventListener("scroll", async (event) => {
    const isTop = window.scrollY === 0 ? false : true;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setLoadMoreTweets(true);

      const newBatch = await fetchTweets();
      setTweets([...tweets, ...newBatch]);
    }

    setLoadMoreTweets(false);
    setPausedTweets(isTop);
  });

  const fetchTweets = async () => {
    if (pausedTweets && !loadMoreTweets) return;

    let fetchURL = API_BASE_URL;

    // Get timestamp from last tweet of last batch
    // to drive the next batch of tweets
    if (tweets.length > 0) {
      // If I'm at the bottom of the page
      const { timeStamp } = loadMoreTweets
        ? tweets[tweets.length - 1]
        : tweets[0];
      const direction = loadMoreTweets ? -1 : 1;

      fetchURL = `${API_BASE_URL}&time=${timeStamp}&direction=${direction}`;
      console.log(fetchURL);
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
