import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import InputComponent from "../common/inputs/InputComponent";
import MainFrameHOC from "../common/MainFrameHOC";
import UploadFile from "../common/inputs/UploadFile";
import Thumb from "../common/Thumb";
import ButtonMy from "../common/ButtonMy";

class Settings extends Component {
  state = {
    logo: null,
    name: "",
    disableSubmit: false,
    size: 0
  };

  componentDidMount() {
    const {
      auth,
      auth: { id }
    } = this.props;
    // auth && this.setState({ logo: auth.Company.logo });
    this.fetchCompany();
  }

  fetchCompany = async () => {
    const res = await axios.get("/api/client/");
    this.setState({ name: res.data.name, logo: res.data.logo });
  };

  handleSubmit = async () => {
    const { logo, name } = this.state;
    let fileName;
    console.log("logo nam", logo, typeof logo);

    if (logo && typeof logo === "object") {
      const formData = new FormData();

      formData.append("file", logo);
      formData.append("filename", logo.name);

      const res = await axios.post("api/upload", formData, {
        onUploadProgress: ProgressEvent => {
          console.log((ProgressEvent.loaded / ProgressEvent.total) * 100);
        }
      });

      fileName = res.data.file;
    } else {
      fileName = logo;
    }

    // console.log("data", logo, logo.name, formData);
    // formData.append("lala", logo);
    // console.log("data", formData.values());
    // for (var value of formData.values()) {
    //   console.log(value);
    // }

    // const resp = await fetch("/api/upload", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "same-origin",
    //   body: JSON.stringify({
    //     a: "aaa"
    //   })
    // });

    // fetch(`api/upload`, {
    //   method: "POST",
    //   body: data
    // });

    // componentWillReceiveProps(nextProps){
    //
    // }

    // console.log("settings", res.data);
    const client = await axios.put(
      "api/client",
      { file: fileName, name },
      {
        onUploadProgress: ProgressEvent => {
          console.log((ProgressEvent.loaded / ProgressEvent.total) * 100);
        }
      }
    );
    console.log("settings", client.data);
    window.location.reload();
    // Object.assign({}, { logo: res.data.file });
  };

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  addLogo = event => {
    const logo = event.currentTarget.files[0];
    const size = logo.size;
    console.log("size", size);
    if (size > 512000) {
      this.setState({
        size: `${size / 1024}`,
        logo: null,
        disableSubmit: true
      });
    } else {
      this.setState({ logo });
    }
  };

  clearLogo = () => {
    this.setState({ logo: null });
  };

  render() {
    const { logo, name, disableSubmit, size } = this.state;
    return (
      <div style={{ maxWidth: 500 }}>
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="name"
          label="Nazwa firmy"
          type="text"
          edytuj={value => this.handleChange("name", value)}
          // edytuj={value => change("name", value, "adding")}
          value={name || ""}
          // disabled={field2disabled}
        />
        <UploadFile
          name="0"
          title="Załącz logo firmy"
          onChange={this.addLogo}
        />
        <Thumb key={1} file={logo} name="0" clear={this.clearLogo} />
        {disableSubmit && (
          <p>
            Plik zajmuje {Math.trunc(size)}KB i jest {Math.trunc(size / 500)}{" "}
            razy większy niż dopuszczalne 500KB. Zmniejsz rozdzielczość zdjęcia,
            zastosuj silniejszą kompresję lub wybierz inny plik.
          </p>
        )}
        <ButtonMy onClick={this.handleSubmit}>Zapisz zmiany</ButtonMy>
      </div>
    );
  }
}

const styles = theme => ({
  companyBox: {
    backgroundColor: "white",
    // backgroundColor: lighten(theme.palette.primary.light, 0.8),
    boxShadow: "0 5px 11px -6px gray",
    marginBottom: 6
  }
});

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(Settings);
