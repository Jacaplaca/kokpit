import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
// import InputBase from "@material-ui/core/InputBase";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { getSuggestions } from "../../common/functions";
import { getString } from "../../translate";

const styles = theme => ({
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    // width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 60,
      "&:focus": {
        width: 150
      }
    }
  }
});

class SearchField extends Component {
  state = {
    value: "",
    showOkSearch: false,
    dataUnfiltered: []
  };

  componentDidMount() {
    this.setState({ dataUnfiltered: this.props.data });
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  handleChange = e => {
    const value = e.target.value;
    const { search, data } = this.props;
    // console.log("handleChange search", value, search);
    this.setState({ value });
    if (value === "") {
      search(data);
    } else {
      search(getSuggestions(data, value, this.props.columns), value);
    }
    // if (e.target.value !== "") {
    //   this.setState({ showOkSearch: true });
    // }
  };

  render() {
    const { classes, language } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.grow} />
        <div className={classes.search}>
          <div
            className={classes.searchIcon}
            title={`${getString("SEARCH", language)}...`}
          >
            <SearchIcon />
          </div>
          <Input
            title={`${getString("SEARCH", language)}...`}
            // disableUnderline
            // type="search"
            placeholder={`${getString("SEARCH", language)}…`}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            value={value}
            // placeholder={score}
            onChange={this.handleChange}
            // onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    );
  }
}

SearchField.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ language }) => {
  return { language };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(SearchField)
);

// export default withStyles(styles)(SearchField);
