import { Route } from "react-router-dom";

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoneyIcon from "@material-ui/icons/AttachMoney";

import Costs from "./Costs";

export const mailFolderListItems = (
  <div>
    <ListItem button to="/login">
      <ListItemIcon>
        <MoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Koszty" />
    </ListItem>
    <li key="1b">
      <a href="/login">Login</a>
    </li>
    <Route path={`/dashboard`} component={Costs} />
  </div>
);

export const otherMailFolderListItems = <div />;
