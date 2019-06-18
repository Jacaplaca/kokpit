import React, { useState, Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { compose } from "redux";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import InputData from "../../common/inputs/InputData";
import axios from "axios";
import * as Yup from "yup";
import CitySearch from "../CitiesSearch";
import {
  formatNumber,
  cleanNumber,
  dataToString
} from "../../common/functions";
import FormButtons from "../../common/FormButtons";
import SerwisSummary from "../SerwisSummary";
import { getString } from "../../translate";

class SerwisForm extends Component {
  state = {
    bonus: 0,
    bonusType: null,
    bonusUnit: null,
    buy: 0,
    cityId: null,
    cityName: null,

    customer: null,
    date: null,
    dateWithConfig: true,
    gross: null,
    grossMargin: null,

    item: null,
    itemId: null,

    marginUnit: null,
    month: null,
    name: null,
    quantity: 1,
    sell: null,
    unit: null,

    items: [],
    submitIsDisable: true
  };

  componentWillMount = async () => {
    const { edit, channelId, userId, show } = this.props;
    console.log("SerwisForm() componentWillMount channelId", channelId, userId);
    const date = dataToString(new Date());

    if (!edit && !show) {
      const fetched = await this.fetchConfigFromDB(date, channelId, userId);
      const items = this.itemsFromConfig(fetched);
      console.log(
        "SerwisForm() componentWillMount(), !edit && !show date",
        date,
        items
      );
      this.setState({ date, items, itemsUnfiltered: items });
    } else if (!edit && show) {
      console.log(
        "componentWillMount SerwisForm() !edit && show",
        channelId,
        userId,
        show
      );
      const items = await this.fetchItemsFromDB(channelId);
      this.setState({ date, items, itemsUnfiltered: items });
    }
  };

  // componentDidUpdate() {
  //   console.log("calc");
  // }

  componentWillReceiveProps = async nextProps => {
    const { channelId, userId, show } = this.props;
    // console.log("SerwisForm, componentWillReceiveProps", nextProps);

    if (nextProps.edit && nextProps.edit !== this.props.edit) {
      console.log("SerwisForm() CWRP 1");
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
        itemId,
        marginUnit,
        name,
        quantity,
        sell,
        unit,
        month,
        customer,
        cityName
      } = nextProps.edit;

      console.log(
        "po waruku userid in SerwisForm()",
        nextProps.userId !== userId,
        nextProps.userId
      );
      // this.fetchItems(date);
      // this.askForConfig(date, name);

      const fetched = await this.fetchConfigFromDB(
        date,
        channelId,
        nextProps.userId
      );
      const items = this.itemsFromConfig(fetched);

      this.setState(
        {
          bonus,
          bonusType,
          bonusUnit,
          buy,
          // buy: `${buy}`,
          cityId,
          date,
          gross,
          grossMargin,
          item,
          marginUnit,
          name,
          quantity,
          sell,
          // sell: sell.toString(),
          unit,
          month,
          customer,
          cityName,
          items,
          itemId,
          itemsUnfiltered: items
        },
        () => {
          this.count();
          this.filterItemsForUsers(nextProps.userId, nextProps.users, true);
        }
      );
    } else if (
      userId !== nextProps.userId ||
      (show !== nextProps.show && nextProps.show)
    ) {
      console.log(
        "userId nShow nUserid:",
        userId,
        nextProps.show,
        nextProps.userId
      );
      const { date } = this.state;
      if (nextProps.userId === 0 && nextProps.show) {
        console.log("receive", date);
        const items = await this.fetchItemsFromDB(channelId);
        this.setState({
          date: date || dataToString(new Date()),
          items,
          itemsUnfiltered: items
        });
      } else {
        // if (channelId === 0) {
        //   // this.setState({ items: this.state.items });
        //
        //   nextProps.users.length > 0 &&
        //     // this.state.itemsUnfiltered &&
        //     // this.state.itemsUnfiltered.length > 0 &&
        //     this.filterItemsForUsers(nextProps.userId, nextProps.users);
        // } else {
        const fetched = await this.fetchConfigFromDB(
          date || dataToString(new Date()),
          channelId,
          nextProps.userId
        );
        const items = this.itemsFromConfig(fetched);
        console.log("SerwisForm(), receive fetched items", fetched, items);

        this.setState(
          {
            // date: date || dataToString(new Date()),
            items,
            itemsUnfiltered: items
          },
          () => {
            this.filterItemsForUsers(nextProps.userId, nextProps.users);
            this.count();
          }
        );
      }

      // }
    }
  };

  filterItemsForUsers = (userId, users, noclear) => {
    // const { users } = this.props;
    const { items } = this.state;
    const itemsFromState = JSON.parse(JSON.stringify(items));
    let user = users.filter(x => x.id === userId);
    if (users.length === 0) {
      user = [];
      user.push(this.props.loggedUser);
    }
    console.log(
      "itemsFromState, userId, user, users",
      itemsFromState,
      userId,
      user,
      users
    );
    if (user[0]) {
      const userChannels = user[0].SalesChannels.map(x => x.id);
      let filteredItems = [];
      for (let channel of userChannels) {
        filteredItems.push(
          ...itemsFromState.filter(x => x["Channel.id"] === channel)
        );
      }
      // console.log("filterItemsForUsers()");
      // this.clearForm();
      noclear || this.clearOnlyItem();
      // props.resetForm();
      this.setState({ items: filteredItems });
    } else {
      // this.clearForm();
      this.clearOnlyItem();
      // props.resetForm();
      this.setState({ items: [] });
    }
  };

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
    // console.log("SerwisForm() cdm", date);

    const { edit: editPrevProps } = prevProps;
  }

  clearSummary = () => {
    // console.log("clearSummary");
    this.setState({ marginUnit: 0, gross: 0, grossMargin: 0, bonus: 0 });
  };

  clearForm = () => {
    console.log("clearForm()");
    this.setState({
      cityId: null,
      // date: dataToString(new Date()),
      name: null,
      item: null,
      unit: null,
      quantity: 1,
      buy: 0,
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

  clearOnlyItem = props => {
    console.log("clearOnlyItem");
    this.setState({
      // cityId: null,
      // date: null,
      name: null,
      item: null,
      unit: null,
      quantity: 1,
      // buy: null,
      // sell: null,
      // month: null,
      // customer: null,
      // cityName: null,
      submitIsDisable: true,
      bonus: 0,
      marginUnit: null,
      bonusType: null,
      bonusUnit: null,
      gross: null,
      grossMargin: null
    });
    //problemy z zerowaniem inputu w itemach podczas wpisywania
    // props && props.setFieldValue("items", { name: "", id: 0 });
  };

  validate = bonus => {
    // console.log("validuj", bonus);
    bonus > 0
      ? this.setState({ submitIsDisable: false })
      : this.setState({ submitIsDisable: true });
  };

  count = () => {
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
    const { user } = this.props;

    bonusUnit = cleanNumber(bonusUnit);
    buy = cleanNumber(buy);
    sell = cleanNumber(sell);
    quantity = cleanNumber(quantity);
    // console.log("count()", bonusUnit, buy, sell, quantity);

    console.log("count", bonusType);

    if (bonusType === "% marży") {
      const marginUnit = sell - buy;
      const gross = sell * quantity;
      const grossMargin = marginUnit * quantity;
      const bonus = grossMargin * bonusUnit;
      this.validate(bonus);
      this.validateEmployee(user);
      this.setState({ marginUnit, gross, grossMargin, bonus });
    } else if (bonusType === "stawka") {
      const bonus = bonusUnit * quantity;
      this.validate(bonus);
      this.validateEmployee(user);
      this.setState({ bonus, marginUnit: 0, gross: 0, grossMargin: 0 });
    }
  };

  validateEmployee = user => {
    // console.log("validuj", bonus);
    user.id !== 0
      ? this.setState({ submitIsDisable: false })
      : this.setState({ submitIsDisable: true });
  };

  // askForConfig = async (date, name) => {
  //   this.clearSummary();
  //   this.setState({ buy: "0", sell: null });
  //
  //   const oldType = this.state.bonusType;
  //   const result = await axios.get(
  //     // `/api/config/channels/${this.monthKey(date)}/${name}`
  //     `/api/config/channels/${date}/${name}`
  //   );
  //   const unitFetch = await axios.get(`/api/item/channels/${name}`);
  //
  //   const { bonus, bonusType } = result.data;
  //   const bonusUnit = cleanNumber(bonus);
  //   this.setState({
  //     bonusUnit,
  //     bonusType,
  //     month: this.monthKey(date),
  //     unit: unitFetch.data.unit
  //   });
  //   this.count();
  // };

  getConfig = async (date, id, props) => {
    const { items, channelId } = this.state;
    const configs = _.clone(items);
    this.clearSummary();
    // this.clearOnlyItem();
    // this.setState({ buy: "0", sell: null });
    const config = configs
      .filter(x => x.id === id)
      .filter(y => y.channelId === channelId);

    // const oldType = this.state.bonusType;
    // const result = await axios.get(
    //   // `/api/config/channels/${this.monthKey(date)}/${name}`
    //   `/api/config/channels/${date}/${name}`
    // );
    // console.log("getconfig", configs, config, config.length);
    // const unitFetch = await axios.get(`/api/item/channels/${name}`);

    if (config.length === 0) {
      // console.log("config []");
      // this.clearForm();
      // props.resetForm();
      this.clearOnlyItem(props);
    } else if (config.length > 0) {
      console.log("config", config);
      const { bonus, bonusType, unit } = config[0];
      if (bonusType !== this.state.bonusType) {
        this.setState({ buy: 0, sell: null });
        props.setFieldValue("buy", "0");
        props.setFieldValue("sell", "");
      }
      // console.log(
      //   "im in getConfig bounus, bonustype unit",
      //   bonus,
      //   bonusType,
      //   unit
      // );
      const bonusUnit = cleanNumber(bonus);
      this.setState(
        {
          bonusUnit,
          bonusType,
          month: date,
          unit,
          itemId: id
        },
        () => this.count()
      );
      // this.count();
    }
  };

  // fetchItems = async date => {
  //   // return
  //   // console.log("fetchItems()", this.monthKey(date));
  //   const result = await axios.get(`/api/promoitems/month/${date}`);
  //   console.log("fetchItems()", result);
  //   const items = result.data.sort(dynamicSort("name"));
  //   this.setState({ items, isLoading: false });
  //   // this.props.daty(items);
  // };

  monthKey = date => {
    const dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    month = month < 10 ? `0${month}` : month;
    const year = dateObj.getUTCFullYear();
    return `${year}${month}`;
  };
  //!!!!!!!!!!!
  handleSubmit = async e => {
    const { userId, edit } = this.props;
    const { channelId } = this.state;
    let url;

    if (edit) {
      url = `/api/transaction/edit/id/${edit.id}/${userId}`;
    } else {
      url = `/api/transaction/${userId}`;
    }
    //!!!!!!!!!!
    // this.props.submit(true);
    e.preventDefault();
    const {
      itemId,
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
    // console.log("update", itemId);
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        bonus: cleanNumber(bonus),
        bonusType,
        bonusUnit: cleanNumber(bonusUnit),
        buy: cleanNumber(buy),
        channelId,
        itemId,
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
    const data = await resp.json();
    await this.props.changeRange(data);
    // await this.props.fetch();
    // await this.clearForm();
    // await this.props.submit(false);
  };

  handleChange = (field, value, props) => {
    // console.log("handleChange", field, value, props);

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
        {
          name: value.name,
          item: value.id,
          unit: value.unit
          // gross: null,
          // grossMargin: null
        },
        () => {
          // props.setFieldValue("buy", "");
          // props.setFieldValue("sell", "");
          this.getConfig(date, value.id, props);
          this.handleUpdate(prevState);
        }
      );
    } else if (field === "date") {
      this.fetchConfig(value, props);
      return;
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
        // this.askForConfig(date, name);
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

  itemsFromConfig = data =>
    data.map(x =>
      Object.assign(x, {
        id: x["Item.id"],
        name:
          this.props.channelId === 0
            ? `${x["Item.name"]} (${x["Channel.name"]})`
            : `${x["Item.name"]}`,
        unit: x["Item.unit"],
        channelId: x["Channel.id"],
        channelName: x["Channel.name"]
      })
    );

  fetchConfig = async (value, props) => {
    // props.setFieldValue("date", value);
    const { date, itemId } = this.state;
    const { channelId, userId } = this.props;
    // console.log("fetchConfig()", channelId, date, value, date !== value);
    if (date !== value) {
      const response = await this.fetchConfigFromDB(value, channelId, userId);
      console.log("response in fetchConfig()", response);

      // console.log("fetchConfig response", response, props);
      const items = this.itemsFromConfig(response);
      this.setState(
        {
          date: value,
          items,
          itemsUnfiltered: items
          // dateWithConfig: true
        },
        () => {
          props.setFieldValue("date", value);
          this.getConfig(value, itemId, props);
        }
      );
      // : this.setState({ dateWithConfig: false });
      return !!response.data;
    }
  };

  fetchConfigFromDB = async (value, channelId, userId) => {
    console.log("fetchConfigFromDB()", value, channelId, userId);
    // const { userId } = this.props;
    const result = await axios.get(
      `/api/config/month_channel/${value}/${channelId}/${userId}`
    );
    // console.log("fetchConfigFromDB()", result.data);
    return result.data;
  };

  fetchItemsFromDB = async channelId => {
    // console.log("fetchConfigFromDB()", value, channelId, userId);
    // const { userId } = this.props;
    const result = await axios.get(`/api/allitem/channel/${channelId}`);
    // console.log("fetchConfigFromDB()", result.data);
    console.log("reqult fetch items from db", result.data);
    return result.data;
  };

  render() {
    const {
      edit,
      modal,
      channelId,
      user,
      users,
      wybrano,
      edytuj,
      czysc,
      loggedUser,
      show,
      changeItem,
      userId,
      language,
      auth
    } = this.props;
    const { dateWithConfig, items } = this.state;

    const validationSchemaFlat = props => {
      // console.log("validation in SerwisForm()", props.isValid, submitIsDisable);
      return {
        // date: Yup.string().required("Podaj prawidłową datę"),
        date: Yup.mixed().test(
          "a",
          getString("CALCULATORS_FORM_DATE_INPUT", language),
          value => {
            // console.log("date validate", items, items.length, items.length > 0);
            // return this.fetchConfig(value);
            return true;
          }
        ),
        items: Yup.mixed().test(
          "a",
          getString("CALCULATORS_FORM_ITEM_INPUT", language),
          value => (show ? true : this.state.item)
        ),
        // customer: Yup.string().required("Wpisz klienta"),
        // city: Yup.mixed().test(
        //   "a",
        //   "Wybierz miejscowość",
        //   value => this.state.cityId
        // ),
        quantity: Yup.string().required(
          getString("CALCULATORS_FORM_QUANTITY_INPUT", language)
        )
      };
    };
    const validationSchemaMargin = props => {
      return {
        buy: Yup.string().required(
          getString("CALCULATORS_FORM_BUY_INPUT", language)
        ),
        sell: Yup.string().required(
          getString("CALCULATORS_FORM_SELL_INPUT", language)
        )
      };
    };

    const {
      cityId,
      marginUnit,
      bonusType,
      bonusUnit,
      gross,
      grossMargin,
      bonus,
      submitIsDisable,
      item,
      quantity,
      buy,
      sell,
      date
    } = this.state;
    const { toFill, filled } = styles;
    return (
      <div
        style={
          {
            // gridTemplateRows: "1fr 1fr"
          }
        }
      >
        <Paper
          style={{
            padding: 20,
            display: "grid",
            gridGap: "2rem",
            gridTemplateColumns: "1fr 300px"
          }}
        >
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
            enableReinitialize={true}
            initialValues={{
              items: edit ? { name: `${edit.ItemTrans.name}` } : { name: "" },
              date: edit ? edit.date : date,
              customer: edit ? edit.customer : "",
              city: edit
                ? {
                    name: `${edit.Places ? edit.Places.name : ""}`,
                    id: `${edit.Places ? edit.Places.id : 1}`
                  }
                : { name: "", id: 1 },
              quantity: edit ? `${edit.quantity}` : "1",
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
              // console.log("propsy w SerwisForm()", props.values);
              // console.log("touched", props.touched);
              return (
                <form
                  onSubmit={() => {
                    console.log("submituje", props.values);
                  }}
                >
                  <Grid container spacing={24}>
                    <Grid
                      item
                      xs={modal ? 12 : 3}
                      style={show ? filled : userId ? filled : toFill}
                    >
                      <InputSelectBaza
                        disabled={loggedUser.role !== "master"}
                        daty={daty => {}}
                        wybrano={item => {
                          item.id && wybrano(item);
                          item.id &&
                            changeItem({ name: "", id: 0, "Item.id": 0 }, show);
                          item.id &&
                            props.setFieldValue("items", { name: "", id: 0 });
                        }}
                        edytuj={value => {
                          value.id || edytuj(value);
                        }}
                        czysc={() => {
                          czysc();
                        }}
                        value={user.name}
                        label={
                          loggedUser.role === "master"
                            ? getString(
                                "CALCULATORS_FORM_USER_CHOOSE",
                                language
                              )
                            : getString("CALCULATORS_FORM_USER", language)
                        }
                        przeszukuje={users}
                        name="items"
                      />
                    </Grid>
                    {show || (
                      <Grid item xs={3}>
                        <InputData
                          id="date"
                          name="date"
                          label={
                            props.touched.date && props.errors.date
                              ? props.errors.date
                              : getString("CALCULATORS_FORM_DATE", language)
                          }
                          type="date"
                          value={props.values.date}
                          edytuj={value => {
                            // props.setFieldValue("date", value);
                            this.handleChange("date", value, props);
                            // this.fetchItems(value);
                            props.setFieldTouched("date", true);
                          }}
                          error={
                            props.touched.date && Boolean(props.errors.date)
                          }
                        />
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={modal ? 6 : 4}
                      style={
                        show
                          ? filled
                          : userId
                          ? item
                            ? filled
                            : toFill
                          : filled
                      }
                    >
                      <InputSelectBaza
                        error={
                          props.touched.items && Boolean(props.errors.items)
                        }
                        daty={daty => {}}
                        wybrano={item => {
                          item.id && props.setFieldValue("items", item);
                          item.id && changeItem(item, show);
                          this.handleChange("items", item, props);
                          item.channelId &&
                            this.setState({ channelId: item.channelId });
                          props.setFieldTouched("items", true);
                        }}
                        edytuj={edytuj => {
                          console.log(
                            "edytuj item",
                            // edytuj,
                            props.values
                            // edytuj.id
                          );
                          edytuj.id ||
                            props.setFieldValue("items", {
                              name: edytuj,
                              "Item.id": 0
                            });
                          props.setFieldTouched("items", true);
                        }}
                        czysc={() => {
                          props.setFieldValue("items", {
                            name: "",
                            id: 0,
                            buy: 0,
                            sell: 0
                          });
                          changeItem({ name: "", "Item.id": 0, id: 0 }, show);
                          this.setState({
                            name: null,
                            item: null,
                            gross: null,
                            grossMargin: null,
                            marginUnit: null
                          });
                        }}
                        value={props.values.items.name}
                        label={
                          props.touched.items && props.errors.items
                            ? props.errors.items
                            : getString("CALCULATORS_FORM_ITEM", language)
                        }
                        przeszukuje={this.state.items}
                        name="items"
                      />
                    </Grid>
                    {show || (
                      <Grid
                        item
                        xs={2}
                        style={quantity > 0 ? styles.filled : styles.toFill}
                      >
                        <InputComponent
                          disabled={!item}
                          format="number"
                          suffix={this.state.unit}
                          name="quantity"
                          error={
                            props.touched.quantity &&
                            Boolean(props.errors.quantity)
                          }
                          label={
                            props.touched.quantity && props.errors.quantity
                              ? props.errors.quantity
                              : getString("CALCULATORS_FORM_QUANTITY", language)
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("quantity", value);
                            // this.setState({ quantity: value });
                            props.setFieldTouched("quantity", true);
                            this.handleChange("quantity", value, props);
                          }}
                          value={props.values.quantity}
                        />
                      </Grid>
                    )}
                    {show || (
                      <Grid item xs={6}>
                        <InputComponent
                          name="customer"
                          label={
                            props.touched.customer && props.errors.customer
                              ? props.errors.customer
                              : getString("CALCULATORS_FORM_CUSTOMER", language)
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("customer", value);
                            this.handleChange("customer", value, props);
                            props.setFieldTouched("customer", true);
                          }}
                          error={
                            props.touched.customer &&
                            Boolean(props.errors.customer)
                          }
                          value={props.values.customer}
                        />
                      </Grid>
                    )}
                    {show || (
                      <Grid item xs={6}>
                        <CitySearch
                          miejsceLabel={props.values.city.name}
                          edytuj={id => {
                            this.handleChange("cityId", id, props);

                            props.values.city.name &&
                              props.setFieldTouched("city", true);
                          }}
                          wybranoLabel={wybranoLabel => {
                            props.setFieldValue("city", {
                              name: wybranoLabel
                            });
                            this.setState({ cityName: wybranoLabel });
                          }}
                          error={
                            props.touched.city && Boolean(props.errors.city)
                          }
                          label={
                            props.touched.city && props.errors.city
                              ? props.errors.city
                              : getString("CALCULATORS_FORM_CITY", language)
                          }
                          places
                        />
                      </Grid>
                    )}
                    {show || (
                      <Grid
                        item
                        xs={6}
                        style={
                          item
                            ? bonusType === "stawka"
                              ? styles.filled
                              : Math.trunc(buy) > 0
                              ? styles.filled
                              : styles.toFill
                            : styles.filled
                        }
                      >
                        <InputComponent
                          disabled={bonusType !== "% marży"}
                          format="number"
                          suffix={
                            auth.Company.currency ? auth.Company.currency : ""
                          }
                          name="buy"
                          error={props.touched.buy && Boolean(props.errors.buy)}
                          label={
                            props.touched.buy && props.errors.buy
                              ? props.errors.buy
                              : getString("CALCULATORS_FORM_BUY", language)
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("buy", value);
                            // this.setState({ buy: value });
                            props.setFieldTouched("buy", true);
                            this.handleChange("buy", value, props);
                          }}
                          value={props.values.buy}
                        />
                      </Grid>
                    )}
                    {show || (
                      <Grid
                        item
                        xs={6}
                        style={
                          item
                            ? bonusType === "stawka"
                              ? styles.filled
                              : Math.trunc(sell) > Math.trunc(buy)
                              ? styles.filled
                              : styles.toFill
                            : styles.filled
                        }
                      >
                        <InputComponent
                          disabled={bonusType !== "% marży"}
                          format="number"
                          suffix={
                            auth.Company.currency ? auth.Company.currency : ""
                          }
                          name="sell"
                          error={
                            props.touched.sell && Boolean(props.errors.sell)
                          }
                          label={
                            props.touched.sell && props.errors.sell
                              ? props.errors.sell
                              : getString("CALCULATORS_FORM_SELL", language)
                          }
                          type="text"
                          edytuj={value => {
                            props.setFieldValue("sell", value);
                            // this.setState({ sell: value });
                            props.setFieldTouched("sell", true);
                            this.handleChange("sell", value, props);
                          }}
                          value={props.values.sell}
                        />
                      </Grid>
                    )}
                  </Grid>
                  {show || (
                    <FormButtons
                      subDisable={
                        props.isValid ? (submitIsDisable ? true : false) : true
                      }
                      subLabel={
                        modal && edit
                          ? getString("CALCULATORS_FORM_CONFIRM_EDIT", language)
                          : bonus > 0
                          ? `${getString(
                              "CALCULATORS_BUTTON_SUBMIT",
                              language
                            )} ${formatNumber(bonus)} ${
                              auth.Company.currency ? auth.Company.currency : ""
                            }`
                          : getString("CALCULATORS_FORM_CONFIRM", language)
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
                      // cancelLabel={"Anuluj"}
                      cancelAction={() => {
                        this.props.modal && this.props.closeModal();
                        this.clearForm();
                        props.resetForm();
                        props.setFieldValue("city", {
                          name: "cancelLabel"
                        });
                      }}
                    />
                  )}
                </form>
              );
            }}
          />
          {show || (
            <SerwisSummary
              bonus={bonus}
              bonusType={bonusType}
              marginUnit={marginUnit}
              gross={gross}
              grossMargin={grossMargin}
              bonusUnit={bonusUnit}
            />
          )}
        </Paper>
      </div>
    );
  }
}

InputComponent.defaultProps = {
  modal: false
};

const styles = {
  toFill: {
    backgroundColor: "rgba(255, 61, 0, 0.06)",
    borderRadius: 4
  },
  filled: {
    backgroundColor: "white",
    borderRadius: 4
  }
};

const styles2 = theme => ({
  bonusBox: {
    padding: 10,
    display: "grid",
    background: theme.palette.secondary.main,
    borderRadius: 3
  },
  summaryBox: {
    padding: 20,
    background: fade(theme.palette.secondary.main, 0.06)
  }
});

// export default withStyles(styles2, { withTheme: true })(SerwisForm);

function mapStateToProps({ auth, language }) {
  return {
    language,
    auth
  };
}

export default compose(
  withStyles(styles2, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  )
)(SerwisForm);
