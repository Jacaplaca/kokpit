import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";
// import SimpleProductList from "./SimpleProductList";
import FormWithListClicks from "../../common/FormWithListClicks";
import Slide from "@material-ui/core/Slide";
import ProductsList from "../Products/ProductsList";
import ConfigForm from "./Config/ConfigForm";

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
      channelName
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
                Brak usług/towarów przypisanych do systemu prowizyjnego.
              </h6>
              <p style={{ marginTop: 20 }}>
                Aby dodać elementy premiowane do poszczegółnych systemów udaje
                się w zakładkę "Produkty" i tam przy produkcie kliknij na
                wybrany system.
              </p>
            </div>
          ) : (
            <ProductsList
              showChild={showChild}
              disableEdit
              disableDelete
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
              labelList={`Lista produktów/usług ${label}`}
              rowType={"productsInChannel"}
              headCols={[]}
              headRow={[
                {
                  id: "name",
                  numeric: false,
                  disablePadding: true,
                  label: "Nazwa"
                },
                {
                  id: "config",
                  numeric: false,
                  disablePadding: true,
                  label: "Konfiguracja"
                }
                // {
                //   id: "unit",
                //   numeric: false,
                //   disablePadding: true,
                //   label: "Jednostka"
                // }
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
                    onClick={hideChild}
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
                          label: "Od"
                        },
                        {
                          id: "to",
                          numeric: false,
                          disablePadding: true,
                          label: "Do"
                        },
                        {
                          id: "bonusType",
                          numeric: false,
                          disablePadding: true,
                          label: "Typ"
                        },
                        {
                          id: "bonus",
                          numeric: true,
                          disablePadding: true,
                          label: "Prowizja"
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
                        label={`Edytuj prowizje dla ${itemName} w ${channelName}`}
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

export default Config;
