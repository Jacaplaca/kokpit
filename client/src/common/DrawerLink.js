import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
// import Link from "@material-ui/core/Link";
import classNames from "classnames";
import { lighten, darken } from "@material-ui/core/styles/colorManipulator";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import Settings from "@material-ui/icons/Settings";
import Person from "@material-ui/icons/Person";
import ListAlt from "@material-ui/icons/ListAlt";
import People from "@material-ui/icons/People";
import Inbox from "@material-ui/icons/Inbox";
import Assignment from "@material-ui/icons/Assignment";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Money from "@material-ui/icons/Money";
import Pageview from "@material-ui/icons/Pageview";
import Description from "@material-ui/icons/Description";
import ShowLinkToComp from "./ShowLinkToComp";
import { connect } from "react-redux";
import * as actions from "../actions";
const styles = theme => ({
  rootButton: {
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  iconWhite: { color: "white" },
  hover: {},
  labelButton: {
    borderColor: "gray",
    textAlign: "left"
  },
  listItemText: {
    fontSize: "0.9em"
    // padding: "0px 1px" //Insert your required size
  },
  listItemTextWhite: { fontSize: "0.9em", color: "white", fontWeight: 500 },
  itemText: {
    padding: "0px 1px"
  },
  itemClicked: {
    backgroundColor: theme.palette.grey["300"]
  },
  expanded: {
    // backgroundColor: "rgb(231, 231, 231, 0.35)",
    // backgroundColor: lighten(theme.palette.primary.main, 0.86),
    // boxShadow: "inset 1px 4px 9px -6px"
    // boxShadow: "0 5px 11px -6px gray",
    // webkitBoxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // mozBoxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // boxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    // borderBottomColor: lighten(theme.palette.primary.main, 0.7)
    // borderTopWidth: 1,
    // borderTopStyle: "solid",
    // borderTopColor: theme.palette.primary.main
  },
  expandedBottom: {
    backgroundColor: theme.palette.grey["300"]
    // backgroundColor: "rgb(231, 231, 231, 0.35)",
    // backgroundColor: lighten(theme.palette.primary.main, 0.86),
    // boxShadow: "inset 1px -2px 9px -6px"
    // boxShadow: "0 5px 11px -6px gray",
    // webkitBoxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // mozBoxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // boxShadow: "inset 0px 0px 14px 5px rgba(0,0,0,0.63)",
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    // borderBottomColor: theme.palette.primary.main,
    // borderTopWidth: 1,
    // borderTopStyle: "solid",
    // borderTopColor: theme.palette.primary.main
  },
  menu: {
    // backgroundColor: lighten(theme.palette.primary.main, 0.92),
    // backgroundColor: theme.palette.grey["700"],
    borderRadius: 0,
    backgroundColor: theme.palette.grey["300"],
    boxShadow: "8px 5px 14px -9px rgba(0,0,0,0.63)"
    // borderTop: `1px solid ${theme.palette.grey["500"]}`,
    // borderRight: `1px solid ${theme.palette.grey["500"]}`,
    // borderBottom: `1px solid ${theme.palette.grey["500"]}`,
    // borderLeft: `1px solid ${theme.palette.grey["500"]}`
    // color: "white"
  },
  menuNested: {
    // backgroundColor: lighten(theme.palette.primary.main, 0.92),
    // backgroundColor: theme.palette.grey["700"],
    borderRadius: 0,
    backgroundColor: theme.palette.grey["200"],
    boxShadow: "8px 5px 14px -9px rgba(0,0,0,0.63)"
    // color: "white"
  },
  item: {
    backgroundColor: theme.palette.grey["300"]
    // borderTop: `1px solid ${theme.palette.grey["500"]}`,
    // borderLeft: `1px solid ${theme.palette.grey["500"]}`,
    // borderBottom: `1px solid ${theme.palette.grey["500"]}`
  },
  itemNested: {
    backgroundColor: theme.palette.grey["200"]
  },
  menuDark: {
    // backgroundColor: lighten(theme.palette.primary.main, 0.92),
    backgroundColor: darken(theme.palette.primary.main, 0.3),
    boxShadow: "8px 5px 14px -9px rgba(0,0,0,0.63)",
    borderRadius: 0
    // color: "white"
  },
  collapseIcon: { color: "white" }
});
const components = {
  MoneyIcon: <MoneyIcon />,
  EventIcon: <EventIcon />,
  EventAvailableIcon: <EventAvailableIcon />,
  InsertChartOutlined: <InsertChartOutlined />,
  Settings: <Settings />,
  Person: <Person />,
  ListAlt: <ListAlt />,
  People: <People />,
  Assignment: <Assignment />,
  LocalOffer: <LocalOffer />,
  Money: <Money />,
  Description: <Description />,
  Pageview: <Pageview />,
  Inbox: <Inbox />
};

class DrawerLink extends React.Component {
  state = {
    open: false,
    anchorEl: null,
    active: false
  };

  // componentDidMount() {
  //   const { links } = this.props;
  //   // let isActive = []
  //   const isActive = links.filter(x => x === window.location.pathname);
  //   isActive.length > 0
  //     ? this.setState({ active: true })
  //     : this.setState({ active: false });
  //
  //   // console.log(
  //   //   "DrawerLink DidMount",
  //   //   this.props.links,
  //   //   window.location.pathname,
  //   //   isActive
  //   // );
  // }

  componentDidMount() {
    this.checkIfActive(window.location.path);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("receive props");
    // console.log(
    //   "drawerlink receive props,",
    //   nextProps.path,
    //   window.location.pathname
    // );
    this.checkIfActive(window.location.path);
    // if (nextProps.path !== window.location.path) {
    //   // this.setState({activeLink:})
    //   this.checkIfActive(window.location.path);
    // }
    if (!nextProps.openDrawer) {
      this.setState({ open: false });
    }
  }

  checkIfActive = path => {
    // console.log("active", path, window.location.pathname);
    const { links } = this.props;
    const isActive = links.filter(x => x === window.location.pathname);
    // console.log("active", links, isActive);
    isActive.length > 0
      ? this.setState({ active: true })
      : this.setState({ active: false });
  };

  handleClickMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
    this.props.clickDrawer();
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
    this.props.clickDrawer();
  };
  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
    // this.props.clickDrawer();
  };

  render() {
    const {
      classes,
      theme,
      link,
      text,
      icon,
      comps,
      comp,
      element,
      path,
      clickDrawer
    } = this.props;
    const { open, anchorEl, active } = this.state;
    const openMenu = Boolean(anchorEl);
    // console.log("drawerlink", text, active);
    const darkTheme = false;
    return comps ? (
      <div className={classNames(open && classes.expandedBottom)}>
        <div className={classNames(open && classes.expanded)}>
          <ListItem
            button
            onClick={this.handleClick}
            className={active ? classes.itemClicked : ""}
          >
            <ListItemIcon className={darkTheme ? classes.iconWhite : ""}>
              {ktoraIkona(icon)}
            </ListItemIcon>
            <ListItemText
              inset
              primary={text}
              classes={{
                primary: darkTheme
                  ? classes.listItemTextWhite
                  : classes.listItemText,
                root: classes.itemText
              }}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            // expandIcon={<LocalOffer />}
            in={open}
            timeout="auto"
            unmountOnExit
            // className={classNames(open && classes.expanded)}
          >
            {comps.map((x, i) => {
              if (x.link) {
                return (
                  // <Link key={i} to={x.link}>
                  //   {/* <List component="div" disablePadding> */}
                  //   <ListItem button className={classes.nested}>
                  //     {/* <ListItemIcon>{this.ktoraIkona(icon)}</ListItemIcon> */}
                  //     <ListItemText
                  //       inset
                  //       primary={x.text}
                  //       classes={{
                  //         primary: classes.listItemText,
                  //         root: classes.itemText
                  //       }}
                  //     />
                  //   </ListItem>
                  //   {/* </List> */}
                  // </Link>
                  <ItemLink
                    key={i}
                    click={clickDrawer}
                    element={x}
                    classes={classes}
                    nested
                    dark={darkTheme}
                    active={active}
                  />
                );
              } else if (x.menus) {
                return (
                  <Menus
                    key={i}
                    style={{
                      backgroundColor: lighten(theme.palette.primary.main, 0.92)
                    }}
                    openMenu={openMenu}
                    click={this.handleClickMenu}
                    anchorEl={anchorEl}
                    close={this.handleClose}
                    element={x}
                    classes={classes}
                    nested
                    dark={darkTheme}
                    active={active}
                  />
                );
              }
            })}
          </Collapse>
        </div>
      </div>
    ) : element.menus ? (
      <Menus
        openMenu={openMenu}
        click={this.handleClickMenu}
        anchorEl={anchorEl}
        close={this.handleClose}
        element={element}
        classes={classes}
        dark={darkTheme}
        active={active}
        // nested
      />
    ) : (
      // <ShowLinkToComp comp={comp}>
      //   <Link to={link}>
      //     <ListItem button>
      //       <ListItemIcon>{ktoraIkona(icon)}</ListItemIcon>
      //       <ListItemText
      //         classes={{
      //           primary: classes.listItemText,
      //           root: classes.itemText
      //         }}
      //         primary={text}
      //       />
      //     </ListItem>
      //   </Link>
      // </ShowLinkToComp>
      <ItemLink
        click={clickDrawer}
        element={element}
        classes={classes}
        dark={darkTheme}
        active={active}
        // path={path}
        // style={{ backgroundColor: "red" }}
      />
    );
  }
}
const ktoraIkona = icon => {
  return components[icon];
};
const Item = ({
  comp,
  classes,
  text,
  click,
  nested,
  icon,
  dark,
  anchor,
  active
}) => {
  // console.log("anchor nested active", anchor, nested, active);
  return (
    <ShowLinkToComp comp={comp}>
      <ListItem
        button
        onClick={click}
        className={
          anchor
            ? nested
              ? classes.itemNested
              : active
              ? classes.itemClicked
              : classes.item
            : active
            ? classes.itemClicked
            : ""
        }
        // className={
        //   anchor
        //     ? nested
        //       ? classes.itemNested
        //       : active
        //       ? classes.itemClicked
        //       : classes.item
        //     : null
        // }
        // className={active && classes.itemClicked}
      >
        {icon && (
          <ListItemIcon className={dark ? classes.iconWhite : ""}>
            {ktoraIkona(icon)}
          </ListItemIcon>
        )}
        <ListItemText
          inset={nested}
          classes={{
            primary: dark ? classes.listItemTextWhite : classes.listItemText,
            root: classes.itemText
          }}
          primary={text}
        />
      </ListItem>
    </ShowLinkToComp>
  );
};
const ItemLink = ({
  comp,
  classes,
  text,
  click,
  element,
  nested,
  dark,
  active
}) => (
  <ShowLinkToComp comp={element.comp}>
    {element.link[0] === "h" ? (
      <a target="_blank" href={element.link}>
        <ListItemMy
          click={click}
          classes={classes}
          nested={nested}
          element={element}
          dark={dark}
          active={active}
        />
      </a>
    ) : (
      <RouterLink
        // params={{ testvalue: "hello" }}
        to={{
          state: {
            name: "asdfasdf"
          },
          pathname: element.link
        }}

        // href={element.link}
      >
        <ListItemMy
          click={click}
          classes={classes}
          nested={nested}
          element={element}
          dark={dark}
          active={active}
        />
      </RouterLink>
    )}
  </ShowLinkToComp>
);
const ListItemMy = ({ click, classes, nested, element, dark, active }) => (
  <ListItem
    button
    onClick={click}
    // className={classes.main}
    className={active ? classes.itemClicked : ""}
  >
    {nested || (
      <ListItemIcon className={dark ? classes.iconWhite : ""}>
        {ktoraIkona(element.icon)}
      </ListItemIcon>
    )}
    <ListItemText
      inset={nested}
      classes={{
        primary: dark ? classes.listItemTextWhite : classes.listItemText,
        root: classes.itemText
      }}
      // primary={isActive(path)}
      primary={element.text}
    />
  </ListItem>
);

// const isActive = links => {
//   // const active = links.filter(x => x === window.location.pathname);
//   // isActive.length > 0
//   //   ? this.setState({ active: true })
//   //   : this.setState({ active: false });
//   return links.toString();
// };

const Menus = ({
  openMenu,
  click,
  anchorEl,
  close,
  element,
  classes,
  nested,
  dark,
  active
}) => (
  <div>
    {/* <Button
      aria-owns={openMenu ? "fade-menu" : undefined}
      aria-haspopup="true"
      onClick={click}
    >
      {element.text}
    </Button> */}
    <Item
      comp={element.comp}
      text={element.text}
      icon={element.icon}
      classes={classes}
      click={click}
      nested={nested}
      dark={dark}
      anchor={anchorEl}
      active={active}
    />
    <Menu
      PopoverClasses={{
        paper: dark
          ? classes.menuDark
          : nested
          ? classes.menuNested
          : classes.menu
      }}
      // square={false}
      elevation={0}
      id="fade-menu"
      anchorEl={anchorEl}
      open={openMenu}
      onClose={close}
      TransitionComponent={Grow}
      // id="menu-appbar"
      // anchorEl={anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "center", horizontal: "right" }}
      transformOrigin={{ vertical: "center", horizontal: "left" }}
    >
      {element.menus.map((x, i) => (
        <ItemLink
          key={i}
          click={close}
          element={x}
          classes={classes}
          dark={dark}
        />
      ))}
      {/* <MenuItem onClick={close}>Profile</MenuItem> */}
      {/* <MenuItem onClick={close}>My account</MenuItem> */}
      {/* <MenuItem onClick={close}>Logout</MenuItem> */}
    </Menu>
  </div>
);
DrawerLink.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
function mapStateToProps({ auth }) {
  return { auth };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(DrawerLink)
);
