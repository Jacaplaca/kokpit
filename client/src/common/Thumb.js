import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Clear from "@material-ui/icons/Clear";

class Thumb extends Component {
  state = {
    loading: false,
    thumb: undefined
  };

  componentWillReceiveProps(nextProps) {
    // console.log("thumb will receive props", nextProps);
    if (!nextProps.file) {
      return;
    }
    if (nextProps.file !== this.props.file) {
      if (typeof nextProps.file.name == "string") {
        // console.log("thumb type", nextProps.file);
        this.setState({ loading: true }, () => {
          let reader = new FileReader();

          reader.onloadend = () => {
            this.setState({ loading: false, thumb: reader.result });
          };

          reader.readAsDataURL(nextProps.file);
        });
      } else {
        // console.log("file", require(`../${nextProps.file}`));
        this.setState({
          loading: false,
          thumb: require(`../${nextProps.file}`)
        });
      }
    }
  }

  render() {
    // console.log(`${this.props.name}, ${this.props.file}`);
    const { file, clear } = this.props;
    const { loading, thumb } = this.state;
    // console.log("thumb file", file);
    // console.log("thumb thumb", thumb);

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>Ładowanie obrazu...</p>;
    }

    return (
      <div>
        <img
          src={thumb}
          alt={file.name}
          className="img-thumbnail mt-2"
          height={200}
          width={200}
        />
        <IconButton
          onClick={clear}
          color="primary"
          aria-label="Add to shopping cart"
        >
          <Clear />
        </IconButton>
      </div>
    );
  }
}

export default Thumb;
