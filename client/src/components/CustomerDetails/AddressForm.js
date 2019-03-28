import React from "react";
// import FormButtons from "../../common/FormButtons";
import InputComponent from "../../common/inputs/InputComponent";

class AddressForm extends React.Component {
  render() {
    const { change, name, surname, address, phone } = this.props;

    return (
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: `1fr 1fr 1fr 1fr`
          // padding: "1.3rem"
        }}
      >
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Imię"
          type="text"
          edytuj={value => change("name", value)}
          // edytuj={value => change("name", value, "adding")}
          value={name || ""}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Nazwisko"
          type="text"
          edytuj={value => change("surname", value)}
          // edytuj={value => change("name", value, "adding")}
          value={surname || ""}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Adres"
          type="text"
          edytuj={value => change("address", value)}
          // edytuj={value => change("name", value, "adding")}
          value={address || ""}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Nr tel."
          type="text"
          edytuj={value => change("phone", value)}
          // edytuj={value => change("name", value, "adding")}
          value={phone || ""}
          // disabled={field2disabled}
        />
      </div>
    );
  }
}

export default AddressForm;
