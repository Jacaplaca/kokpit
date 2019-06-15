import React from "react";
import FormButtons from "../../common/FormButtons";
import { connect } from "react-redux";
import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import { YMtoDate, dateToYM } from "../../common/functions";
import { getString } from "../../translate";

class ChannelForm extends React.Component {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.nameField._focus();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    const { disableSubmit, submit } = this.props;
    // console.log("event", event.keyCode);
    switch (event.keyCode) {
      case 13:
        submit(event);
        this.nameField._focus();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      change,
      // value,
      handleAdd,
      action,
      addLabel,
      addFields,
      disableSubmit,
      // suffix,
      // adding,
      validate,
      values,
      submit,
      language
    } = this.props;

    return (
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          // gridTemplateColumns: `1fr 300px`,
          padding: "1.3rem"
        }}
      >
        <InputComponent
          // disabled={disabled}
          // key={i}
          autoFocus
          onRef={ref => (this.nameField = ref)}
          name="channel"
          label={getString("CHANNELS_FORM_INPUT_NAME", language)}
          type="text"
          edytuj={value => change("name", value, "adding")}
          value={values.name || ""}
          // disabled={field2disabled}
        />
        <FormButtons
          subDisable={disableSubmit}
          subLabel={
            addLabel
            //   modal && edit
            //     ? "Potwierdź edycję"
            //     : bonus > 0
            //     ? `Dodaj premię ${formatNumber(bonus)} zł`
            //     : "Potwierdź"
          }
          subAction={e => submit(e)}
          // cancelLabel={"Anuluj"}
          cancelAction={() => {
            console.log("clear");
          }}
        />
        {/* <ButtonMy
          onClick={action}
          variant="contained"
          color="primary"
          disabled={!validateEdit(adding, validate)}
        >
          <Add />
        </ButtonMy> */}
      </div>
    );
  }
}

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(ChannelForm);
