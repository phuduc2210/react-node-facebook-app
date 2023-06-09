import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
// import {Posts} from "../../dummyData"

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`/posts/profile/` + username)
        : // : await axios.get("/posts/timeline/" + user._id);
          await axios.get("/posts");
      setPosts(
        res?.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, user._id]);
  console.log('============= boolean', posts.map(p=> console.log('============= check',p.userId === user._id)) )
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} userId={p.userId} />
        ))}
      </div>
    </div>
  );
}
