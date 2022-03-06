import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/loading";
import style from "./profile.module.css";
import styleLink from "../components/publicLink.module.css";
import {
  existsUsername,
  getUserPublicProfileInfo,
  getProfilePhotoUrl,
} from "../firebase/firebase";
import PublicLink from "../components/publicLink";
/*
  Stages:
  0: initiated
  1: loading
  2: login completed
  3: login but no username
  4: not logged
  5: username exists
  6: username correct
  7: username does not exist
*/
export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useState(undefined);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(undefined);
  const [state, setState] = useState(0);

  useEffect(async () => {
    setState(1);
    try {
      const userUID = await existsUsername(params.username);
      if (userUID) {
        const res = await getUserPublicProfileInfo(userUID);
        console.log("profile", res);
        setProfile(res);

        const url = await getProfilePhotoUrl(res.profile.profilePicture);
        setProfilePhotoUrl(url);
        setState(5);
      } else {
        setState(7);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (state === 7) {
    return (
      <div>
        <h1>Profile not found</h1>
      </div>
    );
  }

  if (state === 1) {
    return <Loading />;
  }

  return (
    <div className={style.profileContainer}>
      <div className={style.profilePicture}>
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="" width="100" />
        ) : (
          ""
        )}
      </div>
      <h2>@{profile?.profile?.username}</h2>
      <h2>{profile?.profile?.displayName}</h2>
      <div className={styleLink.publicLinksContainer}>
        {profile?.links?.map((link) => (
          <PublicLink key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
