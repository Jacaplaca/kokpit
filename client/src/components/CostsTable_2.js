import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, {
  textFilter,
  numberFilter,
  multiSelectFilter,
  customFilter
} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import currency from 'currency.js';
import overlayFactory from 'react-bootstrap-table2-overlay';
// import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import PriceFilter from './PriceFilter';
// import Costs from './Costs';

// const products = [{ id: 1, name: 'kalda', price: 2344 }];

let ammount = 0;
let qualityFilter;

class CostsTable extends Component {
  state = {
    column1Filter: '',
    column2Filter: '',
    ammount: ''
  };

  componentDidMount() {
    console.log('didmount');
    console.log(this.table);
  }

  componentDidUpdate() {
    console.log('did update');
    ammount = 0;
    // console.log(qualityFilter);
  }
  componentWillUpdate() {
    console.log('will update');
    ammount = 0;
    // console.log(qualityFilter);
  }
  //
  // shouldComponentUpdate() {
  //   console.log('should component update');
  // }
  //
  componentWillUnmount() {
    console.log('will unmount');
  }
  //
  componentDidCatch() {
    console.log('catch');
  }

  handleDelete = id => {
    console.log('handleDelete');
    console.log(id);

    const url = `/api/cost/remove/${id}`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      this.props.fetch();
    });
  };

  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  mulitSelect = (data, kolumna) => {
    let mulitSelect = {};
    const nieUnikalneKategorie = data.map((el, i) => el[kolumna].name);
    const unikalne = nieUnikalneKategorie.filter(this.onlyUnique);
    unikalne.map((x, i) => Object.assign(mulitSelect, { [x]: x }));
    return mulitSelect;
  };

  handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
    //... your stuff on here
    console.log('on search');
  };

  selectInput = () => {
    console.log('cos laksdjflaskdj asldkfjasl;dkf');
  };

  render() {
    const podlicz = () => {
      console.log('kwoty');
      var list = document.getElementsByClassName('kwota');
      console.log(list);
      // for (var i = 0; i < list.length; i++) {
      //   console.log(list[i]); //second console output
      // }
    };
    const mojTextFilter = textFilter({
      placeholder: 'szukaj...' // custom the input placeholder
      // className: 'my-custom-text-filter', // custom classname on input
      // defaultValue: 'test', // default filtering value
      // comparator: Comparator.EQ, // default is Comparator.LIKE
      // caseSensitive: true, // default is false, and true will only work when comparator is LIKE
      // style: { ... }, // your custom styles on input
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

    const columnStyleMain = {
      verticalAlign: 'middle',
      // padding: '0.1rem'
      paddingLeft: 5,
      paddingTop: 0,
      paddingBottom: 0
    };

    const columnStyleKwota = {
      verticalAlign: 'middle',
      // padding: '0.1rem'
      paddingLeft: 5,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: 17,
      fontWeight: 600,
      textAlign: 'center'
    };

    // const columnStyleSpecial = { fontSize: 16, fontWeight: 600 };

    // const columnStyle = Object.assign(columnStyleMain, columnStyleSpecial);

    const columns = [
      {
        dataField: 'nr_dokumentu',
        text: 'Nr dokumentu',
        // filter: mojTextFilter,
        filter: textFilter({
          className: 'my-nr_dokumentu',
          // getFilter: filter => {
          //   // filter(value)
          //   // console.log('asdfas');
          //   // this.setState.column1Filter = filter;
          //   // qualityFilter = filter;
          //   // () => console.log('filterowanie valueo');
          // }
          // getFilter: filter => {
          //   ammount = filter;
          // }
          getFilter: filterVal => {
            this.setState(() => ({ isSelected: filterVal !== '' }));
            this.selectInput.value = filterVal;
            this.setState(() => ({ nazwa: filterVal }));

            // onFilter(column, filterVal, FILTER_TYPE.SELECT) can be work, right?
            // onFilter(column, FILTER_TYPE.SELECT)(filterVal)
          }
        }),
        // onFilter: () => console.log('on filter'),
        // filter: textFilter({}),
        // filterRenderer: (onFilter, column) => console.log('adsf'),
        sort: true,
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleMain;
        },
        headerStyle: (colum, colIndex) => {
          return {
            width: '170px',
            textAlign: 'center',
            verticalAlign: 'middle'
          };
        }
      },
      {
        dataField: 'data_wystawienia',
        text: 'Data wystawienia',
        // filter: mojTextFilter,
        filter: textFilter({
          getFilter: filter => {
            this.setState.column2Filter = filter;
          }
        }),
        sort: true,
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleKwota;
        },
        headerStyle: (colum, colIndex) => {
          return { width: '170px', verticalAlign: 'middle' };
        }
      },
      {
        dataField: 'nazwa_pozycji',
        text: 'Nazwa',
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleMain;
        },
        headerStyle: (colum, colIndex) => {
          return { verticalAlign: 'middle' };
        },
        // filter: mojTextFilter,
        sort: true
      },
      {
        dataField: 'category.name',
        text: 'Kategoria',
        sort: true,
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleMain;
        },
        // headerEvents: {
        //   onClick: () => console.log('Click on Product ID header column')
        // },
        filter: multiSelectFilter({
          placeholder: 'wybierz...',
          // options: selectOptionsKategoria
          options: this.mulitSelect(this.props.costs, 'category'),
          onClick: e => console.log(e)
        })
      },
      {
        dataField: 'group.name',
        text: 'Grupa',
        sort: true,
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleMain;
        },
        filter: multiSelectFilter({
          placeholder: 'wybierz...',
          // options: selectOptionsKategoria
          options: this.mulitSelect(this.props.costs, 'group')
        })
      },
      {
        dataField: 'kwota_netto',
        text: 'Kwota netto',
        sort: true,
        classes: 'kwota',
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleKwota;
        },
        formatter: cell => {
          let liczba = cell;
          // liczba = cell.toString().replace('.', ',');
          // return `${liczba}`;
          return `${currency(cell, {
            separator: ' ',
            decimal: ','
          }).format()} zł`;
        },
        // filter: numberFilter({
        //   placeholder: 'wpisz...'
        // })
        filter: customFilter(),
        filterRenderer: (onFilter, column) => (
          <PriceFilter onFilter={onFilter} column={column} />
        )
      },
      {
        dataField: 'id',
        text: 'Suma: 152 975 zł',
        style: (cell, row, rowIndex, colIndex) => {
          return columnStyleKwota;
        },
        headerStyle: (colum, colIndex) => {
          return {
            width: '130px',
            textAlign: 'center',
            verticalAlign: 'middle'
          };
        },
        formatter: cell => {
          return (
            <div>
              <IconButton
                aria-label="Delete"
                onClick={() => this.handleDelete(cell)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="Edit"
                onClick={() => this.props.edit(cell)}>
                <EditIcon />
              </IconButton>
            </div>
          );
        }
      }
      // {
      //   dataField: 'id',
      //   text: '',
      //   formatter: cell => {
      //     return (
      //
      //     );
      //   }
      // }
    ];
    // const costsInt = this.props.costs.map(x =>
    //   Object.assign(x, { kwota_netto: parseFloat(x.kwota_netto) })
    // );

    const rowStyle = (row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: '#81c784'
        };
      } else {
        return {
          backgroundColor: '#c8e6c9'
        };
      }
    };

    // const options = {
    //   onFilterChange: (filterObj, columnsInfo) => {
    //     console.log('change');
    //   }
    // };

    const kwoty = () => {
      console.log('kwoty');
      var list = document.getElementsByClassName('kwota');
      console.log(list);
      for (var i = 0; i < list.length; i++) {
        console.log(list[i]); //second console output
      }
    };

    const clearInfo = () => {
      this.setState.column1Filter('');
      this.setState.column2Filter('');
    };

    const rowClasses = (row, rowIndex) => {
      // console.log(row.kwota_netto);
      var value = row.kwota_netto;
      // ammount.push(value);
      ammount = ammount + value;
      // console.log(ammount);
      // this.state({ammount: row.kwota_netto })

      // if (row.status !== 'Cancelado' && row.pagrec === 'Pagamento') {
      //   this.setState({ amount: (this.state.amount += value) });
      //   return;
      // }
    };

    return (
      <div>
        <button bsStyle="primary" bsSize="small" onClick={clearInfo}>
          Clear Filters
        </button>
        <BootstrapTable
          // remote={{
          //   filter: true
          //   // pagination: true,
          //   // sort: true,
          //   // cellEdit: true
          // }}
          // onTableChange={this.handleTableChange}
          // ref={ref => (this.table = ref)}
          // options={options}
          // loading={true} //only loading is true, react-bootstrap-table will render overlay
          // overlay={overlayFactory()}
          // overlay={overlayFactory({
          //   spinner: true,
          //   background: 'rgba(192,192,192,0.3)'
          // })}
          // overlay={() => console.log('adsfasdf')}
          // onTableChange={onTableChange}
          // cellEdit={cellEditFactory({ mode: 'click' })}
          keyField="id"
          data={this.props.costs}
          columns={columns}
          filter={filterFactory()}
          bootstrap4
          rowStyle={rowStyle}
          rowClasses={rowClasses}
          // remote={{
          //   filter: true,
          //   // pagination: true,
          //   filter: true,
          //   sort: true,
          //   cellEdit: true
          // }}
        />
      </div>
    );
  }
}

function mapStateToProps({ clicked }) {
  return { clicked };
}

export default connect(mapStateToProps)(CostsTable);
