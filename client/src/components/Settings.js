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
import { getString } from "../translate";

class Settings extends Component {
  state = {
    logo: null,
    name: "",
    disableSubmit: false,
    size: 0,
    currency: ""
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
    this.setState({
      name: res.data.name,
      logo: res.data.logo,
      currency: res.data.currency
    });
  };

  handleSubmit = async () => {
    const { logo, name, currency } = this.state;
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
      { file: fileName, name, currency },
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
    const { logo, name, disableSubmit, size, currency } = this.state;
    const { auth, language } = this.props;
    return (
      <div style={{ maxWidth: 500 }}>
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="name"
          label={getString("SETTINGS_COMPANY_NAME_INPUT", language)}
          type="text"
          edytuj={value => this.handleChange("name", value)}
          // edytuj={value => change("name", value, "adding")}
          value={name || ""}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="currency"
          label={getString("CURRENCY", language)}
          type="text"
          edytuj={value => this.handleChange("currency", value)}
          // edytuj={value => change("name", value, "adding")}
          value={currency || ""}
          // disabled={field2disabled}
        />
        <UploadFile
          name="0"
          title={getString("SETTINGS_COMPANY_LOGO", language)}
          onChange={this.addLogo}
        />
        <Thumb key={1} file={logo} name="0" clear={this.clearLogo} />
        {disableSubmit && (
          <p>
            {getString("SETTINGS_FILE_1", language)} {Math.trunc(size)}
            {getString("SETTINGS_FILE_2", language)}
          </p>
        )}
        <ButtonMy
          disabled={auth.Company.accountType === "demo"}
          onClick={auth.Company.accountType === "demo" || this.handleSubmit}
        >
          {auth.Company.accountType === "demo"
            ? getString("SETTINGS_COMPANY_BUTTON_SAVE_DEMO", language)
            : getString("SETTINGS_COMPANY_BUTTON_SAVE", language)}
        </ButtonMy>
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

function mapStateToProps({ auth, language }) {
  return { auth, language };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(Settings);
