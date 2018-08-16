import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import BootstrapTable from 'react-bootstrap-table-next';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import filterFactory, {
//   textFilter,
//   numberFilter,
//   multiSelectFilter
// } from 'react-bootstrap-table2-filter';
// import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
// import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import currency from 'currency.js';
// import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.css';
// import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
// import Costs from './Costs';

// const products = [{ id: 1, name: 'kalda', price: 2344 }];

class CostsTable extends Component {
  // componentDidUpdate() {
  //   console.log('didmount');
  // }

  // handleDelete = id => {
  //   console.log('handleDelete');
  //   console.log(id);
  //
  //   const url = `/api/cost/remove/${id}`;
  //   fetch(url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' }
  //   }).then(() => {
  //     this.props.fetch();
  //   });
  // };
  //
  // onlyUnique = (value, index, self) => {
  //   return self.indexOf(value) === index;
  // };
  //
  // mulitSelect = (data, kolumna) => {
  //   let mulitSelect = {};
  //   const nieUnikalneKategorie = data.map((el, i) => el[kolumna].name);
  //   const unikalne = nieUnikalneKategorie.filter(this.onlyUnique);
  //   unikalne.map((x, i) => Object.assign(mulitSelect, { [x]: x }));
  //   return mulitSelect;
  // };
  //
  // handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
  //   //... your stuff on here
  //   console.log('on search');
  // };

  render() {
    // const podlicz = () => {
    //   console.log('kwoty');
    //   var list = document.getElementsByClassName('kwota');
    //   console.log(list);
    //   // for (var i = 0; i < list.length; i++) {
    //   //   console.log(list[i]); //second console output
    //   // }
    // };
    // const mojTextFilter = textFilter({
    //   placeholder: 'szukaj...' // custom the input placeholder
    //   // className: 'my-custom-text-filter', // custom classname on input
    //   // defaultValue: 'test', // default filtering value
    //   // comparator: Comparator.EQ, // default is Comparator.LIKE
    //   // caseSensitive: true, // default is false, and true will only work when comparator is LIKE
    //   // style: { ... }, // your custom styles on input
    //   // delay: 1000, // how long will trigger filtering after user typing, default is 500 ms
    //   // getFilter: f => {
    //   //   console.log('nanana');
    //   // } // accept callback function and you can call it for filter programmtically
    //   // onFilter: () => console.log('sdafsdfasdfasdf')
    // });
    //
    // const columnStyleMain = {
    //   verticalAlign: 'middle',
    //   // padding: '0.1rem'
    //   paddingLeft: 5,
    //   paddingTop: 0,
    //   paddingBottom: 0
    // };
    //
    // const columnStyleKwota = {
    //   verticalAlign: 'middle',
    //   // padding: '0.1rem'
    //   paddingLeft: 5,
    //   paddingTop: 0,
    //   paddingBottom: 0,
    //   fontSize: 17,
    //   fontWeight: 600,
    //   textAlign: 'center'
    // };
    //
    // // const columnStyleSpecial = { fontSize: 16, fontWeight: 600 };
    //
    // // const columnStyle = Object.assign(columnStyleMain, columnStyleSpecial);
    //
    // const columns = [
    //   {
    //     dataField: 'nr_dokumentu',
    //     text: 'Nr dokumentu',
    //     filter: mojTextFilter,
    //     // onFilter: () => console.log('on filter'),
    //     // filter: textFilter({}),
    //     // filterRenderer: (onFilter, column) => console.log('adsf'),
    //     sort: true,
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleMain;
    //     },
    //     headerStyle: (colum, colIndex) => {
    //       return {
    //         width: '170px',
    //         textAlign: 'center',
    //         verticalAlign: 'middle'
    //       };
    //     }
    //   },
    //   {
    //     dataField: 'data_wystawienia',
    //     text: 'Data wystawienia',
    //     filter: mojTextFilter,
    //     sort: true,
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleKwota;
    //     },
    //     headerStyle: (colum, colIndex) => {
    //       return { width: '170px', verticalAlign: 'middle' };
    //     }
    //   },
    //   {
    //     dataField: 'nazwa_pozycji',
    //     text: 'Nazwa',
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleMain;
    //     },
    //     headerStyle: (colum, colIndex) => {
    //       return { verticalAlign: 'middle' };
    //     },
    //     filter: mojTextFilter,
    //     sort: true
    //   },
    //   {
    //     dataField: 'category.name',
    //     text: 'Kategoria',
    //     sort: true,
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleMain;
    //     },
    //     // headerEvents: {
    //     //   onClick: () => console.log('Click on Product ID header column')
    //     // },
    //     filter: multiSelectFilter({
    //       placeholder: 'wybierz...',
    //       // options: selectOptionsKategoria
    //       options: this.mulitSelect(this.props.costs, 'category')
    //     })
    //   },
    //   {
    //     dataField: 'group.name',
    //     text: 'Grupa',
    //     sort: true,
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleMain;
    //     },
    //     filter: multiSelectFilter({
    //       placeholder: 'wybierz...',
    //       // options: selectOptionsKategoria
    //       options: this.mulitSelect(this.props.costs, 'group')
    //     })
    //   },
    //   {
    //     dataField: 'kwota_netto',
    //     text: 'Kwota netto',
    //     sort: true,
    //     classes: 'kwota',
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleKwota;
    //     },
    //     formatter: cell => {
    //       let liczba = cell;
    //       // liczba = cell.toString().replace('.', ',');
    //       // return `${liczba}`;
    //       return `${currency(cell, {
    //         separator: ' ',
    //         decimal: ','
    //       }).format()} zł`;
    //     },
    //     filter: numberFilter({
    //       placeholder: 'wpisz...'
    //     })
    //   },
    //   {
    //     dataField: 'id',
    //     text: 'Suma: 152 975 zł',
    //     style: (cell, row, rowIndex, colIndex) => {
    //       return columnStyleKwota;
    //     },
    //     headerStyle: (colum, colIndex) => {
    //       return {
    //         width: '130px',
    //         textAlign: 'center',
    //         verticalAlign: 'middle'
    //       };
    //     },
    //     formatter: cell => {
    //       return (
    //         <div>
    //           <IconButton
    //             aria-label="Delete"
    //             onClick={() => this.handleDelete(cell)}>
    //             <DeleteIcon />
    //           </IconButton>
    //           <IconButton
    //             aria-label="Edit"
    //             onClick={() => this.props.edit(cell)}>
    //             <EditIcon />
    //           </IconButton>
    //         </div>
    //       );
    //     }
    //   }
    //   // {
    //   //   dataField: 'id',
    //   //   text: '',
    //   //   formatter: cell => {
    //   //     return (
    //   //
    //   //     );
    //   //   }
    //   // }
    // ];
    // // const costsInt = this.props.costs.map(x =>
    // //   Object.assign(x, { kwota_netto: parseFloat(x.kwota_netto) })
    // // );
    //
    // const rowStyle = (row, rowIndex) => {
    //   if (rowIndex % 2 === 0) {
    //     return {
    //       backgroundColor: '#81c784'
    //     };
    //   } else {
    //     return {
    //       backgroundColor: '#c8e6c9'
    //     };
    //   }
    // };
    //
    // const options = {
    //   onFilterChange: (filterObj, columnsInfo) => {
    //     console.log('change');
    //   }
    // };
    //
    // const kwoty = () => {
    //   console.log('kwoty');
    //   var list = document.getElementsByClassName('kwota');
    //   console.log(list);
    //   for (var i = 0; i < list.length; i++) {
    //     console.log(list[i]); //second console output
    //   }
    // };

    var products = [
      {
        id: 1,
        name: 'Item name 1',
        price: 100
      },
      {
        id: 2,
        name: 'Item name 2',
        price: 100
      }
    ];
    // It's a data format example.
    function priceFormatter(cell, row) {
      return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
    }

    return (
      <BootstrapTable data={this.props.costs} striped={true} hover={true}>
        <TableHeaderColumn
          dataField="id"
          isKey={true}
          // dataAlign="center"
          dataSort={true}>
          Id
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="nr_dokumentu"
          // isKey={true}
          // dataAlign="center"
          dataSort={true}>
          Nr dokumentu
        </TableHeaderColumn>
        <TableHeaderColumn dataField="group[name]" dataSort={true}>
          Data wystawienia
        </TableHeaderColumn>
        <TableHeaderColumn dataField="nazwa_pozycji" dataSort={true}>
          Nazwa
        </TableHeaderColumn>
        <TableHeaderColumn dataField="category.name" dataSort={true}>
          Kategoria
        </TableHeaderColumn>
        {/* <TableHeaderColumn dataField="price" dataFormat={priceFormatter}>
          Product Price
        </TableHeaderColumn> */}
      </BootstrapTable>
      // <BootstrapTable
      //   options={options}
      //   // onTableChange={onTableChange}
      //   // cellEdit={cellEditFactory({ mode: 'click' })}
      //   keyField="id"
      //   data={this.props.costs}
      //   columns={columns}
      //   filter={filterFactory()}
      //   bootstrap4
      //   rowStyle={rowStyle}
      //   // remote={{
      //   //   filter: true,
      //   //   // pagination: true,
      //   //   filter: true,
      //   //   sort: true,
      //   //   cellEdit: true
      //   // }}
      // />
    );
  }
}

function mapStateToProps({ clicked }) {
  return { clicked };
}

export default connect(mapStateToProps)(CostsTable);
