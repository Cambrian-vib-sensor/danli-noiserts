import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems } from "./listItems";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../actions/auth";
//import { history } from '../helpers/history';
/*import Chart from './Charts';
import Deposits from './Deposits';
import Orders from './Orders';*/
import SearchList from "./searchbox";
import Client from "./client";
import Sensor from "./sensor";
import Location from "./location";
import User from "./user";
import MapView from "./map";
import DashboardContent from "./dashboard-content/dashboardcontent";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://cambrian.com.sg/">
      danli pte Ltd
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#5775A0", //"#FF4500", //"#5775A0", //"#690204", //primary - light blue
    },
    secondary: {
      main: "#303A5D", //secondary - navy blue
    },
  },
});

function Dashboard(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isClient = props.userInfo?.role === "C"

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const signout = () => {
    const { dispatch /*, history*/ } = props;

    dispatch(logout());
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      ></Toolbar>
      <Divider />
      <List component="nav">
        <MainListItems userInfo={props.userInfo} />
        <Divider sx={{ my: 1 }} />
      </List>
    </div>
  );
  const container = window !== undefined ? () => document.body : undefined;

  if (isClient) {
    return <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
           theme.palette.grey[100],
        flexGrow: 1,
        p: 2,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl" sx={{ p: 2, flex: 1, }}><SearchList /></Container>
    </Box>
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
          style={{ background: "#b00d0d" }}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              sx={{
                height: "6vh",
                width: "6vw",
              }}
              alt="logo"
              src="logo.bmp"
            />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 1,
                fontFamily: "Georgia, serif",
                textShadow: "5px 5px 5px gray",
                paddingLeft: "5px",
              }}
            >
              danli pte Ltd
            </Typography>
            <Typography>{props.userInfo.username}</Typography>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={signout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            p: 2,
            width: { xs: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar />
          <Container  sx={{ p: 2, flex: 1 }}>
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/dashboard" element={<DashboardContent />} />
              <Route path="client" element={<Client />} />
              <Route path="location" element={<Location />} />
              <Route path="sensor" element={<Sensor />} />
              <Route path="register" element={<User />} />
              <Route path="/report" element={<SearchList />} />
              <Route path="map" element={<MapView />} />
            </Routes>
          </Container>
          <Copyright sx={{ pt: 4 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn, userInfo } = state.auth;
  //const { message } = state.message;
  return {
    isLoggedIn,
    userInfo,
    //message
  };
}

export default connect(mapStateToProps)(Dashboard);
