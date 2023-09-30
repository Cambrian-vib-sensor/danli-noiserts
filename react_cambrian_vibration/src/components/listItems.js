import * as React from 'react';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
//import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
//import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
//import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SensorsIcon from '@mui/icons-material/Sensors';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewListIcon from '@mui/icons-material/ViewList';
import PlaceIcon from '@mui/icons-material/Place';
import PreviewIcon from '@mui/icons-material/Preview';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Link } from "react-router-dom";

export function MainListItems({ userInfo }) {
  const [openManage, setOpenManage] = React.useState(true);
  const [openView, setOpenView] = React.useState(true);

  const handleClickManage = () => {
    setOpenManage(!openManage);
  };

  const handleClickView = () => {
    setOpenView(!openView);
  };

  let manageList;
  if (userInfo.role === 'A') {
    manageList = <>
      <ListItemButton onClick={handleClickManage}>
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText primary="Manage" />
        {openManage ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openManage} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to={"/register"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AppRegistrationIcon />
              </ListItemIcon>
              <ListItemText primary="User Registration" />
            </ListItemButton>
          </Link>
          <Link to={"/client"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItemButton>
          </Link>
          <Link to={"/location"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary="Locations" />
            </ListItemButton>
          </Link>
          <Link to={"/sensor"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <SensorsIcon />
              </ListItemIcon>
              <ListItemText primary="Sensors" />
            </ListItemButton>
          </Link>
          <Link to={"/report"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </>;
  } else {
    manageList = <>
      <Link to={"/report"} style={{
        textTransform: "unset",
        color: "inherit",
        textDecoration: "unset"
      }}>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
      </Link>
    </>;
  }

  return (
    <React.Fragment>
      <Link to={"/dashboard"} style={{
        textTransform: "unset",
        color: "inherit",
        textDecoration: "unset"
      }}>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>
      {manageList}
      <ListItemButton onClick={handleClickView}>
        <ListItemIcon>
          <PreviewIcon />
        </ListItemIcon>
        <ListItemText primary="View" />
        {openView ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openView} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to={"/"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary="Table" />
            </ListItemButton>
          </Link>
          <Link to={"/map"} style={{
            textTransform: "unset",
            color: "inherit",
            textDecoration: "unset"
          }}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </React.Fragment>);
};

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);