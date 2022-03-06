import { useEffect, useRef, useState } from "react";
import {
  setUserProfilePhoto,
  updateUser,
  getProfilePhotoUrl,
} from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardWrapper";
import { useNavigate } from "react-router-dom";

import style from "./editProfile.module.css";
import AuthProvider from "../components/authProvider";

export default function EditProfile() {
  const ref = useRef(null);
  const [profileUrl, setProfileUrl] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);

  let navigate = useNavigate();

  function handleOnClickProfilePicture() {
    ref.current.click();
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
          await updateUser(currentUser);
          const url = await getProfilePhotoUrl(currentUser.profilePicture);
          setProfileUrl(url);
          //updateUserProfilePhoto(currentUser.uid, res.fullPath);
        }
      };
    }
  }

  async function handleOnUserLoggedIn(loggedUser) {
    setCurrentUser(loggedUser);
    const url = await getProfilePhotoUrl(loggedUser.profilePicture);
    setProfileUrl(url);
  }

  function handleOnUserNotLoggedIn() {
    navigate("/login");
  }

  return (
    <AuthProvider
      onUserLoggedIn={handleOnUserLoggedIn}
      onUserNotLoggedIn={handleOnUserNotLoggedIn}
    >
      <DashboardWrapper>
        <div>
          <h2>Edit Profile Info</h2>
          <div className={style.profilePictureContainer}>
            <div>
              <img src={profileUrl} alt="" width={100} />
            </div>
            <div>
              <button className="btn" onClick={handleOnClickProfilePicture}>
                Choose new profile picture
              </button>
              <input
                ref={ref}
                type="file"
                onChange={handleOnChangeProfileImage}
                className={style.fileInput}
              />
            </div>
          </div>
        </div>
      </DashboardWrapper>
    </AuthProvider>
  );
}
