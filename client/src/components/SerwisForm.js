import React, { useState, Component } from "react";
import { Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputData from "../common/inputs/InputData";
import axios from "axios";
import ButtonMy from "../common/ButtonMy";
import CitySearch from "./CitiesSearch";
import Send from "@material-ui/icons/Send";

class SerwisForm extends Component {
  state = {
    cityId: 0,
    date: null,
    name: null,
    unit: null,
    quantity: 1,
    buy: null,
    sell: null
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      date,
      name,
      quantity,
      buy,
      sell,
      bonusUnit,
      bonusType
    } = this.state;
    const {
      date: prevDateState,
      name: prevNameState,
      quantity: prevQuantityState,
      buy: prevBuyState,
      sell: prevSellState,
      bonusUnit: prevBonusUnitState,
      bonusType: prevBonusTypeState
    } = prevState;
    // if (date) {
    //
    // }
    console.log("prevState", prevState);
    console.log("state", this.state);
    if (date && name) {
      // console.log("prevNameState", prevNameState);
      // console.log("name", name);
      if (prevDateState !== date || prevNameState !== name) {
        this.askForConfig(date, name);
      }
    }

    if (date && name && quantity && buy && bonusUnit && bonusType) {
      if (
        prevDateState !== date ||
        prevNameState !== name ||
        prevQuantityState !== quantity ||
        prevBuyState !== buy ||
        prevSellState !== sell ||
        prevBonusUnitState !== bonusUnit ||
        prevBonusTypeState !== bonusType
      ) {
        this.count();
      }
    }
  }

  count = () => {};

  askForConfig = async (date, name) => {
    console.log("askForConfig");
    const dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    month = month < 10 ? `0${month}` : month;
    const year = dateObj.getUTCFullYear();
    const properMonth = `${year}${month}`;
    // console.log(properMonth);
    const result = await axios.get(
      `/api/config/channels/${properMonth}/${name}`
    );
    const { bonus, bonusType } = result.data;
    this.setState({ bonusUnit: bonus, bonusType });
    // console.log("result", result);
  };

  handleSubmit = async (values, cityId) => {
    values.city.id = cityId;
    const month = "201709";
    const name = "Pulsator";
    console.log("handleSubmit", values);
  };

  render() {
    // const {values, setFieldValue} = this.props
    const {
      cityId,
      marginUnit,
      bonusType,
      bonusUnit,
      gross,
      grossMargin,
      bonus
    } = this.state;
    return (
      <Paper style={{ padding: 20 }}>
        <h1>My Form</h1>
        <Formik
          initialValues={{
            items: { name: "" },
            date: "",
            client: "",
            city: { name: "", id: 1 },
            quantity: 1,
            buy: 0,
            sell: 0
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
          render={props => {
            // console.log("propsy w SerwisForm()", cityId);
            return (
              <form
                onSubmit={() => {
                  console.log("submituje", props.values);
                  // props.handleSubmit();
                }}
              >
                {/* <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.name}
              name="name"
            />
            {props.errors.name && <div id="feedback">{props.errors.name}</div>}
            <button type="submit">Submit</button> */}
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <InputData
                      id="date"
                      name="date"
                      label="Data transakcji"
                      type="date"
                      // onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.date}
                      //disabled={modal ? true : false}
                      //error={this.state.errorKiedy}
                      //label="Kiedy"
                      edytuj={value => {
                        props.setFieldValue("date", value);
                        this.setState({ date: value });
                      }}
                      // value={this.state.data_wystawienia}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputSelectBaza
                      daty={daty => console.log(daty)}
                      // daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                      wybrano={item => {
                        // category && this.setState({ categoryId: category.id });
                        // console.log("item", item.id);
                        item.id && props.setFieldValue("items", item);
                        this.setState({ name: item.name, unit: item.unit });
                        // console.log("wybrano", item, props.values.items);
                      }}
                      edytuj={edytuj => {
                        // this.setState({ categoryText });
                        // console.log("edytuj", edytuj.id);
                        edytuj.id ||
                          props.setFieldValue("items", { name: edytuj, id: 0 });
                        // console.log("edytuj", edytuj, props.values.items);
                      }}
                      czysc={() =>
                        props.setFieldValue("items", { name: "", id: 0 })
                      }
                      // value={this.state.categoryText}
                      // onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.items.name}
                      label="Towar/Usługa"
                      placeholder="Kategorie kosztowe"
                      przeszukuje="items"
                      name="items"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputComponent
                      name="client"
                      label="Klient"
                      type="text"
                      edytuj={value => props.setFieldValue("client", value)}
                      // onChange={props.handleChange}
                      value={props.values.client}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CitySearch
                      // name="city"
                      // test={miejsce_id =>
                      //   this.setState({ miejsce_id_temp: miejsce_id })
                      // }
                      miejsceLabel={props.values.city.name}
                      // edytuj={miejsce_id => this.setState({ miejsce_id })}
                      edytuj={id => {
                        // this.setState({ categoryText });
                        this.setState({ cityId: id });
                        // console.log("city edytuj", id);
                        // props.setFieldValue("city", { id });
                        // console.log("edytuj", props.values.city);
                      }}
                      // value={props.values.city.id}
                      // cancelLabel={() =>
                      //   props.setFieldValue("city", { name: "", id: 0 })
                      // }
                      wybranoLabel={wybranoLabel => {
                        // console.log("wybranoLabel", wybranoLabel, cityId);
                        props.setFieldValue("city", {
                          name: wybranoLabel
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputComponent
                      format="number"
                      suffix={this.state.unit}
                      name="quantity"
                      label="Ilość"
                      type="text"
                      edytuj={value => {
                        props.setFieldValue("quantity", value);
                        this.setState({ quantity: value });
                      }}
                      // onChange={props.handleChange}
                      value={props.values.quantity}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <InputComponent
                      format="zl"
                      name="buy"
                      label="Cena zakupu jednostki brutto"
                      type="text"
                      edytuj={value => {
                        props.setFieldValue("buy", value);
                        this.setState({ buy: value });
                      }}
                      // onChange={props.handleChange}
                      value={props.values.buy}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <InputComponent
                      format="zl"
                      name="sell"
                      label="Cena sprzedaży jednostki brutto"
                      type="text"
                      edytuj={value => {
                        props.setFieldValue("sell", value);
                        this.setState({ sell: value });
                      }}
                      // onChange={props.handleChange}
                      value={props.values.sell}
                    />
                  </Grid>
                </Grid>
                <div
                  style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
                >
                  <div>
                    <span>Marża jednostkowa: </span>
                    <span>{marginUnit}</span>
                  </div>
                  <div>
                    <span>Typ premii: </span>
                    <span>{bonusType}</span>
                  </div>
                  <div>
                    <span>Stawka / % marży: </span>
                    <span>{bonusUnit}</span>
                  </div>
                  <div>
                    <span>Wartość brutto: </span>
                    <span>{gross}</span>
                  </div>
                  <div>
                    <span>Marża brutto: </span>
                    <span>{grossMargin}</span>
                  </div>
                  <div>
                    <span>Premia: </span>
                    <span>{bonus}</span>
                  </div>
                </div>
                <ButtonMy
                  progress
                  // disabled={submitIsDisable}
                  onClick={e =>
                    //   {
                    //   if (edited && !duplicate) {
                    //     this.onEdit();
                    //   } else if ((edited && duplicate) || !edited) {
                    //     this.handleSubmit(e);
                    //   }
                    // }
                    // console.log("sumbituje", props.values)
                    this.handleSubmit(props.values, cityId)
                  }
                >
                  ok
                  {/* {duplicate
                  ? "Dodaj koszt"
                  : edited
                    ? "Edytuj koszt"
                    : "Dodaj koszt"}
                {!submitCheck && <Send style={{ marginLeft: 10 }} />} */}
                </ButtonMy>
              </form>
            );
          }}
        />
      </Paper>
    );
  }
}

export default SerwisForm;
