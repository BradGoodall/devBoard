import { useContext } from "react";
import { UserContext } from "../UserContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
// import Avatar from "@mui/material/Avatar";

function NavBar() {
  const authUser = useContext(UserContext);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            devBoard
          </Typography>
          {authUser && (
            <Box sx={{ flexGrow: 0 }}>
              {/* <Avatar alt="Remy Sharp" src={authUser.photoURL} /> */}
              <Typography>{authUser.displayName}</Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
