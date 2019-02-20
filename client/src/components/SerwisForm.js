import React, { useState } from "react";
import { Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputData from "../common/inputs/InputData";
import ButtonMy from "../common/ButtonMy";
import CitySearch from "./CitiesSearch";
import Send from "@material-ui/icons/Send";

const handleSubmit = (values, cityId) => {
  values.city.id = cityId;
  console.log("handleSubmit", values);
};

const SerwisForm = () => {
  const [cityId, setCityId] = useState(1);
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
          console.log("propsy w SerwisForm()", cityId);
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
                    edytuj={value => props.setFieldValue("date", value)}
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
                      setCityId(id);
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
                <Grid item xs={4}>
                  <InputComponent
                    format="number"
                    name="quantity"
                    label="Ilość"
                    type="text"
                    edytuj={value => props.setFieldValue("quantity", value)}
                    // onChange={props.handleChange}
                    value={props.values.quantity}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputComponent
                    format="zl"
                    name="buy"
                    label="Cena zakupu jednostki brutto"
                    type="text"
                    edytuj={value => props.setFieldValue("buy", value)}
                    // onChange={props.handleChange}
                    value={props.values.buy}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputComponent
                    format="zl"
                    name="sell"
                    label="Cena sprzedaży jednostki brutto"
                    type="text"
                    edytuj={value => props.setFieldValue("sell", value)}
                    // onChange={props.handleChange}
                    value={props.values.sell}
                  />
                </Grid>
              </Grid>
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
                  handleSubmit(props.values, cityId)
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
};

export default SerwisForm;
