import React from "react";
import FormButtons from "../../common/FormButtons";

import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import { YMtoDate, dateToYM } from "../../common/functions";

class ChannelForm extends React.Component {
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
      submit
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
          name="channel"
          label="Nazwa kanału/systemu prowizyjnego"
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
          cancelLabel={"Anuluj"}
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

export default ChannelForm;