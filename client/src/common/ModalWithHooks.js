import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: maxWidth => maxWidth,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none"
  }
}));

export default function SimpleModal({
  openModal,
  handleCloseModal,
  children,
  maxWidth
}) {
  const classes = useStyles(maxWidth);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openModal}
      // open={open}
      // onClose={handleClose}
      onClose={handleCloseModal}
    >
      <div style={modalStyle} className={classes.paper}>
        {/* <h2 id="modal-title">Text in a modal</h2> */}
        {children}
        <SimpleModal />
      </div>
    </Modal>
  );
}
