import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Avatar, Badge, Button, IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons, cartCount = 0 }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token != null && token.length > 0) {
      setLoggedIn(true);
      setUserName(localStorage.getItem("username"));
    }
  }, []);

  return (
    <Box className="header">
      <Box className="header-title" onClick={() => history.push("/")}>
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      <Box className="header-search">{children ? children : ""}</Box>

      {hasHiddenAuthButtons ? (
        loggedIn ? (
          <Box className="header-actions">
            <Tooltip title="View cart">
              <IconButton
                className="cart-icon-button"
                onClick={() => history.push("/cart")}
              >
                <Badge badgeContent={cartCount} color="primary" max={99}>
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box className="header-user">
              <Avatar src="avatar.png" alt={userName} className="header-avatar" />
              <p className="username-text">{userName}</p>
            </Box>

            <Button
              className="header-btn header-btn-outline"
              variant="outlined"
              onClick={() => {
                localStorage.clear();
                history.push("/");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box className="header-actions">
            <Tooltip title="View cart">
              <IconButton
                className="cart-icon-button"
                onClick={() => history.push("/cart")}
              >
                <Badge badgeContent={cartCount} color="primary" max={99}>
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Button
              className="header-btn header-btn-text"
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
            <Button
              className="header-btn header-btn-solid"
              variant="contained"
              disableElevation
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </Box>
        )
      ) : (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      )}
    </Box>
  );
};

export default Header;
