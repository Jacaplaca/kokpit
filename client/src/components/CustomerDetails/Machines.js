import React from "react";
// import FormButtons from "../../common/FormButtons";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ButtonMy from "../../common/ButtonMy";
import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";

class MachinesForm extends React.Component {
  state = {
    // machines: [
    //   { type: "1", brand: "1", otherBrand: "1", howMany: 1 },
    //   { type: "2", brand: "2", otherBrand: "2", howMany: 2 },
    //   { type: "3", brand: "3", otherBrand: "3", howMany: 3 },
    //   { type: "4", brand: "4", otherBrand: "4", howMany: 4 },
    //   { type: "5", brand: "5", otherBrand: "5", howMany: 5 }
    // ],
    machines: [{ type: "", brand: "", otherBrand: "", howMany: 1 }],

    addAllowed: false
    // tractorType: "",
    // tractorBran
  };

  // handleChange = (field, value, i) => {
  //   const { machines: machinesState } = this.state;
  //   const machines = _.clone(machinesState);
  //   // const editedMachine = machines[i]
  //   machines[i][field] = value;
  //
  //   this.setState({ machines }, () => this.validate());
  // };

  // clearForm = () => {
  //
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.validate(nextProps);
    }
  }

  validate = nextProps => {
    const { machines } = this.state;
    const { showBrand, showType, value, group } = nextProps;
    let validates = [];
    // console.log("validate", group, value, validates);
    // let index
    for (let machine of value) {
      // index ++
      if (showBrand || showType) {
        if (
          machine.type !== "" &&
          (machine.brand !== "" || machine.otherBrand !== "") &&
          (machine.howMany && machine.howMany > 0)
        ) {
          validates.push(true);
        } else {
          validates.push(false);
        }
      } else {
        if (machine.howMany > 0 && machine.otherBrand !== "") {
          validates.push(true);
        } else {
          validates.push(false);
        }
      }
    }

    this.setState({ addAllowed: !validates.includes(false) });

    // if (
    //   machines[i].type !== "" &&
    //   (machines[i].brand !== "" || machines[i].otherBrand !== "") &&
    //   (machines[i].howMany && machines[i].howMany > 0)
    // ) {
    //   this.setState({ addAllowed: true });
    // } else {
    //   this.setState({ addAllowed: false });
    // }
  };

  isOtherBrandDisabled = i => {
    return this.props.value[i].brand !== "";
  };
  isBrandDisabled = i => {
    return this.props.value[i].otherBrand !== "";
  };

  render() {
    const {
      brands,
      addLabel,
      removeLabel,
      label,
      showBrand,
      showType,
      value,
      change,
      group,
      addMachine,
      removeMachine
    } = this.props;
    const {
      machines,
      type,
      brand,
      howMany,
      otherBrand,
      addAllowed
    } = this.state;
    // console.log("machine", typeof machine);
    return (
      <div
        style={{
          padding: 10,
          backgroundColor: "rgba(232, 232, 232, 0.4)"
        }}
      >
        <h6 style={{ fontWeight: 700 }}>{label.toUpperCase()}</h6>
        <div>
          {value.map((machine, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridGap: "1rem",
                  gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr`
                  // padding: "1.3rem"
                }}
              >
                {showBrand && (
                  <InputSelectBaza
                    daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                    wybrano={e => {
                      e && change(group, "brand", e.name, i);
                    }}
                    edytuj={value => change(group, "brand", value, i)}
                    czysc={() => change(group, "brand", "", i)}
                    value={value[i].brand}
                    // wybrano={e => {
                    //   e && this.handleChange("brand", e.name, i);
                    // }}
                    // edytuj={value => this.handleChange("brand", value, i)}
                    // czysc={() => this.handleChange("brand", "", i)}
                    // value={machines[i].brand}
                    label="Marka"
                    placeholder="Marka"
                    przeszukuje={brands}
                    disabled={this.isBrandDisabled(i)}
                  />
                )}
                {showType && (
                  <InputComponent
                    // key={i}
                    name="channel"
                    label="Typ"
                    type="text"
                    edytuj={value => change(group, "type", value, i)}
                    // edytuj={value => change("name", value, "adding")}
                    value={value[i].type || ""}
                    // disabled={field2disabled}
                  />
                )}

                <InputComponent
                  disabled={this.isOtherBrandDisabled(i)}
                  // key={i}
                  name="channel"
                  label={
                    !showBrand && !showType
                      ? "Maszyna"
                      : !showBrand
                      ? "Marka"
                      : "Inna marka"
                  }
                  type="text"
                  edytuj={value => change(group, "otherBrand", value, i)}
                  // edytuj={value => change("name", value, "adding")}
                  value={value[i].otherBrand || ""}
                  // disabled={field2disabled}
                />

                <InputComponent
                  // key={i}
                  name="channel"
                  label="Ilość"
                  type="text"
                  edytuj={value => change(group, "howMany", value, i)}
                  // edytuj={value => change("name", value, "adding")}
                  value={value[i].howMany || ""}
                  format="number"
                  suffix={"szt."}
                  decimals={0}
                  // disabled={field2disabled}
                />
                <AddButton
                  removeLabel={removeLabel}
                  addLabel={addLabel}
                  add={addMachine}
                  remove={removeMachine}
                  i={i}
                  addAllowed={addAllowed}
                  allElements={value}
                  group={group}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const AddButton = ({
  addLabel,
  add,
  remove,
  i,
  addAllowed,
  allElements,
  removeLabel,
  group
}) => {
  // console.log(group, allElements.length, addAllowed);
  if (
    (allElements.length === 1 && i === 0 && addAllowed) ||
    (allElements.length > 1 && i === allElements.length - 1 && addAllowed)
  ) {
    return (
      <ButtonMy
        color="primary"
        aria-label="Add"
        onClick={() => add(group)}
        // className={classes.fab}
      >
        {addLabel}
        <AddIcon />
      </ButtonMy>
    );
  } else if (
    (allElements.length > 1 && i < allElements.length - 1) ||
    (allElements.length > 1 && i === allElements.length - 1 && !addAllowed)
  ) {
    return (
      <ButtonMy
        color="primary"
        aria-label="Add"
        onClick={() => remove(group, i)}
        // className={classes.fab}
      >
        {removeLabel}
        <RemoveIcon />
      </ButtonMy>
    );
  } else {
    return <span />;
  }
};

export default MachinesForm;
