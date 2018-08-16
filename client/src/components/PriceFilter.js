import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  customFilter
} from 'react-bootstrap-table2-filter';

class PriceFilter extends Component {
  // static propTypes = {
  //   column: PropTypes.object.isRequired,
  //   onFilter: PropTypes.func.isRequired
  // }
  // constructor(props) {
  //   super(props);
  //   this.filter = this.filter.bind(this);
  //   this.getValue = this.getValue.bind(this);
  // }
  getValue = () => {
    return this.input.value;
  };
  filter = () => {
    this.props.onFilter(this.getValue());
  };
  render() {
    return [
      <input
        key="input"
        ref={node => (this.input = node)}
        type="text"
        placeholder="Input price"
      />,
      <button key="submit" className="btn btn-warning" onClick={this.filter}>
        {`Filter ${this.props.column.text}`}
      </button>
    ];
  }
}

export default PriceFilter;
