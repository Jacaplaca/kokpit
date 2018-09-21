import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";

const styles = {
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: "#B2DFDB"
  },
  barColorPrimary: {
    backgroundColor: "#00695C"
  }
};

function LinearIndeterminate(props) {
  const { classes, loading } = props;
  return (
    <div>
      {loading && <LinearProgress />}
      {/* <br />
      <LinearProgress color="secondary" />
      <br />
      <LinearProgress
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary
        }}
      /> */}
    </div>
  );
}

LinearIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ loading }) {
  return { loading };
}

//export default connect(mapStateToProps)(LinearIndeterminate);

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(LinearIndeterminate)
);

// export default withStyles(styles)(LinearIndeterminate);
