import React from "react";
// import FormButtons from "../../common/FormButtons";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ButtonMy from "../../common/ButtonMy";
import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import { shallowEqual } from "../../common/functions";

class MachinesForm extends React.Component {
  state = {
    // machines: [
    //   { type: "1", brand: "1", otherBrand: "1", howMany: 1 },
    //   { type: "2", brand: "2", otherBrand: "2", howMany: 2 },
    //   { type: "3", brand: "3", otherBrand: "3", howMany: 3 },
    //   { type: "4", brand: "4", otherBrand: "4", howMany: 4 },
    //   { type: "5", brand: "5", otherBrand: "5", howMany: 5 }
    // ],
    // machines: [{ type: "", brand: "", otherBrand: "", howMany: 1 }],

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

  componentDidMount() {
    console.log("machine did mount");
    this.validate(this.props);
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    !shallowEqual(nextProps.values, this.props.values) ||
    this.state.addAllowed !== nextState.addAllowed;

  componentWillReceiveProps(nextProps) {
    if (nextProps.values !== this.props.values) {
      this.validate(nextProps);
    }
  }

  validate = nextProps => {
    console.log("validate in machines");
    // const { machines } = this.state;
    const { showBrand, showType, values, group } = nextProps;
    let validates = [];
    let machines = _.clone(values);
    // console.log("validate", group, value, validates);
    let i = -1;
    for (let machine of values) {
      i++;
      if (showBrand || showType) {
        if (
          machine.type !== "" &&
          (machine.brand !== "" || machine.otherBrand !== "") &&
          (machine.howMany && machine.howMany > 0)
        ) {
          validates.push(true);
          machines[i] = Object.assign(machine, { isOK: true });
        } else {
          validates.push(false);
          machines[i] = Object.assign(machine, { isOK: false });
        }
      } else {
        if (machine.howMany > 0 && machine.otherBrand !== "") {
          validates.push(true);
          machines[i] = Object.assign(machine, { isOK: true });
        } else {
          validates.push(false);
          machines[i] = Object.assign(machine, { isOK: false });
        }
      }
    }
    // this.props.filledMachines(`${group}Filled`, machines);

    this.setState({ addAllowed: !validates.includes(false) });
  };

  isOtherBrandDisabled = i => this.props.values[i].brand !== "";
  isBrandDisabled = i => this.props.values[i].otherBrand !== "";

  render() {
    const {
      brands,
      addLabel,
      removeLabel,
      label,
      showBrand,
      showType,
      values,
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
    // console.log("machine", group);
    return (
      <div
        style={{
          padding: 10,
          backgroundColor: "rgba(232, 232, 232, 0.4)",
          maxWidth: 870
        }}
      >
        <h6 style={{ fontWeight: 700 }}>{label.toUpperCase()}</h6>
        <div>
          {values.map((machine, i) => {
            return (
              <div
                key={i}
                style={{
                  // display: "grid"
                  display: "flex"
                  // gridGap: "1rem",
                  // gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr`
                  // padding: "1.3rem"
                }}
              >
                {showBrand && (
                  <span style={{ width: 200, marginRight: 10 }}>
                    <InputSelectBaza
                      daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                      wybrano={e => {
                        e && change(group, "brand", e.name, i);
                      }}
                      edytuj={v => change(group, "brand", v, i)}
                      czysc={() => change(group, "brand", "", i)}
                      value={values[i].brand}
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
                  </span>
                )}
                {showType && (
                  <span style={{ maxWidth: 200, marginRight: 10 }}>
                    <InputComponent
                      // key={i}
                      name="channel"
                      label="Typ"
                      type="text"
                      edytuj={v => change(group, "type", v, i)}
                      // edytuj={value => change("name", value, "adding")}
                      value={values[i].type || ""}
                      // disabled={field2disabled}
                    />
                  </span>
                )}
                <span
                  style={{
                    width:
                      !showBrand && !showType ? 300 : !showBrand ? 200 : 200,
                    marginRight: 10
                  }}
                >
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
                    edytuj={v => change(group, "otherBrand", v, i)}
                    // edytuj={value => change("name", value, "adding")}
                    value={values[i].otherBrand || ""}
                    // disabled={field2disabled}
                  />
                </span>
                <span style={{ maxWidth: 120, marginRight: 10 }}>
                  <InputComponent
                    // key={i}
                    name="channel"
                    label="Ilość"
                    type="text"
                    edytuj={v => change(group, "howMany", v, i)}
                    // edytuj={value => change("name", value, "adding")}
                    value={`${values[i].howMany}` || ""}
                    format="number"
                    suffix={"szt."}
                    decimals={0}
                    // disabled={field2disabled}
                  />
                </span>
                <span style={{ minWidth: 80 }}>
                  <AddButton
                    removeLabel={removeLabel}
                    addLabel={addLabel}
                    add={addMachine}
                    remove={removeMachine}
                    i={i}
                    addAllowed={addAllowed}
                    allElements={values}
                    group={group}
                  />
                </span>
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
  console.log("addButton", group, allElements.length, addAllowed);
  if (
    (allElements.length === 1 && i === 0 && addAllowed) ||
    (allElements.length > 1 && i === allElements.length - 1 && addAllowed)
  ) {
    return (
      <ButtonMy
        title="Dodaj następny"
        color="primary"
        aria-label="Add"
        onClick={() => add(group)}
        // className={classes.fab}
      >
        {/* {addLabel} */}
        <AddIcon />
      </ButtonMy>
    );
  } else if (
    (allElements.length > 1 && i < allElements.length - 1) ||
    (allElements.length > 1 && i === allElements.length - 1 && !addAllowed)
  ) {
    return (
      <ButtonMy
        title="Usuń wpis"
        color="primary"
        aria-label="Add"
        onClick={() => remove(group, i)}
        // className={classes.fab}
      >
        {/* {removeLabel} */}
        <RemoveIcon />
      </ButtonMy>
    );
  } else {
    return <span />;
  }
};

export default MachinesForm;
