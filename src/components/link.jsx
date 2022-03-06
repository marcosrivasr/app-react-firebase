import style from "./link.module.css";
import { deleteLink } from "../firebase/firebase";
import { useEffect, useRef, useState } from "react";

export default function Link({
  docId,
  title,
  url,
  onDeleteLink,
  onUpdateLink,
}) {
  const [currentTitle, setTitle] = useState(title);
  const [currentUrl, setUrl] = useState(url);

  const [editTitle, setEditTitle] = useState(false);
  const [editUrl, setEditUrl] = useState(false);

  const refTitle = useRef(null);
  const refUrl = useRef(null);

  useEffect(() => {
    if (refTitle.current) {
      refTitle.current.focus();
    }
  }, [editTitle]);

  useEffect(() => {
    if (refUrl.current) {
      refUrl.current.focus();
    }
  }, [editUrl]);

  async function handleRemoveLink() {
    await deleteLink(docId);
    onDeleteLink(docId);
  }

  function handleEditTitle() {
    setEditTitle(true);
  }

  function handleEditUrl() {
    setEditUrl(true);
  }

  function handleOnBlurTitle(e) {
    setEditTitle(false);
    onUpdateLink(docId, e.target.value, currentUrl);
  }
  function handleOnBlurUrl(e) {
    setEditUrl(false);
    onUpdateLink(docId, currentTitle, e.target.value);
  }

  function handleOnChangeTitle(e) {
    setTitle(e.target.value);
  }

  function handleOnChangeUrl(e) {
    setUrl(e.target.value);
  }

  return (
    <div className={style.link}>
      <div className={style.linkInfo}>
        <div className={style.linkTitle}>
          {editTitle ? (
            <>
              <input
                ref={refTitle}
                onBlur={handleOnBlurTitle}
                onChange={handleOnChangeTitle}
                value={currentTitle}
              />
            </>
          ) : (
            <>
              <button onClick={handleEditTitle} className={style.btnEdit}>
                <span className="material-icons">edit</span>
              </button>
              {currentTitle}
            </>
          )}
        </div>
        <div className={style.linkUrl}>
          {editUrl ? (
            <>
              <input
                ref={refUrl}
                onBlur={handleOnBlurUrl}
                onChange={handleOnChangeUrl}
                value={currentUrl}
              />
            </>
          ) : (
            <>
              <button onClick={handleEditUrl} className={style.btnEdit}>
                <span className="material-icons">edit</span>
              </button>
              {currentUrl}
            </>
          )}
        </div>
      </div>
      <div className={style.linkActions}>
        <button onClick={handleRemoveLink} className={style.btnDelete}>
          <span className="material-icons">delete</span>
        </button>
      </div>
    </div>
  );
}
