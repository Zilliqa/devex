import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { ThemeContext } from "src/themes/themeProvider";

import sanitizeHtml from "sanitize-html";

import "src/themes/theme.css";
import "./LabelModal.css";

interface IProps {
  show: boolean;
  handleCloseModal: () => void;
  addLabel: (labelName: string) => void;
}

const LabelModal: React.FC<IProps> = ({ show, handleCloseModal, addLabel }) => {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext!;
  const [labelInput, setLabelInput] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLabelInput("");
    addLabel(labelInput);
  };

  return (
    <Modal
      className={
        theme === "dark"
          ? "custom-modal dark-theme"
          : "custom-modal light-theme"
      }
      show={show}
      onHide={handleCloseModal}
    >
      <div className="modal-header">
        <h6>Add Label</h6>
      </div>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Form.Control
              autoFocus={true}
              required
              type="text"
              value={labelInput}
              maxLength={20}
              onChange={(e) => {
                setLabelInput(sanitizeHtml(e.target.value));
              }}
              placeholder="Label Name"
            />
          </div>
          <div>
            <Button block type="submit">
              Save
            </Button>
          </div>
        </Form>
        <div className="modal-footer">
          <span>Labels can be accessed from the Labels Page</span>
          <br />
          <span>Label data is saved in the local storage of your browser</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LabelModal;
