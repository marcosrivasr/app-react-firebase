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
  return (
    <AuthProvider
      onUserLoggedIn={(user) => {
        navigate("/dashboard");
      }}
      onUserDoesntExist={() => {
        console.log("usuario no existe");
      }}
      onUserNotLoggedIn={() => {
        console.log("Usuario no logueado");
      }}
    >
      <div>Loading</div>
    </AuthProvider>
  );
}
