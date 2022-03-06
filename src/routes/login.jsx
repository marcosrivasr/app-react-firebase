import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  auth,
  getUserInfo,
  read,
  registerNewUser,
  updateUser,
  userExists,
} from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate, useLocation } from "react-router-dom";

/*
  Stages:
  0: initiated
  1: loading
  2: login completed
  3: login but no username
  4: not logged
*/
export default function Login() {
  const [currentUser, setCurrentUser] = useState(null);
  const [state, setState] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(user);

        if (userExists(user.uid)) {
          console.log("user registered");
          const loggedUser = await getUserInfo(uid);
          console.log("loggedUser", loggedUser);
          setCurrentUser(loggedUser);
          if (!loggedUser.processCompleted) {
            console.log("Falta username");

            navigate("/choose-username");
            setState(3);
          } else {
            console.log("Ya tiene username");
            navigate("/dashboard");
            setState(2);
          }
        } else {
          console.log("Register");

          registerNewUser({
            uid: user.uid,
            displayName: user.displayName,
            profilePicture: "",
            username: "",
            processCompleted: false,
          });

          setState(3);
        }
      } else {
        setState(4);
      }
    });
  }, []);

  function handleAuth() {
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        setCurrentUser(res.user);
        registerNewUser(res.user);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
    signInWithGoogle();
  }

  function handleInputUsername(e) {
    const tmpUser = currentUser;
    const value = e.target.value;
    tmpUser.username = value;
    setCurrentUser({ ...tmpUser });
  }

  async function handleOnClickContinue() {
    if (currentUser.username !== "") {
      await updateUser(currentUser);
      setState(2);
    }
  }

  if (state === 1) {
    return <div>Loading...</div>;
  }

  if (state === 2) {
    return <div>Bienvenido {currentUser.displayName}</div>;
  }

  if (state === 3) {
    return (
      <div>
        <h1>Bienvenido {currentUser.displayName}, te falta un username</h1>
        <div>
          <input type="text" onInput={handleInputUsername} />
        </div>
        <div>
          <button onClick={handleOnClickContinue}>Continue</button>
        </div>
      </div>
    );
  }
  if (state === 4) {
    return (
      <div>
        <button onClick={() => handleAuth()}>Login</button>
      </div>
    );
  }

  return <div>Loading</div>;
}
