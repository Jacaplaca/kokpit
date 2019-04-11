import React, { useState, Component } from "react";
import { Formik } from "formik";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import InputData from "../../common/inputs/InputData";
import axios from "axios";
import * as Yup from "yup";
import ButtonMy from "../../common/ButtonMy";
import CitySearch from "../CitiesSearch";
import NumberFormat from "react-number-format";
import {
  formatNumber,
  cleanNumber,
  dynamicSort,
  dataToString
} from "../../common/functions";
import FormButtons from "../../common/FormButtons";
import Send from "@material-ui/icons/Send";
import SerwisSummary from "../SerwisSummary";

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
    const { edit, channelId } = this.props;
    const date = dataToString(new Date());
    edit ||
      this.setState({
        date,
        items: this.itemsFromConfig(
          await this.fetchConfigFromDB(date, channelId)
        )
      });
  };

  componentWillReceiveProps = async nextProps => {
    const { channelId } = this.props;
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

      // this.fetchItems(date);
      // this.askForConfig(date, name);

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
          items: this.itemsFromConfig(
            await this.fetchConfigFromDB(date, channelId)
          )
        },
        () => this.count()
      );
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

    if (bonusType === "% marży") {
      const marginUnit = sell - buy;
      const gross = sell * quantity;
      const grossMargin = marginUnit * quantity;
      const bonus = grossMargin * bonusUnit;
      this.validate(bonus);
      this.setState({ marginUnit, gross, grossMargin, bonus });
    } else if (bonusType === "stawka") {
      const bonus = bonusUnit * quantity;
      this.validate(bonus);
      this.setState({ bonus });
    }
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

  getConfig = async (date, id) => {
    const { items } = this.state;
    const configs = _.clone(items);
    this.clearSummary();
    this.setState({ buy: "0", sell: null });
    const config = configs.filter(x => x.id === id);

    // const oldType = this.state.bonusType;
    // const result = await axios.get(
    //   // `/api/config/channels/${this.monthKey(date)}/${name}`
    //   `/api/config/channels/${date}/${name}`
    // );
    // const unitFetch = await axios.get(`/api/item/channels/${name}`);

    const { bonus, bonusType, unit } = config[0];
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

  handleSubmit = async e => {
    const { channelId } = this.props;
    let url;

    if (this.props.edit) {
      url = `/api/transaction/edit/id/${this.props.edit.id}`;
    } else {
      url = "/api/transaction";
    }

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
    // const data = await resp.json();
    // await this.props.changeRange(data);
    await this.props.fetch();
    // await this.clearForm();
    // await this.props.submit(false);
  };

  handleChange = (field, value, props) => {
    console.log("handleChange", field, value, props);

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
        () => {
          this.getConfig(date, value.id);
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
        name: x["Item.name"],
        unit: x["Item.unit"]
      })
    );

  fetchConfig = async (value, props) => {
    // props.setFieldValue("date", value);
    const { date } = this.state;
    const { channelId } = this.props;
    console.log("fetchConfig()", channelId, date, value, date !== value);
    if (date !== value) {
      const response = await this.fetchConfigFromDB(value, channelId);

      console.log("fetchConfig response", response, props);
      this.setState(
        {
          date: value,
          items: this.itemsFromConfig(response)
          // dateWithConfig: true
        },
        () => {
          props.setFieldValue("date", value);
        }
      );
      // : this.setState({ dateWithConfig: false });
      return !!response.data;
    }
  };

  fetchConfigFromDB = async (value, channelId) => {
    const result = await axios.get(
      `/api/config/month_channel/${value}/${channelId}`
    );
    return result.data;
  };

  render() {
    const { edit, modal, channelId } = this.props;
    const { dateWithConfig, items } = this.state;

    const validationSchemaFlat = props => {
      return {
        // date: Yup.string().required("Podaj prawidłową datę"),
        date: Yup.mixed().test("a", "Podaj prawidłową datę", value => {
          console.log("date validate", items, items.length, items.length > 0);
          // return this.fetchConfig(value);
          return items.length > 0;
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
              items: edit ? { name: `${edit.name}` } : { name: "" },
              date: edit ? edit.date : dataToString(new Date()),
              customer: edit ? edit.customer : "",
              city: edit
                ? { name: `${edit.cityName}`, id: `${edit.city}` }
                : { name: "", id: 1 },
              quantity: edit ? edit.quantity : "1",
              buy: edit ? `${edit.buy}` : "",
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
                    <Grid item xs={3}>
                      <InputData
                        id="date"
                        name="date"
                        label={
                          props.touched.date && props.errors.date
                            ? props.errors.date
                            : "Data transakcji"
                        }
                        type="date"
                        value={props.values.date}
                        edytuj={value => {
                          // props.setFieldValue("date", value);
                          this.handleChange("date", value, props);
                          // this.fetchItems(value);
                          props.setFieldTouched("date", true);
                        }}
                        error={props.touched.date && Boolean(props.errors.date)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputSelectBaza
                        error={
                          props.touched.items && Boolean(props.errors.items)
                        }
                        daty={daty => {}}
                        wybrano={item => {
                          item.id && props.setFieldValue("items", item);
                          this.handleChange("items", item);
                          props.setFieldTouched("items", true);
                        }}
                        edytuj={edytuj => {
                          edytuj.id ||
                            props.setFieldValue("items", {
                              name: edytuj,
                              id: 0
                            });
                          props.setFieldTouched("items", true);
                        }}
                        czysc={() => {
                          props.setFieldValue("items", { name: "", id: 0 });
                          this.setState({ name: null, item: null });
                        }}
                        value={props.values.items.name}
                        label={
                          props.touched.items && props.errors.items
                            ? props.errors.items
                            : "Towar/Usługa"
                        }
                        przeszukuje={this.state.items}
                        name="items"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <InputComponent
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
                            : "Ilość"
                        }
                        type="text"
                        edytuj={value => {
                          props.setFieldValue("quantity", value);
                          // this.setState({ quantity: value });
                          props.setFieldTouched("quantity", true);
                          this.handleChange("quantity", value);
                        }}
                        value={props.values.quantity}
                      />
                    </Grid>
                    <Grid item xs={6}>
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
                          this.handleChange("customer", value);
                          props.setFieldTouched("customer", true);
                        }}
                        error={
                          props.touched.customer &&
                          Boolean(props.errors.customer)
                        }
                        value={props.values.customer}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <CitySearch
                        miejsceLabel={props.values.city.name}
                        edytuj={id => {
                          this.handleChange("cityId", id);

                          props.values.city.name &&
                            props.setFieldTouched("city", true);
                        }}
                        wybranoLabel={wybranoLabel => {
                          props.setFieldValue("city", {
                            name: wybranoLabel
                          });
                          this.setState({ cityName: wybranoLabel });
                        }}
                        error={props.touched.city && Boolean(props.errors.city)}
                        label={
                          props.touched.city && props.errors.city
                            ? props.errors.city
                            : "Miejscowość"
                        }
                        places
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputComponent
                        disabled={bonusType !== "% marży"}
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
                        value={props.values.buy}
                      />
                      {/* <InputComponent
                        // disabled={bonusType !== "% marży"}
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
                          props.setFieldTouched("buy", true);
                          this.handleChange("buy", value);
                        }}
                        value={this.state.buy}
                      /> */}
                    </Grid>
                    <Grid item xs={6}>
                      <InputComponent
                        disabled={bonusType !== "% marży"}
                        format="sell"
                        suffix="zł"
                        name="sell"
                        error={props.touched.sell && Boolean(props.errors.sell)}
                        label={
                          props.touched.sell && props.errors.sell
                            ? props.errors.sell
                            : "Cena sprzedaży jedn. brutto"
                        }
                        type="text"
                        edytuj={value => {
                          props.setFieldValue("sell", value);
                          // this.setState({ sell: value });
                          props.setFieldTouched("sell", true);
                          this.handleChange("sell", value);
                        }}
                        value={props.values.sell}
                      />
                    </Grid>
                  </Grid>

                  <FormButtons
                    subDisable={
                      props.isValid ? (submitIsDisable ? true : false) : true
                    }
                    subLabel={
                      modal && edit
                        ? "Potwierdź edycję"
                        : bonus > 0
                        ? `Dodaj premię ${formatNumber(bonus)} zł`
                        : "Potwierdź"
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
                    cancelLabel={"Anuluj"}
                    cancelAction={() => {
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
          <SerwisSummary
            bonus={bonus}
            bonusType={bonusType}
            marginUnit={marginUnit}
            gross={gross}
            grossMargin={grossMargin}
            bonusUnit={bonusUnit}
          />
        </Paper>
      </div>
    );
  }
}

InputComponent.defaultProps = {
  modal: false
};

export default SerwisForm;
