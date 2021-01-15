import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { ThemeContext } from "src/themes/themeProvider";

import { faLink, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sanitizeHtml from "sanitize-html";
import "src/themes/theme.css";

interface IProps {
  show: boolean;
  handleCloseModal: () => void;
  cb: (networkUrl: string, networkName: string) => void;
}

const NetworkModal: React.FC<IProps> = ({ show, handleCloseModal, cb }) => {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext!;
  const [networkUrlInput, setNetworkUrlInput] = useState("");
  const [networkNameInput, setNetworkNameInput] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    cb(sanitizeHtml(networkUrlInput), sanitizeHtml(networkNameInput));
    setNetworkUrlInput("");
    setNetworkNameInput("");
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
        <h6>Add Network</h6>
      </div>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <div className="d-flex align-items-center mb-2">
              <FontAwesomeIcon className="mr-3" icon={faTag} />
              <Form.Control
                required
                type="text"
                value={networkNameInput}
                maxLength={20}
                onChange={(e) => {
                  setNetworkNameInput(e.target.value.toString());
                }}
                placeholder="Enter Name"
              />
            </div>
          </Form.Group>
          <Form.Group>
            <div className="d-flex align-items-center mb-4">
              <FontAwesomeIcon className="mr-3" icon={faLink} />
              <Form.Control
                required
                type="text"
                value={networkUrlInput}
                onChange={(e) => {
                  setNetworkUrlInput(e.target.value.toString());
                }}
                placeholder="Enter Url"
              />
            </div>
          </Form.Group>
          <div>
            <Button block type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NetworkModal;
