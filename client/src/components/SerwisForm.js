import React, { useState, Component } from "react";
import { Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputData from "../common/inputs/InputData";
import axios from "axios";
import * as Yup from "yup";
import ButtonMy from "../common/ButtonMy";
import CitySearch from "./CitiesSearch";
import NumberFormat from "react-number-format";
import { formatNumber, cleanNumber, dynamicSort } from "../common/functions";
import FormButtons from "../common/FormButtons";
import Send from "@material-ui/icons/Send";

class SerwisForm extends Component {
  state = {
    bonus: 0,
    bonusType: null,
    bonusUnit: null,
    buy: null,
    cityId: null,
    cityName: null,

    customer: null,
    date: null,
    gross: null,
    grossMargin: null,

    item: null,

    marginUnit: null,
    month: null,
    name: null,
    quantity: 1,
    sell: null,
    unit: null,

    items: [],
    submitIsDisable: true
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit && nextProps.edit !== this.props.edit) {
      //Perform some operation
      // this.setState({ customer: nextProps.edit.customer });
      // this.clearSummary();
      const {
        bonus,
        bonusType,
        bonusUnit,
        buy,
        cityId,
        date,
        gross,
        grossMargin,
        item,
        marginUnit,
        name,
        quantity,
        sell,
        unit,
        month,
        customer,
        cityName
      } = nextProps.edit;

      this.fetchItems(date);
      this.askForConfig(date, name);

      this.setState(
        {
          bonus,
          bonusType,
          bonusUnit,
          buy: `${buy}`,
          cityId,
          date,
          gross,
          grossMargin,
          item,
          marginUnit,
          name,
          quantity,
          sell: sell.toString(),
          unit,
          month,
          customer,
          cityName
        },
        () => this.count()
      );

      // if (bonusType === "% marży") {
      //   // const marginUnit = sell - buy;
      //   // const gross = sell * quantity;
      //   // const grossMargin = marginUnit * quantity;
      //   // const bonus = grossMargin * bonusUnit;
      //   // this.validate(bonus);
      //   this.setState({ marginUnit, gross, grossMargin, bonus });
      // } else if (bonusType === "stawka") {
      //   // const bonus = bonusUnit * quantity;
      //   // this.validate(bonus);
      //   this.setState({ bonus });
      // }

      // this.setState(nextProps.edit);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      date,
      name,
      quantity,
      buy,
      sell,
      bonusUnit,
      bonusType,
      bonus
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

    const { edit: editPrevProps } = prevProps;

    // console.log("czy do clear", bonusType, prevBonusTypeState);
    // if (bonusType !== prevBonusTypeState) {
    //   // console.log("clean buy and sell", editPrevProps, this.props.edit);
    //   this.clearSummary();
    //   this.setState({ buy: "0", sell: null });
    // }

    // if (!this.props.edit) {
    //   // if (bonusType !== prevBonusTypeState) {
    //   //   // console.log("clean buy and sell", editPrevProps, this.props.edit);
    //   //   this.setState({ buy: "0", sell: null });
    //   // }
    //
    //   // if (date) {
    //   //
    //   // }
    //   // console.log("prevState", prevState);
    //   // console.log("state", this.state);
    //   if (date && name) {
    //     // console.log("prevNameState", prevNameState);
    //     // console.log("name", name);
    //     if (prevDateState !== date || prevNameState !== name) {
    //       // console.log("asking for cnfig");
    //       this.askForConfig(date, name);
    //     }
    //   }
    //   // console.log(
    //   //
    //   //   prevEdit,
    //   //   this.props.edit
    //   // );
    //   if (
    //     date &&
    //     name &&
    //     quantity &&
    //     bonusUnit &&
    //     bonusType
    //     // editPrevProps === this.props.edit
    //   ) {
    //     if (
    //       prevDateState !== date ||
    //       prevNameState !== name ||
    //       prevQuantityState !== quantity ||
    //       prevBuyState !== buy ||
    //       prevSellState !== sell ||
    //       prevBonusUnitState !== bonusUnit ||
    //       prevBonusTypeState !== bonusType
    //     ) {
    //       console.log(
    //         "count m cdu",
    //         date,
    //         name,
    //         quantity,
    //         bonusUnit,
    //         bonusType
    //       );
    //       this.count();
    //     } else if (!date || !name || !quantity || !bonusUnit || !bonusType) {
    //       this.clearSummary();
    //     }
    //     this.state.item || this.setState({ bonusType: null });
    //     // this.validate(bonus);
    //   }
    // }
  }

  clearSummary = () => {
    console.log("clearSummary");
    this.setState({ marginUnit: 0, gross: 0, grossMargin: 0, bonus: 0 });
  };

  clearForm = () => {
    this.setState({
      cityId: null,
      date: null,
      name: null,
      item: null,
      unit: null,
      quantity: 1,
      buy: null,
      sell: null,
      month: null,
      customer: null,
      cityName: null,
      submitIsDisable: true,
      bonus: 0,
      marginUnit: null,
      bonusType: null,
      bonusUnit: null,
      gross: null,
      grossMargin: null
    });
  };

  validate = bonus => {
    console.log("validuj", bonus);
    bonus > 0
      ? this.setState({ submitIsDisable: false })
      : this.setState({ submitIsDisable: true });
  };

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
      this.validate(bonus);
      console.log(
        "count marzy sell",
        sell,
        "buy",
        buy,
        "quantity",
        quantity,
        "bonusUnit",
        bonusUnit,
        "marginUnit",
        marginUnit,
        "gross",
        gross,
        "grossMargin",
        grossMargin,
        "bonus",
        bonus
      );
      this.setState({ marginUnit, gross, grossMargin, bonus });
    } else if (bonusType === "stawka") {
      const bonus = bonusUnit * quantity;
      this.validate(bonus);
      this.setState({ bonus });
    }
  };

  askForConfig = async (date, name) => {
    this.clearSummary();
    this.setState({ buy: "0", sell: null });

    console.log("askForConfig", date, name);
    const oldType = this.state.bonusType;
    const result = await axios.get(
      `/api/config/channels/${this.monthKey(date)}/${name}`
    );
    const unitFetch = await axios.get(`/api/item/channels/${name}`);

    console.log("unitFetch", unitFetch.data);

    const { bonus, bonusType } = result.data;
    const bonusUnit = cleanNumber(bonus);
    this.setState({
      bonusUnit,
      bonusType,
      month: this.monthKey(date),
      unit: unitFetch.data.unit
    });
    this.count();
  };

  fetchItems = async date => {
    // return
    console.log("fetchItems()", this.monthKey(date));
    const result = await axios.get(
      `/api/promoitems/month/${this.monthKey(date)}`
    );
    console.log("fetchItems()", result);
    const items = result.data.sort(dynamicSort("name"));
    this.setState({ items, isLoading: false });
    // this.props.daty(items);
  };

  monthKey = date => {
    const dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    month = month < 10 ? `0${month}` : month;
    const year = dateObj.getUTCFullYear();
    return `${year}${month}`;
  };

  // handleSubmit = async (values, cityId) => {
  //   values.city.id = cityId;
  //   const month = "201709";
  //   const name = "Pulsator";
  //   console.log("handleSubmit", values);
  // };

  handleSubmit = async e => {
    let url;

    if (this.props.edit) {
      url = `/api/transaction/edit/id/${this.props.edit.id}`;
    } else {
      url = "/api/transaction";
    }

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
    await this.props.fetch();
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

  handleChange = (field, value) => {
    // console.log("handleChange", field, value);

    const {
      date,
      name,
      quantity,
      buy,
      sell,
      bonusUnit,
      bonusType,
      bonus
    } = this.state;

    const prevState = {
      date,
      name,
      quantity,
      buy,
      sell,
      bonusUnit,
      bonusType,
      bonus
    };

    if (field === "items") {
      this.setState(
        { name: value.name, item: value.id, unit: value.unit },
        () => this.handleUpdate(prevState)
      );
    } else {
      this.setState({ [field]: value }, () => this.handleUpdate(prevState));
    }
  };

  handleUpdate = prevState => {
    const {
      date,
      name,
      quantity,
      buy,
      sell,
      bonusUnit,
      bonusType,
      bonus
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

    if (date && name) {
      // console.log("prevNameState", prevNameState);
      // console.log("name", name);
      if (prevDateState !== date || prevNameState !== name) {
        // console.log("asking for cnfig");
        this.askForConfig(date, name);
      }
    }
    console.log(
      "date name quantity, bonusUnit bonusType",
      date,
      name,
      quantity,
      bonusUnit,
      bonusType
    );
    if (
      date &&
      name &&
      quantity &&
      bonusUnit &&
      bonusType
      // editPrevProps === this.props.edit
    ) {
      if (
        prevDateState !== date ||
        prevNameState !== name ||
        prevQuantityState !== quantity ||
        prevBuyState !== buy ||
        prevSellState !== sell ||
        prevBonusUnitState !== bonusUnit ||
        prevBonusTypeState !== bonusType
      ) {
        console.log("count m cdu", date, name, quantity, bonusUnit, bonusType);
        this.count();
      } else if (!date || !name || !quantity || !bonusUnit || !bonusType) {
        this.clearSummary();
      }
      this.state.item || this.setState({ bonusType: null });
      // this.validate(bonus);
    }
  };

  render() {
    const { edit, modal } = this.props;

    const validationSchemaFlat = props => {
      return {
        // date: Yup.string().required("Podaj prawidłową datę"),
        date: Yup.mixed().test("a", "Podaj prawidłową datę", value => {
          return axios
            .get(`/api/config/month_channel/${this.monthKey(value)}/`)
            .then(response => {
              // console.log(response);
              // console.log(response.data);
              return !!response.data;
            });
        }),
        items: Yup.mixed().test(
          "a",
          "Wybierz produkt/usługę",
          value => this.state.item
        ),
        customer: Yup.string().required("Wpisz klienta"),
        city: Yup.mixed().test(
          "a",
          "Wybierz miejscowość",
          value => this.state.cityId
        ),
        quantity: Yup.string().required("Wpisz ilość")
      };
    };
    const validationSchemaMargin = props => {
      return {
        buy: Yup.string().required("Wpisz cenę zakupu jedn. (brutto)"),
        sell: Yup.string().required("Wpisz cenę sprzedaży jedn. (brutto)")
      };
    };
    // const validationSchemaFlat = Yup.object().shape({
    //   date: Yup.string().required("A text is required"),
    //   items: Yup.mixed().test("a", "b", value => this.state.item),
    //   customer: Yup.string().required("A text is required"),
    //   city: Yup.mixed().test("a", "b", value => this.state.cityId),
    //   quantity: Yup.string().required("A text is required")
    // });
    // const validationSchemaMargin = Yup.object().shape({
    //   buy: Yup.string().required("A text is required"),
    //   sell: Yup.string().required("A text is required")
    // });
    // const {values, setFieldValue} = this.props
    const {
      cityId,
      marginUnit,
      bonusType,
      bonusUnit,
      gross,
      grossMargin,
      bonus,
      submitIsDisable
    } = this.state;
    // console.log("edit", edit);
    return (
      <Paper style={{ padding: 20 }}>
        <Formik
          validationSchema={props =>
            Yup.object().shape(
              bonusType === "stawka"
                ? { ...validationSchemaFlat(props) }
                : {
                    ...validationSchemaFlat(props),
                    ...validationSchemaMargin(props)
                  }
            )
          }
          // validationSchema={
          //   bonusType === "stawka"
          //     ? validationSchemaFlat
          //     : validationSchemaMargin
          // }
          // validateOnBlur={true}
          // validateOnChange={true}
          enableReinitialize={true}
          initialValues={{
            items: edit ? { name: `${edit.name}` } : { name: "" },
            date: edit ? edit.date : "",
            customer: edit ? edit.customer : "",
            city: edit
              ? { name: `${edit.cityName}`, id: `${edit.city}` }
              : { name: "", id: 1 },
            quantity: edit ? edit.quantity : "1",
            buy: edit ? `${edit.buy}` : "0",
            sell: edit ? `${edit.sell}` : ""
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
          render={props => {
            // if (edit && props.values.customer === "") {
            //   props.setFieldValue("customer", edit.customer);
            // }
            console.log("propsy w SerwisForm()", props.values);
            // console.log("touched", props.touched);
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
                      // onBlur={() => {
                      //   console.log("podnosze przci");
                      //   props.setFieldTouched("date", true);
                      // }}
                      id="date"
                      name="date"
                      label={
                        props.touched.date && props.errors.date
                          ? props.errors.date
                          : "Data transakcji"
                      }
                      // label="Data transakcji"
                      type="date"
                      // onChange={props.handleChange}
                      // onKeyPress={() => console.log("onblur")}
                      value={props.values.date}
                      //disabled={modal ? true : false}
                      //error={this.state.errorKiedy}
                      //label="Kiedy"
                      edytuj={value => {
                        props.setFieldValue("date", value);
                        // this.setState({ date: value });
                        this.handleChange("date", value);
                        this.fetchItems(value);
                        props.setFieldTouched("date", true);
                      }}
                      error={props.touched.date && Boolean(props.errors.date)}
                      // helperText={
                      //   props.touched.date && props.errors.date
                      //     ? props.errors.date
                      //     : " "
                      // }
                      // value={this.state.data_wystawienia}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputSelectBaza
                      error={props.touched.items && Boolean(props.errors.items)}
                      // helperText={
                      //   props.touched.items && props.errors.items
                      //     ? props.errors.items
                      //     : " "
                      // }
                      daty={daty => {}}
                      // daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                      wybrano={item => {
                        // category && this.setState({ categoryId: category.id });
                        // console.log("item", item.id);
                        item.id && props.setFieldValue("items", item);
                        // this.setState({
                        //   name: item.name,
                        //   unit: item.unit,
                        //   item: item.id
                        // });
                        this.handleChange("items", item);
                        props.setFieldTouched("items", true);
                        // console.log("wybrano", item, props.values.items);
                      }}
                      edytuj={edytuj => {
                        // this.setState({ categoryText });
                        // console.log("edytuj", edytuj.id);
                        edytuj.id ||
                          props.setFieldValue("items", { name: edytuj, id: 0 });
                        props.setFieldTouched("items", true);

                        // console.log("edytuj", edytuj, props.values.items);
                      }}
                      czysc={() => {
                        props.setFieldValue("items", { name: "", id: 0 });
                        this.setState({ name: null, item: null });
                      }}
                      // value={this.state.categoryText}
                      // onChange={props.handleChange}
                      // onBlur={props.handleBlur}
                      value={props.values.items.name}
                      label={
                        props.touched.items && props.errors.items
                          ? props.errors.items
                          : "Towar/Usługa"
                      }
                      // placeholder="Kategorie kosztowe"
                      // przeszukuje={[
                      //   {
                      //     bonus: "5.00",
                      //     bonusType: "stawka",
                      //     channelId: 1,
                      //     clientId: 2,
                      //     createdAt: null,
                      //     id: 268,
                      //     key: "201902Dipping 10",
                      //     month: 201902,
                      //     name: "Dipping 10",
                      //     updatedAt: null
                      //   }
                      // ]}
                      przeszukuje={this.state.items}
                      // przeszukuje="items"
                      name="items"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputComponent
                      name="customer"
                      label={
                        props.touched.customer && props.errors.customer
                          ? props.errors.customer
                          : "Klient"
                      }
                      type="text"
                      edytuj={value => {
                        props.setFieldValue("customer", value);
                        // this.setState({ customer: value });
                        this.handleChange("customer", value);
                        props.setFieldTouched("customer", true);
                      }}
                      error={
                        props.touched.customer && Boolean(props.errors.customer)
                      }
                      // onChange={props.handleChange}
                      value={props.values.customer}
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
                        // this.setState({
                        //   cityId: id
                        //   // cityName: props.values.city.name
                        // });
                        this.handleChange("cityId", id);
                        // console.log("city edytuj", id);
                        // props.setFieldValue("city", { id });
                        // console.log("edytuj", props.values.city);
                        // props.setFieldTouched("city", true);
                        props.values.city.name &&
                          props.setFieldTouched("city", true);
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
                        // props.setFieldTouched("city", true);
                        this.setState({ cityName: wybranoLabel });
                      }}
                      error={props.touched.city && Boolean(props.errors.city)}
                      label={
                        props.touched.city && props.errors.city
                          ? props.errors.city
                          : "Miejscowość"
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputComponent
                      format="number"
                      suffix={this.state.unit}
                      name="quantity"
                      error={
                        props.touched.quantity && Boolean(props.errors.quantity)
                      }
                      label={
                        props.touched.quantity && props.errors.quantity
                          ? props.errors.quantity
                          : "Ilość"
                      }
                      type="text"
                      edytuj={value => {
                        props.setFieldValue("quantity", value);
                        // this.setState({ quantity: value });
                        props.setFieldTouched("quantity", true);
                        this.handleChange("quantity", value);
                      }}
                      // onChange={props.handleChange}
                      value={props.values.quantity}
                    />
                  </Grid>
                  {bonusType === "% marży" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <InputComponent
                          format="number"
                          suffix="zł"
                          name="buy"
                          error={props.touched.buy && Boolean(props.errors.buy)}
                          label={
                            props.touched.buy && props.errors.buy
                              ? props.errors.buy
                              : "Cena zakupu jedn. brutto"
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("buy", value);
                            // this.setState({ buy: value });
                            props.setFieldTouched("buy", true);
                            this.handleChange("buy", value);
                          }}
                          // onChange={props.handleChange}
                          value={this.state.buy}
                          // value={props.values.buy}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <InputComponent
                          format="number"
                          suffix="zł"
                          name="sell"
                          error={
                            props.touched.sell && Boolean(props.errors.sell)
                          }
                          label={
                            props.touched.sell && props.errors.sell
                              ? props.errors.sell
                              : "Cena sprzed. jedn. brutto"
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("sell", value);
                            // this.setState({ sell: value });
                            props.setFieldTouched("sell", true);
                            this.handleChange("sell", value);
                          }}
                          // onChange={props.handleChange}
                          value={this.state.sell}
                          // value={props.values.sell}
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
                <FormButtons
                  subDisable={
                    props.isValid ? (submitIsDisable ? true : false) : true
                  }
                  // subDisable={() => {
                  //   if (submitIsDisable) {
                  //     console.log("submitIsDisable", submitIsDisable);
                  //     return true;
                  //   }
                  // }}
                  subLabel={
                    modal && edit ? "Edytuj transakcję" : "Dodaj transakcję"
                  }
                  subAction={e => {
                    this.handleSubmit(e);
                    this.props.modal && this.props.closeModal();
                    this.clearForm();
                    props.resetForm();
                    props.setFieldValue("city", {
                      name: "cancelLabel"
                    });
                  }}
                  // subLabel={
                  //   toEdit !== null ? "Edytuj organizatora" : "Dodaj organizatora"
                  // }
                  cancelLabel={"Anuluj"}
                  cancelAction={() => {
                    // store.dispatch(actions.editFetch());
                    this.props.modal && this.props.closeModal();
                    this.clearForm();
                    props.resetForm();
                    props.setFieldValue("city", {
                      name: "cancelLabel"
                    });
                  }}
                />
              </form>
            );
          }}
        />
      </Paper>
    );
  }
}

InputComponent.defaultProps = {
  modal: false
};

export default SerwisForm;
