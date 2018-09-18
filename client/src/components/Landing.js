import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Costs from "./Costs";
import Planer from "./Planer";
import PlanerRaporty from "./PlanerRaporty";

class Landing extends Component {
  componentWillMount() {
    console.log(this.props.clicked);
  }

  whatToShow = () => {
    switch (this.props.clicked) {
      case "costs":
        return <Costs />;
      //break;
      case "planer":
        return <Planer />;
      //  break;
      case "planerRaporty":
        return <PlanerRaporty />;
      //break;
      default:
        return (
          <div style={{ textAlign: "center" }}>
            <h1>Świadoma Firma</h1>
            Raporty, analizy, prowizje - wszystko w jednym miejscu
          </div>
        );
    }
  };

  render() {
    return this.whatToShow();
    // return (
    //   <BrowserRouter>
    //     <div>
    //       <Route path="/costs" component={Costs} />
    //       <Route path="/planer" component={Planer} />
    //       <Route path="/planerRaporty" component={PlanerRaporty} />
    //     </div>
    //   </BrowserRouter>
    // );
  }
}

function mapStateToProps({ clicked }) {
  return { clicked };
}

export default connect(mapStateToProps)(Landing);
