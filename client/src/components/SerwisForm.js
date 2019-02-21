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
import NumberFormat from "react-number-format";
import { formatNumber, cleanNumber } from "../common/functions";
import Send from "@material-ui/icons/Send";

class SerwisForm extends Component {
  state = {
    cityId: 0,
    date: null,
    name: null,
    unit: null,
    quantity: 1,
    buy: null,
    sell: null,
    month: null,
    customer: null,
    cityName: null
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

    if (date && name && quantity && bonusUnit && bonusType) {
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

  count = () => {
    console.log("count()");
    let {
      marginUnit,
      bonusType,
      bonusUnit,
      gross,
      grossMargin,
      bonus,
      buy,
      sell,
      quantity
    } = this.state;

    bonusUnit = cleanNumber(bonusUnit);
    buy = cleanNumber(buy);
    sell = cleanNumber(sell);
    quantity = cleanNumber(quantity);
    // console.log(
    //   "bonusUnit",
    //   bonusUnit,
    //   "buy",
    //   buy,
    //   "sell",
    //   sell,
    //   "quantity",
    //   quantity
    // );

    if (bonusType === "% marży") {
      const marginUnit = sell - buy;
      const gross = sell * quantity;
      const grossMargin = marginUnit * quantity;
      const bonus = grossMargin * bonusUnit;
      this.setState({ marginUnit, gross, grossMargin, bonus });
    } else if (bonusType === "stawka") {
      const bonus = bonusUnit * quantity;
      this.setState({ bonus });
    }
  };

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

    console.log("result", result);
    const { bonus, bonusType } = result.data;
    const bonusUnit = cleanNumber(bonus);
    this.setState({ bonusUnit, bonusType, month: properMonth });
  };

  // handleSubmit = async (values, cityId) => {
  //   values.city.id = cityId;
  //   const month = "201709";
  //   const name = "Pulsator";
  //   console.log("handleSubmit", values);
  // };

  handleSubmit = async e => {
    // this.props.submit(true);
    e.preventDefault();
    const {
      bonus,
      bonusType,
      bonusUnit,
      buy,
      cityId,
      date,
      gross,
      grossMargin,
      marginUnit,
      name,
      quantity,
      sell,
      unit,
      month,
      customer,
      cityName
    } = this.state;
    const url = "/api/transaction";

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        bonus: cleanNumber(bonus),
        bonusType,
        bonusUnit: cleanNumber(bonusUnit),
        buy: cleanNumber(buy),
        cityId,
        date,
        gross: cleanNumber(gross),
        grossMargin: cleanNumber(grossMargin),
        marginUnit: cleanNumber(marginUnit),
        name,
        quantity: cleanNumber(quantity),
        sell: cleanNumber(sell),
        unit,
        month,
        customer,
        cityName
      })
    });
    // const data = await resp.json();
    // await this.props.changeRange(data);
    // await this.props.fetchuj();
    // await this.clearForm();
    // await this.props.submit(false);
  };

  bonusType = () => {
    if (this.state.bonusType === "stawka") {
      return "Stawka: ";
    } else if (this.state.bonusType === "% marży") {
      return "% marży: ";
    }
  };

  bonusUnit = () => {
    if (this.state.bonusType === "stawka") {
      return (
        <NumberFormat
          value={formatNumber(this.state.bonusUnit)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={" zł"}
        />
      );
    } else if (this.state.bonusType === "% marży") {
      return (
        <NumberFormat
          value={formatNumber(this.state.bonusUnit * 100)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={"%"}
        />
      );
    }
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
                      edytuj={value => {
                        props.setFieldValue("client", value);
                        this.setState({ customer: value });
                      }}
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
                        this.setState({
                          cityId: id
                          // cityName: props.values.city.name
                        });
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
                        this.setState({ cityName: wybranoLabel });
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
                  {bonusType === "% marży" && (
                    <React.Fragment>
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
                    </React.Fragment>
                  )}
                </Grid>
                {/* <div
                  style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
                > */}
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <div>
                      <span>{this.bonusType()} </span>
                      <span>{this.bonusUnit()}</span>
                    </div>
                    <div>
                      <span>Premia: </span>
                      <NumberFormat
                        value={formatNumber(bonus)}
                        displayType={"text"}
                        thousandSeparator={" "}
                        decimalSeparator={","}
                        suffix={" zł"}
                      />
                    </div>
                  </Grid>
                  {bonusType === "% marży" && (
                    <React.Fragment>
                      <Grid item xs={4}>
                        <div>
                          <span>Marża jednostkowa: </span>
                          <NumberFormat
                            value={formatNumber(marginUnit)}
                            displayType={"text"}
                            thousandSeparator={" "}
                            decimalSeparator={","}
                            suffix={" zł"}
                          />
                        </div>
                        <div>
                          <span>Wartość brutto: </span>
                          <NumberFormat
                            value={formatNumber(gross)}
                            displayType={"text"}
                            thousandSeparator={" "}
                            decimalSeparator={","}
                            suffix={" zł"}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div>
                          <span>Marża brutto: </span>
                          <NumberFormat
                            value={formatNumber(grossMargin)}
                            displayType={"text"}
                            thousandSeparator={" "}
                            decimalSeparator={","}
                            suffix={" zł"}
                          />
                        </div>
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>

                {/* </div> */}
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
                    this.handleSubmit(e)
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
