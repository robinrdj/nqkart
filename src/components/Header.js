import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

const Header = ({ children, hasHiddenAuthButtons }) => {
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
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children ? children : ""}
      {hasHiddenAuthButtons ? (
        loggedIn ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="../../public/avatar.png" alt={userName} />
              <p style={{ marginLeft: "15px" }}>{userName}</p>
            </div>
            <Button
              onClick={() => {
                // localStorage.setItem("token",null);
                // localStorage.setItem("username",null);
                // localStorage.setItem("balance",null);
                localStorage.clear();
                history.push("/");
              }}
            >
              LOGOUT
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                history.push("/login");
              }}
            >
              LOGIN
            </Button>
            <Button
              onClick={() => {
                history.push("/register");
              }}
            >
              REGISTER
            </Button>
          </div>
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
