import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserInfo,
  insertNewLink,
  userExists,
  fetchLinkData,
  setUserProfilePhoto,
  updateUser,
  logout,
} from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Link from "../components/link";

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

  function renderLinks() {
    if (links.length > 0) {
      return links.map((link) => <Link title={link.title} url={link.url} />);
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

  function addLink() {
    if (link && link.url && link.title) {
      const newLink = {
        id: uuid(),
        title: link.title,
        url: link.url,
        uid: currentUser.uid,
      };
      insertNewLink({ ...newLink });
      setLinks([...links, newLink]);
    }
  }

  function handleOnChangeProfileImage(e) {
    console.log(e.target);

    var fileList = e.target.files;
    var fileReader = new FileReader();

    if (fileReader && fileList && fileList.length) {
      fileReader.readAsArrayBuffer(fileList[0]);
      fileReader.onload = async function () {
        var imageData = fileReader.result;

        const res = await setUserProfilePhoto(currentUser.uid, imageData);

        if (res) {
          const tmpUser = { ...currentUser };
          tmpUser.profilePicture = res.metadata.fullPath;
          setCurrentUser({ ...tmpUser });
          debugger;
          await updateUser(currentUser);
          //updateUserProfilePhoto(currentUser.uid, res.fullPath);
        }
      };
    }
  }

  async function handleClickLogout() {
    await logout();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleClickLogout}>Logout</button>
      <div>
        <input type="file" onChange={handleOnChangeProfileImage} />
        <form action="" onSubmit={handleSubmit}>
          Title
          <input
            type="text"
            name="title"
            onInput={handleInput}
            value={link.title}
          />
          URL
          <input
            type="text"
            name="url"
            onInput={handleInput}
            value={link.url}
          />
          <input type="submit" value="Añadir link" />
        </form>
      </div>
      <div>{renderLinks()}</div>
    </div>
  );
}
