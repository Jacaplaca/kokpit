import React from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MainFrameHOC from "../common/MainFrameHOC";
const host = window.location.hostname;

// const articleContent = `<a href="http://kokpit.swiadomafirma.pl/vitalzam/Kokpit wprowadzenie.docx" download>Kokpit - wprowadzenie</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Komunikat premiowy 201903.odt" download>Komunikat premiowy - marzec 2019r.</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Konfiguracja towarów 201903.xlsx" download>Konfiguracja towarów - marzec 2019r.</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Regulamin_premiowania_20190228.odt" download>Regulamin premiowania - 28 luty 2019r.</a></br>`;

const BonusRules = props => {
  console.log("propsbonus", props);
  return (
    <div>
      {/* <Markup content={articleContent} /> */}
      <td dangerouslySetInnerHTML={{ __html: props.auth.filesToDownload }} />
    </div>
  );
};

const styles = theme => ({});

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(BonusRules);
