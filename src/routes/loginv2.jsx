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
import AuthProvider from "../components/authProvider";
import Loading from "../components/loading";

import style from "./login.module.css";

/*
  Stages:
  0: initiated
  1: loading
  2: login completed
  3: login but no username
  4: not logged
*/
export default function LoginV2() {
  const navigate = useNavigate();
  const [state, setState] = useState(1);

  function handleAuth() {
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        if (res) {
          registerNewUser(res.user);
        }
      } catch (err) {
        console.error(err);
        //alert(err.message);
      }
    };
    signInWithGoogle();
  }

  if (state === 4) {
    return (
      <div className={style.loginView}>
        <div>
          <h1>Link Tree</h1>
          <button onClick={() => handleAuth()} className={style.provider}>
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider
      onUserLoggedIn={(user) => {
        navigate("/dashboard");
      }}
      onUserNotLoggedIn={() => {
        setState(4);
      }}
    >
      <Loading />
    </AuthProvider>
  );
}
