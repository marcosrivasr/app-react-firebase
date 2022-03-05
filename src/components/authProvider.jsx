import { useEffect, useState } from "react";
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

export default function AuthProvider({
  children,
  onUserLoggedIn,
  onUserDoesntExist,
  onUserNotLoggedIn,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        const exists = await userExists(user.uid);

        if (exists) {
          const loggedUser = await getUserInfo(uid);

          if (loggedUser.username === "") {
            console.log("Falta username");
            navigate("/choose-username");
          } else {
            console.log("Usuario logueado completo");
            onUserLoggedIn(loggedUser);
          }
        } else {
          onUserDoesntExist();
        }
      } else {
        onUserNotLoggedIn();
      }
    });
  }, []);

  return <div>{children}</div>;
}
