import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  existsUsername,
  getUserPublicProfileInfo,
  getProfilePhotoUrl,
} from "../firebase/firebase";
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile {profile?.profile?.displayName}</h2>
      <div className="profile">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="" width="100" />
        ) : (
          ""
        )}
      </div>
      <div className="links">
        {profile?.links?.map((link) => (
          <div key={link.id}>
            <a href={link.url} target="_blank">
              {link.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
