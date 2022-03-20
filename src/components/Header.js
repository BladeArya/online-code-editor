import React from "react";

import { Typography, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./Header.css";

function Header() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Code Compiler
            </Typography>
            <IconButton href="https://github.com/BladeArya/Online-Code-Compiler">
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Header;
