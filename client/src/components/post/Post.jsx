import "./post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
// import {Users} from "../../dummyData"
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import { Button, Menu, MenuItem } from "@mui/material";

export default function Post({ post, userId }) {
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const [updateMode, setUpdateMode] = useState(false);
  const [desc, setDesc] = useState(post.desc);
  const [file, setFile] = useState({ photo: post.img });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    post.likes ?? setIsLiked(post.likes.inclues(currentUser._id));
  }, [currentUser._id, post.likes]);

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
console.log('============= post',post)
console.log('============= user',user)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res?.data);
    };
    fetchUser();
  }, [post.userId]);

  const handleUpdatePost = async () => {
    const updatedPost = {
      userId: user._id,
      desc,
      img: post.img,
    };
    try {
      await axios.put(`/posts/${post._id}`, updatedPost);
      window.location.replace(`/profile/${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    handleClose();
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { userId: post.userId },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const updatePost = () => {
    setAnchorEl(null);
    setUpdateMode(!updateMode);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                className="postProfileImg"
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">
              {moment(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>
          {post.userId === user._id && (
            <div className="postTopRight">
              <MoreVert
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                variant="contained"
              />
              <Menu
                id="basic-menu"
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={updatePost}>Update Post</MenuItem>
                <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <form className="postCenter" onSubmit={handleUpdatePost}>
          {updateMode ? (
            <input
              type="text"
              // value={post?.desc}
              onChange={(e) => setDesc(e.target.value)}
              autoFocus={true}
              placeholder={post?.desc}
              className="updateText"
            />
          ) : (
            <span className="postText">{post?.desc}</span>
          )}
          {updateMode && (
            <Button
              variant="contained"
              type="submit"
              sx={{ height: "48px", marginLeft: "-2px" }}
            >
              Update
            </Button>
          )}
          <img className="postImg" src={post.img} alt="" />
        </form>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
