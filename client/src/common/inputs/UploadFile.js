import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    fontSize: 12,
    fontWeight: "600"
    // padding: 3
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 15
  }
});

const UploadFile = ({ onChange, classes, title, accept, name }) => (
  <React.Fragment>
    <input
      accept={accept}
      // className={classes.input}
      style={{ display: "none" }}
      id={`uploadbutton${name}`}
      multiple
      type="file"
      onChange={onChange}
    />
    <label htmlFor={`uploadbutton${name}`}>
      <Button
        // key={name}
        // id={`uploadbutton${name}`}
        // name={`uploadbutton${name}`}
        variant="contained"
        color="default"
        component="span"
        // style={{ display: "block", width: "100%" }}
        className={classes.button}
      >
        {title}
        <CloudUploadIcon className={classes.rightIcon} />
      </Button>
    </label>
  </React.Fragment>
);

UploadFile.defaultProps = { accept: "image/*" };

export default withStyles(styles, { withTheme: true })(UploadFile);
