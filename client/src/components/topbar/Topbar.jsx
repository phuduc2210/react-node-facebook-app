import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  ArrowDropDown,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, MenuItem } from "@mui/material";
export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to={`/`} style={{ textDecoration: "none" }}>
          <span className="logo">Facebook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to={`/`} style={{ textDecoration: "none", color: "white" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">3</span>
          </div>
        </div>
        <div className="profile">
          <img
            src={
              user?.profilePicture
                ? user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
          <ArrowDropDown
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
            <Link to={`/profile/${user.username}`} className="link">
              <MenuItem>My Page</MenuItem>
            </Link>
            <Link to="/settings" className="link">
              <MenuItem className="menuTopbar">Settings</MenuItem>
            </Link>
            <MenuItem className="menuTopbar" onClick={handleLogout}>
              Log out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
