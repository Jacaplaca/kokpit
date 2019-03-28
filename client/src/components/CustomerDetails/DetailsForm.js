import React from "react";
// import FormButtons from "../../common/FormButtons";
// import _ from "lodash";
import Button from "@material-ui/core/Button";

import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import Machines from "./Machines";

const tractorBrands = [
  // { id: 0, name: "Inna" },
  { id: 1, name: "Case" },
  { id: 2, name: "Deutz-Fahr" },
  { id: 3, name: "New Holland" },
  { id: 4, name: "Fendt" },
  { id: 5, name: "Massey Ferguson" },
  { id: 6, name: "Fiat" },
  { id: 7, name: "Lamborghini" },
  { id: 8, name: "Landini" },
  { id: 9, name: "Renault" },
  { id: 10, name: "SAME" },
  { id: 11, name: "Zetor" },
  { id: 12, name: "John Deere" },
  { id: 13, name: "Kubota" },
  { id: 14, name: "McCormick" },
  { id: 15, name: "Ursus" },
  { id: 16, name: "Valtra" }
];

class DetailsForm extends React.Component {
  state = {
    tractors: [{}]
    // tractorType: "",
    // tractorBran
  };

  // this.handleChange = (field, value) => {
  //
  // }

  render() {
    const { change, name, surname, address, phone, tractorBrand } = this.props;

    return (
      <div
        style={{
          display: "grid",
          gridGap: "1rem"
          // gridTemplateColumns: `1fr 1fr 1fr`,
          // padding: "1.3rem"
        }}
      >
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: `1fr 1fr 1fr`
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
            label="Imię"
            type="text"
            edytuj={value => change("name", value)}
            // edytuj={value => change("name", value, "adding")}
            value={name || ""}
            // disabled={field2disabled}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridGap: "1rem"
            // gridTemplateColumns: `1fr`,
            // padding: "1.3rem"
          }}
        >
          <Machines
            brands={tractorBrands}
            addLabel={"Dodaj traktor"}
            removeLabel={"Usuń traktor"}
          />
        </div>
      </div>
    );
  }
}

export default DetailsForm;
