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

  render() {
    // const { itemsConfig } = this.state;
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
    return (
      <Paper>
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
              position: "absolute",
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
                  rowClick={id => console.log(id)}
                  postUrl="/api/channels_config/"
                  fetchItemsUrl={`/api/channel_config_new/item/id/${itemId}/`}
                  // fetchChannels="/api/channels"
                  editUrl="/auth/user/edit/id/"
                  deleteUrl="/api/user/destroy/"
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
                    label={`Skonfiguruj prowizje dla ${itemName} w ${channelName}`}
                    activity="adding"
                    channelId={channelId}
                    itemId={itemId}
                  />
                </FormWithListClicks>
              </div>
            </Paper>
          </Slide>
        </ProductsList>
      </Paper>
    );
  }
}

export default Config;
