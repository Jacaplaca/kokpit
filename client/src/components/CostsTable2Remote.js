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
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import currency from "currency.js";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FilterNoneIcon from "@material-ui/icons/FilterNone";

import ButtonMy from "../common/ButtonMy";
import ButtonIconCircle from "../common/ButtonIconCircle";
import Confirmation from "./Confirmation";

let nrFilter;
let dataFilter;
let nazwaFilter;
let nettoFilter;
let bruttoFilter;
let categoryFilter;
let groupFilter;

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
  },
  icon: {
    borderRadius: 15,
    padding: 5,
    color: theme.palette.primary.main,
    "&:hover": {
      color: "white",
      background: theme.palette.primary.main
    }
  },
  labelIcon: {
    height: 4,
    fontSize: 5
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

const filterStyle = {
  marginTop: 5,
  fontSize: 14,
  padding: 3,
  borderRadius: 0
};

const mojTextFilter = {
  placeholder: "szukaj...", // custom the input placeholder
  // className: 'my-custom-text-filter', // custom classname on input
  // defaultValue: 'test', // default filtering value
  // comparator: Comparator.EQ, // default is Comparator.LIKE
  // caseSensitive: true // default is false, and true will only work when comparator is LIKE
  style: { ...filterStyle } // your custom styles on input
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
};

const mojNumberFilter = {
  placeholder: "wpisz...",
  //withoutEmptyComparatorOption: true, // dont render empty option for comparator
  //withoutEmptyNumberOption: true, // dont render empty option for numner select if it is defined
  comparators: [
    (Comparator.GT = ">"),
    (Comparator.LT = "<")
    // (Comparator.EQ = "a")
  ],
  style: { display: "inline-grid", marginTop: 5 },
  comparatorStyle: {
    ...filterStyle,
    width: "100%",
    textAlign: "center",
    // fontWeight: 800,
    // fontSize: 17,
    padding: 3
  }, // custom the style on comparator select
  numberStyle: { margin: "0px", width: "100%", ...filterStyle }
  //defaultValue: { number: 0, comparator: Comparator.GT } // custom the style on number input/select
};

const kwotaFormat = cell => {
  return `${currency(cell, {
    separator: " ",
    decimal: ","
  }).format()} zł`;
};

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

  const sumaHeaderFormat = (colum, colIndex) => {
    return (
      <div>
        <h6 style={{ ...headerStyle }}>Suma netto: </h6>
        <p>
          {`${currency(props.suma, {
            separator: " ",
            decimal: ","
          }).format()} zł`}
        </p>
      </div>
    );
  };

  const iconProps = {
    className: props.classes.icon,
    style: { fontSize: 30 }
  };

  const rowButtons = cell => {
    return (
      <div>
        <ButtonIconCircle akcja={() => handleDeleteConfirm(cell)}>
          <DeleteIcon {...iconProps} />
        </ButtonIconCircle>
        <ButtonIconCircle
          akcja={() => {
            props.edit(cell);
          }}
        >
          <EditIcon {...iconProps} />
        </ButtonIconCircle>
        <ButtonIconCircle akcja={() => props.duplicate(cell)}>
          <FilterNoneIcon {...iconProps} />
        </ButtonIconCircle>
      </div>
    );
  };

  const handleDeleteConfirm = id => {
    props.open();
    props.setDelete(id);
  };

  // const handleDuplicateConfirm = id => {
  //   props.open();
  //   props.setDuplicate(id);
  // };

  const headerStyle = {
    //verticalAlign: "bottom"
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase"
  };

  const columnStyleMain = {
    verticalAlign: "middle",
    // padding: '0.1rem'
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 14,
    overflowWrap: "break-word"
  };

  const columnStyleKwota = {
    //fontWeight: 600,
    textAlign: "center"
  };

  const columns = [
    {
      dataField: "nr_dokumentu",
      text: "Nr dokumentu",
      // filter: {
      //   ...mojTextFilter,
      //   getFilter: filter => {
      //     nrFilter = filter;
      //   }
      // },
      filter: textFilter({
        ...mojTextFilter,
        getFilter: filter => {
          nrFilter = filter;
        }
      }),
      // filter: textFilter({
      //   getFilter: filter => {
      //     nrFilter = filter;
      //   }
      // }),
      sort: true,
      sortingHeaderStyle: {
        backgroundColor: "red"
      },
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      headerStyle: (colum, colIndex) => {
        return {
          width: "140px",
          ...headerStyle
          // textAlign: 'center',
        };
      }
    },
    {
      dataField: "data_wystawienia",
      text: "Data wystawienia",
      filter: textFilter({
        ...mojTextFilter,
        getFilter: filter => {
          dataFilter = filter;
        }
      }),
      sort: true,
      // style: (cell, row, rowIndex, colIndex) => {
      //   return columnStyleKwota;
      // },
      style: { ...columnStyleMain, ...columnStyleKwota },
      headerStyle: (colum, colIndex) => {
        return { width: "130px", ...headerStyle };
      }
    },
    {
      dataField: "nazwa_pozycji",
      text: "Nazwa",
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      headerStyle: (colum, colIndex) => {
        return { ...headerStyle };
      },
      filter: textFilter({
        ...mojTextFilter,
        getFilter: filter => {
          nazwaFilter = filter;
        }
      }),
      sort: true
    },
    {
      dataField: "category.name",
      text: "Kategoria",
      sort: true,
      style: (cell, row, rowIndex, colIndex) => {
        return columnStyleMain;
      },
      headerStyle: (colum, colIndex) => {
        return { ...headerStyle };
      },
      filter: multiSelectFilter({
        getFilter: filter => {
          categoryFilter = filter;
        },
        placeholder: "wszystko...",
        // options: selectOptionsKategoria
        style: { ...filterStyle },
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
      headerStyle: (colum, colIndex) => {
        return { ...headerStyle };
      },
      filter: multiSelectFilter({
        getFilter: filter => {
          groupFilter = filter;
        },
        placeholder: "wszystko...",
        style: { ...filterStyle },
        // options: selectOptionsKategoria
        options: mulitSelect(props.dataCalosc, "group")
      })
    },
    {
      dataField: "kwota_netto",
      text: "Kwota netto",
      sort: true,
      classes: "kwota",
      style: { ...columnStyleMain, ...columnStyleKwota },
      headerStyle: (colum, colIndex) => {
        return { ...headerStyle };
      },
      formatter: kwotaFormat,
      filter: numberFilter({
        ...mojNumberFilter,
        getFilter: filter => {
          nettoFilter = filter;
        }
      })
    },
    {
      dataField: "kwota_brutto",
      text: "Kwota brutto",
      sort: true,
      classes: "kwota",
      style: { ...columnStyleMain, ...columnStyleKwota },
      headerStyle: (colum, colIndex) => {
        return { ...headerStyle };
      },
      formatter: kwotaFormat,
      filter: numberFilter({
        ...mojNumberFilter,
        getFilter: filter => {
          bruttoFilter = filter;
        }
      })
    },
    {
      dataField: "id",
      text: `Suma: ${currency(props.suma, {
        separator: " ",
        decimal: ","
      }).format()} zł`,
      style: { ...columnStyleMain, ...columnStyleKwota },
      headerFormatter: sumaHeaderFormat,
      headerStyle: (colum, colIndex) => {
        return {
          width: "135px",
          textAlign: "center",
          verticalAlign: "middle"
          // display: 'inline'
        };
      },
      formatter: rowButtons
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
    //fetchTemporary: true
  };

  handleTableChange = (type, { filters }) => {
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
            console.log(znak);
            const operators = {
              undefined: function(a, b) {
                return;
              },
              "": function(a, b) {
                return;
              },
              a: function(a, b) {
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
            // console.log(liczba);
            // console.log(comparator);
            // liczba = isNaN(liczba) ? 0 : Math.trunc(filterVal.number);
            if (comparator === Comparator.LIKE) {
              valid = !znak ? true : operators[znak](row[dataField], liczba);
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
        suma: this.sumuj(result),
        fetchTemporary: false
      }));
    }, 500);
  };

  sumuj = koszty => {
    let suma = 0;
    koszty.map(x => {
      suma = x.kwota_netto + suma;
    });
    // console.log(suma);
    return suma;
  };

  //props.costs z fetchowania
  //state.data pochodzi z filtrowania lub obecnie wyswietlane

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete = () => {
    const url = `/api/cost/remove/${this.state.deleteRow}`;
    this.setState({ deleteRow: null, open: false });
    fetch(url, {
      method: "POST",
      // body: JSON.stringify({ aa: 'aaa' }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    }).then(() => {
      this.props.fetch();
      this.setState({ fetchTemporary: true });
    });
  };

  jakieDane = () => {
    if (this.state.fetchTemporary) {
      return { costs: this.props.costs, sumuj: this.sumuj(this.props.costs) };
    } else {
      return { costs: this.state.data, sumuj: this.sumuj(this.state.data) };
    }
  };

  cleanFilters = () => {
    nrFilter("");
    dataFilter("");
    nazwaFilter("");
    nettoFilter("");
    bruttoFilter("");
    categoryFilter("");
    groupFilter("");
    //domyslnaLiczbaFilter = 0;
  };

  render() {
    const { open, deleteRow } = this.state;
    return (
      <div>
        <Confirmation
          open={open}
          close={this.handleClose}
          action={this.handleDelete}
          komunikat={"Czy na pewno chcesz usunąć tę pozycję kosztową?"}
        />
        <ButtonMy
          onClick={() => this.cleanFilters()}
          style={{
            // position: "absolute",
            // right: "50px",
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10
          }}
          size="small"
          //disabled={day.values[0].wyslano ? true : false}
        >
          Czyść filtry
        </ButtonMy>

        <RemoteFilter
          data={this.jakieDane().costs}
          suma={this.jakieDane().sumuj}
          dataCalosc={this.props.costs}
          onTableChange={this.handleTableChange}
          fetch={() => this.props.fetch()}
          edit={id => {
            this.setState({ fetchTemporary: true });
            this.props.edit(id);
          }}
          duplicate={id => {
            this.setState({ fetchTemporary: true });
            this.props.duplicate(id);
          }}
          setDelete={id => this.setState({ deleteRow: id })}
          //setDuplicate={id => this.setState({ duplicate: id })}
          //duplicate={this.state.duplicate}
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
