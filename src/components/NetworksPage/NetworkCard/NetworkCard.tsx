import React, { useRef, useState, useEffect } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Link } from "react-router-dom";

import { printableChars } from "src/utils/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import sanitizeHtml from "sanitize-html";

import "./NetworkCard.css";

interface IProps {
  url: string;
  name: string;
  deleteNode: (k: string) => void;
  editNode: (url: string, newName: string) => void;
}

const NetworkCard: React.FC<IProps> = ({ url, name, deleteNode, editNode }) => {
  const text = useRef(name);
  const inner = React.createRef<HTMLElement>();
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: ContentEditableEvent) => {
    text.current = e.target.value;
  };

  const handleBlur = () => {
    setIsEditing(false);

    text.current = sanitizeHtml(text.current);
    editNode(url, text.current);
  };

  const moveCaretToEnd = (el: HTMLElement) => {
    const target = document.createTextNode("");
    el.appendChild(target);
    if (target !== null && target.nodeValue !== null) {
      const sel = window.getSelection();
      if (sel === null) return;
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      if (el instanceof HTMLElement) el.focus();
    }
  };

  useEffect(() => {
    if (!inner.current) return;
    inner.current.focus();
    moveCaretToEnd(inner.current);
  }, [isEditing, inner]);

  return (
    <div className="network-card">
      <div className="network-card-div">
        <div>
          {isEditing ? (
            <ContentEditable
              onKeyDown={(e) =>
                text.current.length >= 20 && printableChars(e.keyCode)
                  ? e.preventDefault()
                  : e.keyCode === 13 &&
                    (() => {
                      inner.current?.blur();
                    })()
              }
              className="label-name-editable"
              innerRef={inner}
              html={text.current}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          ) : (
            <Link
              to={{
                pathname: "/",
                search: "?" + new URLSearchParams({ network: url }).toString(),
              }}
            >
              {" "}
              {name}
            </Link>
          )}{" "}
          <small className="subtext">({url})</small>
        </div>
        <div>
          <FontAwesomeIcon
            onClick={() => {
              setIsEditing(true);
            }}
            cursor="pointer"
            className="ml-3"
            icon={faEdit}
          />
          <FontAwesomeIcon
            onClick={() => deleteNode(url)}
            cursor="pointer"
            className="ml-3"
            icon={faTrashAlt}
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkCard;
