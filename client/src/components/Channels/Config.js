import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";
// import SimpleProductList from "./SimpleProductList";
import FormWithListClicks from "../../common/FormWithListClicks";
import Slide from "@material-ui/core/Slide";
import ProductsList from "../Products/ProductsList";
import ConfigForm from "./Config/ConfigForm";
import { getString } from "../../translate";

class Config extends Component {
  // state = { itemsConfig: true };
  state = { items: null, overlaps: [], editedId: 0 };

  itemsToState = items => this.setState({ items });
  handleOverlapsing = overlaps => this.setState({ overlaps });
  editedIdSend = editedId => this.setState({ editedId });

  render() {
    const { items, overlaps, editedId } = this.state;
    const {
      data,
      rowClick,
      label,
      showChild,
      hideChild,
      channelId,
      itemId,
      itemName,
      channelName,
      fetchAfterHide,
      language
    } = this.props;
    // console.log("data", data);
    return (
      <div
        style={{
          display: "grid"
          // gridTemplateColumns: "minmax(200px, 1fr) 2fr",
          // gridGap: "1rem"
        }}
      >
        <Paper>
          {!data || data.length === 0 ? (
            <div
              style={{
                padding: "1.3rem",
                maxWidth: 700,
                display: "grid"
              }}
            >
              <h6 style={{ textTransform: "uppercase" }}>
                {getString("CONFIG_MISSING_ITEMS", language)}
              </h6>
              <p style={{ marginTop: 20 }}>
                {getString("CONFIG_MISSING_INSTRUCTION", language)}
              </p>
            </div>
          ) : (
            <ProductsList
              showChild={showChild}
              disableEdit
              disableDelete
              searchColumns={["name", "config"]}
              // clickOnChannel={this.handleClickOnChannel}
              // delete={this.handleDelete}
              transactions={data}
              // headCols={this.state.channels}
              // edit={this.handleEdit}
              clickOnRow={rowClick}
              // editedId={editedId}
              // change={this.handleChange}
              // values={editing}
              // value={value}
              // disableSubmit={disableSubmit["editing"]}
              // onSubmit={this.handleSubmit}
              labelList={`${getString(
                "CONFIG_TABLE_LABEL",
                language
              )} ${label}`}
              rowType={"productsInChannel"}
              headCols={[]}
              headRow={[
                {
                  id: "name",
                  numeric: false,
                  disablePadding: true,
                  label: getString("ITEMNAME", language)
                },
                {
                  id: "unit",
                  numeric: false,
                  disablePadding: true,
                  label: getString("UNIT", language)
                },
                {
                  id: "config",
                  numeric: false,
                  disablePadding: true,
                  label: getString("CONFIGURATION", language)
                }
              ]}
            >
              <Slide
                direction="left"
                in={showChild}
                mountOnEnter
                unmountOnExit
                timeout={300}
                style={{
                  // gridRow: "2 / 4",
                  // gridColumn: "2 /4",
                  // backgroundColor: "yellow",
                  // opacity: 0.5,
                  // height: 200,
                  // width: 222,
                  // right: 23,
                  // position: "absolute"
                  // backgroundColor: "green",
                  // opacity: 1,
                  // height: "100%",
                  width: "100%",
                  // position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 23
                }}
              >
                <Paper
                  // elevation={4}
                  style={{ display: "grid", gridTemplateColumns: "13px 1fr" }}
                >
                  <Button
                    onClick={() => {
                      hideChild();
                      fetchAfterHide();
                    }}
                    style={{
                      height: "100%",
                      // backgroundColor: "grey",
                      zIndex: 24,
                      minWidth: 10
                    }}
                  >
                    <ChevronRight />
                  </Button>
                  <div>
                    <FormWithListClicks
                      editedIdSend={this.editedIdSend}
                      overlaps={overlaps}
                      itemsToState={this.itemsToState}
                      searchColumns={["bonusType", "bonus", "from", "to"]}
                      rowClick={id => console.log("rowClick in config", id)}
                      postUrl="/api/channels_config/"
                      fetchItemsUrl={`/api/channel_config_new/itemchannel/id/${itemId}/${channelId}`}
                      // fetchChannels="/api/channels"
                      editUrl="/api/channel_config/edit/id/"
                      deleteUrl="/api/channel_config/destroy/"
                      manyOne="channel"
                      manyTwo="user"
                      formFields={[
                        "from",
                        "to",
                        "bonusType",
                        "bonus",
                        "channelId",
                        "itemId"
                      ]}
                      editFields={["from", "to", "bonusType", "bonus"]}
                      headRow={[
                        {
                          id: "from",
                          numeric: false,
                          disablePadding: true,
                          label: getString("SINCE", language)
                        },
                        {
                          id: "to",
                          numeric: false,
                          disablePadding: true,
                          label: getString("TO", language)
                        },
                        {
                          id: "bonusType",
                          numeric: false,
                          disablePadding: true,
                          label: getString("TYPE", language)
                        },
                        {
                          id: "bonus",
                          numeric: true,
                          disablePadding: true,
                          label: getString("BONUS", language)
                        }
                      ]}
                      rowType="channelConfig"
                      modal
                    >
                      {/* <ModalWindow
                      open={this.state.openModal}
                      close={this.handleClose}
                      maxWidth={900}
                    >
                    </ModalWindow> */}
                      {/* <Form addLabel={"Dodaj"} activity="adding" />
                    <EditUserForm addLabel={"Dodaj"} activity="editing" /> */}
                      <ConfigForm
                        // label={`Skonfiguruj prowizje dla ${itemName} w ${channelName}`}
                        itemName={itemName}
                        channelName={channelName}
                        activity="adding"
                        channelId={channelId}
                        itemId={itemId}
                        items={items}
                        overlapsing={this.handleOverlapsing}
                      />
                      <ConfigForm
                        label={`${getString(
                          "CONFIG_FORM_LABEL",
                          language
                        )} ${itemName} ${getString(
                          "IN",
                          language
                        )} ${channelName}`}
                        activity="editing"
                        channelId={channelId}
                        itemId={itemId}
                        items={items}
                        overlapsing={this.handleOverlapsing}
                        editedId={editedId}
                      />
                    </FormWithListClicks>
                  </div>
                </Paper>
              </Slide>
            </ProductsList>
          )}
        </Paper>
      </div>
    );
  }
}

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(Config);
