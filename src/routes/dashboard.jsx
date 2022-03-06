import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserInfo,
  insertNewLink,
  userExists,
  fetchLinkData,
  logout,
  updateLink,
} from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Link from "../components/link";
import DashboardWrapper from "../components/dashboardWrapper";

import style from "./dashboard.module.css";
import styleLinks from "../components/link.module.css";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [link, setLink] = useState({});

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, callBackAuthState);
  }, []);

  async function callBackAuthState(user) {
    if (user) {
      const uid = user.uid;
      console.log(user);

      if (userExists(user.uid)) {
        const loggedUser = await getUserInfo(uid);
        setCurrentUser(loggedUser);
        if (loggedUser.username === "") {
          console.log("Falta username");
          navigate("/login");
        } else {
          console.log("Ya tiene username");
          const asyncLinks = await fetchLinkData(uid);
          setLinks([...asyncLinks]);
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }

  function handleOnDeleteLink(docId) {
    const tmp = links.filter((link) => link.docId !== docId);
    setLinks([...tmp]);
  }
  function handleOnUpdateLink(docId, title, url) {
    const link = links.find((item) => item.docId === docId);
    link.title = title;
    link.url = url;
    updateLink(docId, link);
  }

  function renderLinks() {
    if (links.length > 0) {
      return links.map((link) => (
        <Link
          key={link.id}
          docId={link.docId}
          title={link.title}
          url={link.url}
          onDeleteLink={handleOnDeleteLink}
          onUpdateLink={handleOnUpdateLink}
        />
      ));
    }
  }

  function handleInput(e) {
    const value = e.target.value;

    if (e.target.name === "url") {
      setLink({
        url: value,
        title: link.title,
      });
    }

    if (e.target.name === "title") {
      setLink({
        url: link.url,
        title: value,
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addLink();
  }

  async function addLink() {
    if (link && link.url && link.title) {
      const newLink = {
        id: uuid(),
        title: link.title,
        url: link.url,
        uid: currentUser.uid,
      };
      const res = await insertNewLink({ ...newLink });
      newLink.docId = res.id;
      setLink({
        url: "",
        title: "",
      });
      setLinks([...links, newLink]);
    }
  }

  return (
    <DashboardWrapper>
      <h2>Dashboard</h2>

      <form action="" onSubmit={handleSubmit} className={style.entryContainer}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          onInput={handleInput}
          value={link.title}
          autoComplete={false}
        />
        <label>URL</label>
        <input
          type="text"
          name="url"
          onInput={handleInput}
          value={link.url}
          autoComplete={false}
        />
        <input type="submit" value="Añadir link" className="btn" />
      </form>

      <div className={styleLinks.linksContainer}>{renderLinks()}</div>
    </DashboardWrapper>
  );
}
