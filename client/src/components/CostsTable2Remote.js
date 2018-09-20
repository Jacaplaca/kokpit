import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory, {
  textFilter,
  multiSelectFilter,
  numberFilter,
  Comparator
} from "react-bootstrap-table2-filter";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";
import currency from "currency.js";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FilterNoneIcon from "@material-ui/icons/FilterNone";

import Confirmation from "./Confirmation";

const styles = theme => ({
  headerClasses: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  // input: { margin: 12 },
  darkerRow: {
    // backgroundColor: theme.palette.primary.main
    backgroundColor: fade(theme.palette.primary.main, 0.15)
    // color: 'white'
  },
  lighterRow: {
    // backgroundColor: theme.palette.primary.main
    // backgroundColor: fade(theme.palette.primary.main, 0.3)
  },
  suma: {
    backgroundColor: theme.palette.primary.main
  }
});

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const mulitSelect = (data, kolumna) => {
  let mulitSelect = {};
  const nieUnikalneKategorie = data.map((el, i) => el[kolumna].name);
  const unikalne = nieUnikalneKategorie.filter(onlyUnique);
  unikalne.map((x, i) => Object.assign(mulitSelect, { [x]: x }));
  return mulitSelect;
};

const mojTextFilter = textFilter({
  placeholder: "szukaj...", // custom the input placeholder
  // className: 'my-custom-text-filter', // custom classname on input
  // defaultValue: 'test', // default filtering value
  // comparator: Comparator.EQ, // default is Comparator.LIKE
  // caseSensitive: true // default is false, and true will only work when comparator is LIKE
  style: { marginTop: 5 } // your custom styles on input
  // delay: 1000, // how long will trigger filtering after user typing, default is 500 ms
  // getFilter: e => console.log('asdasdfasdfasdf')
  // } // accept callback function and you can call it for filter programmtically
  // onFilter: () => console.log('sdafsdfasdfasdf')
  // onChangeValue: () => console.log('asdfasdfasdfasdfasfd')
  // onChange: e => console.log(e),
  // onClick: e => console.log(e)
  // getFilter: filter => {
  //   // nameFilter was assigned once the component has been mounted.
  //   nameFilter = filter;
  // }
});

const RemoteFilter = props => {
  const rowClasses = (row, rowIndex) => {
    // console.log(props.classes.darkerRow);
    if (rowIndex % 2 === 0) {
      return props.classes.lighterRow;
    } else {
      return props.classes.darkerRow;
      // return {
      //   backgroundColor: '#c8e6c9'
      // };
    }
  };

  const handleDeleteConfirm = id => {
    props.open();
    props.setDelete(id);
  };

  const handleDuplicateConfirm = id => {
    props.open();
    props.setDuplicate(id);
  };

  const columnStyleMain = {
    verticalAlign: "middle",
    // padding: '0.1rem'
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: 0
  };

  const columnStyleKwota = {
    verticalAlign: "middle",
    // padding: '0.1rem'
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 17,
    fontWeight: 600,
    textAlign: "center"
  };

  const columns = [
    {
      dataField: "nr_dokumentu",
      text: "Nr dokumentu",
      filter: mojTextFilter,
      sort: true,
      sortingHeaderStyle: {
        backgroundColor: "red"
      },
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      headerStyle: (colum, colIndex) => {
        return {
          width: "170px",
          // textAlign: 'center',
          verticalAlign: "bottom"
        };
      }
    },
    {
      dataField: "data_wystawienia",
      text: "Data wystawienia",
      filter: mojTextFilter,
      sort: true,
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleKwota;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "170px", verticalAlign: "bottom" };
      }
    },
    {
      dataField: "nazwa_pozycji",
      text: "Nazwa",
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      headerStyle: (colum, colIndex) => {
        return { verticalAlign: "bottom" };
      },
      filter: mojTextFilter,
      sort: true
    },
    {
      dataField: "category.name",
      text: "Kategoria",
      sort: true,
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      filter: multiSelectFilter({
        placeholder: "wszystko...",
        // options: selectOptionsKategoria
        style: { marginTop: 5 },
        options: mulitSelect(props.dataCalosc, "category"),
        onClick: e => console.log(e)
      })
    },
    {
      dataField: "group.name",
      text: "Grupa",
      sort: true,
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      // headerFormatter: (column, colIndex, { sortElement, filterElement }) => {
      //   return (
      //     <div style={{ display: 'flex', flexDirection: 'column' }}>
      //       {column.text}
      //       {sortElement}
      //       <span>as</span>
      //       {filterElement}
      //     </div>
      //   );
      // },
      filter: multiSelectFilter({
        placeholder: "wszystko...",
        style: { marginTop: 5 },
        // options: selectOptionsKategoria
        options: mulitSelect(props.dataCalosc, "group")
      })
    },
    {
      dataField: "kwota_netto",
      text: "Kwota netto",
      sort: true,
      classes: "kwota",
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleKwota;
      },
      headerStyle: (colum, colIndex) => {
        return { verticalAlign: "bottom" };
      },
      formatter: cell => {
        let liczba = cell;
        // liczba = cell.toString().replace('.', ',');
        // return `${liczba}`;
        return `${currency(cell, {
          separator: " ",
          decimal: ","
        }).format()} zł`;
      },
      filter: numberFilter({
        placeholder: "wpisz...",
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        style: { display: "inline-grid", marginTop: 5 },
        comparatorStyle: {}, // custom the style on comparator select
        // comparatorClassName: 'custom-comparator-class',  // custom the class on comparator select
        numberStyle: { margin: "0px", marginTop: 5, width: "100%" } // custom the style on number input/select
        // numberClassName: 'custom-number-class',  // custom the class on ber input/select
      })
      // filter: customFilter(),
      // filterRenderer: (onFilter, column) => (
      //   <PriceFilter onFilter={onFilter} column={column} />
      // )
    },
    {
      dataField: "id",
      text: `Suma: ${currency(props.suma, {
        separator: " ",
        decimal: ","
      }).format()} zł`,
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleKwota;
      },
      headerFormatter: (colum, colIndex) => {
        return (
          <div>
            <h4>Suma: </h4>
            <p>
              {`${currency(props.suma, {
                separator: " ",
                decimal: ","
              }).format()} zł`}
            </p>
          </div>
        );
      },
      headerStyle: (colum, colIndex) => {
        return {
          width: "170px",
          textAlign: "center",
          verticalAlign: "middle"
          // display: 'inline'
        };
      },
      formatter: cell => {
        return (
          <div>
            <IconButton
              aria-label="Delete"
              onClick={() => handleDeleteConfirm(cell)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="Edit" onClick={() => props.edit(cell)}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Duplicate"
              onClick={() => handleDuplicateConfirm(cell)}
            >
              <FilterNoneIcon />
            </IconButton>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <BootstrapTable
        bootstrap4
        remote={{ filter: true }}
        keyField="id"
        data={props.data}
        columns={columns}
        filter={filterFactory()}
        onTableChange={props.onTableChange}
        // rowStyle={rowStyle}
        rowClasses={rowClasses}
        headerClasses={props.classes.headerClasses}
      />
    </div>
  );
};

class CostsTable extends Component {
  //_isMounted = false;
  state = {
    data: [],
    suma: 0,
    open: false,
    deleteRow: null,
    duplicate: null
  };

  // componentDidMount() {
  //   this._isMounted = true;
  // }

  componentWillReceiveProps(nextProps) {
    console.log("costs table remote receive props");
    console.log(nextProps.costs);
    console.log(this.props.costs);
    // console.log('component props');
    // console.log(this.props);
    this.setState({
      data: this.props.costs,
      suma: this.sumuj(this.props.costs)
    });
    //this.receiveProps();
  }

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  // receiveProps() {
  //   if (this._isMounted) {
  //     console.log("cost table2remote is mounted");
  //     this.setState({
  //       data: this.props.costs,
  //       suma: this.sumuj(this.props.costs)
  //     });
  //   }
  // }

  handleTableChange = (type, { filters }) => {
    console.log(type);
    // console.log(JSON.stringify(filters));
    // console.log(filters);
    setTimeout(() => {
      // console.log("handleTableChange setTimeout");
      let result = [];
      // console.log(result);
      result = this.props.costs.filter(row => {
        let valid = true;
        for (const dataField in filters) {
          // console.log(filters);
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === "TEXT") {
            if (comparator === Comparator.LIKE) {
              valid =
                row[dataField]
                  .toString()
                  .toLowerCase()
                  .indexOf(filterVal.toLowerCase()) > -1;
            } else {
              valid = row[dataField] === filterVal.toLowerCase();
            }
          } else if (filterType === "MULTISELECT") {
            const pierwszy = dataField.split(".")[0];
            const drugi = dataField.split(".")[1];
            if (comparator === Comparator.LIKE) {
              valid = filterVal.includes(row[pierwszy][drugi]);
            } else {
              valid = filterVal.includes(row[pierwszy][drugi]);
            }
          } else if (filterType === "NUMBER") {
            const znak = filterVal.comparator;
            const operators = {
              "": function(a, b) {
                return;
              },
              "=": function(a, b) {
                return a === b;
              },
              "<": function(a, b) {
                return a < b;
              },
              ">": function(a, b) {
                return a > b;
              }
            };

            const liczba = Math.trunc(filterVal.number);
            if (comparator === Comparator.LIKE) {
              valid = operators[znak](row[dataField], liczba);
            } else {
              valid = operators[znak](row[dataField], liczba);
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      this.setState(() => ({
        data: result,
        suma: this.sumuj(result)
      }));
    }, 1000);
  };

  sumuj = koszty => {
    let suma = 0;
    koszty.map(x => {
      suma = x.kwota_netto + suma;
    });
    // console.log(suma);
    return suma;
  };

  //state.data pochodzi z filtrowania lub obecnie wyswietlane
  //props.costs z fetchowania

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDuplicate = () => {
    console.log("duplicate");
    axios.get(`/api/id/cost/${this.state.duplicate}`).then(result => {
      const {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      } = result.data;
      //e.preventDefault();

      const url = "/api/cost";

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          nr_dokumentu,
          data_wystawienia,
          nazwa_pozycji,
          kwota_netto,
          categoryId,
          groupId
        })
      })
        .then(resp => resp.json())
        .then(() => {
          this.props.fetch();
        })
        .then(() => {
          this.setState({ duplicate: null, open: false });
        });
    });
  };

  handleDelete = () => {
    // console.log("handleDelete");
    // console.log(id);

    const url = `/api/cost/remove/${this.state.deleteRow}`;
    this.setState({ deleteRow: null, open: false });
    fetch(url, {
      method: "POST",
      // body: JSON.stringify({ aa: 'aaa' }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    }).then(() => {
      this.props.fetch();
    });
  };

  jakieDane = () => {
    if (this.state.data.length === 0 || this.props.costs === this.state.data) {
      console.log("state.data = 0 lub props.cost = state.data");
      return { costs: this.props.costs, sumuj: this.sumuj(this.props.costs) };
    } else if (
      this.props.costs.length === this.state.data.length &&
      this.props.costs !== this.state.data
    ) {
      console.log("zmienila sie wartosc ale nie dlugosc tabeli bo byla edycja");
      return { costs: this.props.costs, sumuj: this.sumuj(this.props.costs) };
      // } else if (this.props.costs.length !== this.state.data.length) {
      //   console.log("inna dlugosc");
      //   return { costs: this.props.costs, sumuj: this.sumuj(this.props.costs) };
    } else {
      console.log("jakie dane rozne nie 0");
      return { costs: this.state.data, sumuj: this.sumuj(this.state.data) };
    }
  };

  render() {
    const { open, deleteRow } = this.state;
    console.log("koszty render");
    console.log(this.state.data);
    console.log(this.props.costs);
    return (
      <div>
        <Confirmation
          open={open}
          close={this.handleClose}
          action={deleteRow ? this.handleDelete : this.handleDuplicate}
          komunikat={
            deleteRow
              ? "Czy na pewno chcesz usunąć tę pozycję kosztową?"
              : "Czy na pewno chcesz powielić ten koszt?"
          }
        />
        <RemoteFilter
          data={this.jakieDane().costs}
          suma={this.jakieDane().sumuj}
          dataCalosc={this.props.costs}
          onTableChange={this.handleTableChange}
          fetch={() => this.props.fetch()}
          edit={id => this.props.edit(id)}
          setDelete={id => this.setState({ deleteRow: id })}
          setDuplicate={id => this.setState({ duplicate: id })}
          duplicate={this.state.duplicate}
          delete={deleteRow}
          open={() => this.setState({ open: true })}
          classes={this.props.classes}
        />
      </div>
    );
  }
}

// export default CostsTable;
export default withStyles(styles)(CostsTable);
