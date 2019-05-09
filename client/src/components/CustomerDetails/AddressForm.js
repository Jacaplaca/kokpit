import React from "react";
// import FormButtons from "../../common/FormButtons";
import InputComponent from "../../common/inputs/InputComponent";
import KlienciSearch from "../KlienciSearch";

class AddressForm extends React.Component {
  editCustomer = (id, name, kod, miejscowosc) => {
    console.log("editCustomer", id, name, kod, miejscowosc);
    const idC = id ? (id === "" ? 0 : id) : 0;
    const nameC = name || "";
    const kodC = kod || "";
    const miejscowoscC = miejscowosc || "";
    this.props.change("customer", {
      id: idC,
      name: nameC,
      kod: kodC,
      miejscowosc: miejscowoscC
    });
  };

  render() {
    const {
      change,
      name,
      surname,
      address,
      phone,
      customer,
      clearCustomer,
      filledCustomers
    } = this.props;

    return (
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: `1fr 3fr 1fr 1fr`
          // padding: "1.3rem"
        }}
      >
        <div />
        <KlienciSearch
          flags={filledCustomers}
          //miejsceLabel={this.state.miejsceLabel.slice(0, 6)}
          miejsceLabel={""}
          klientLabel={""}
          clearLabel={clearCustomer}
          // miejsceLabel="lublin"
          edytuj={(id, name, kod, miejscowosc) =>
            change("customer", {
              id,
              name,
              kod,
              miejscowosc
            })
          }
          // edytuj={this.editCustomer}
          value={customer.id}
          //cancelLabel={() => this.setState({ miejsceLabel: "" })}
          label="Klient"
          placeholder="Zacznij wpisywać klienta"
        />
        {/* <InputComponent
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
        /> */}
        {/* <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Adres"
          type="text"
          edytuj={value => change("address", value)}
          // edytuj={value => change("name", value, "adding")}
          value={address || ""}
          // disabled={field2disabled}
        /> */}
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
        <div />
      </div>
    );
  }
}

export default AddressForm;
