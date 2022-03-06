//@typecheck

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();

export async function registerNewUser(user) {
  try {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef, user.uid), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getUserInfo(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function userExists(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}

export async function updateUser(user) {
  console.log(user);
  try {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef, user.uid), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function fetchLinkData(uid) {
  const links = [];
  const q = query(collection(db, "links"), where("uid", "==", uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const link = { ...doc.data() };
    link.docId = doc.id;
    //console.log(doc.id, " => ", doc.data());
    console.log(link);
    links.push(link);
  });
  return links;
}

export async function insertNewLink(link) {
  try {
    const linksRef = collection(db, "links");
    const res = await addDoc(linksRef, link);
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function existsUsername(username) {
  const users = [];
  const q = query(collection(db, "users"), where("username", "==", username));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    users.push(doc.data());
  });
  return users.length > 0 ? users[0].uid : null;
}

export async function getUserPublicProfileInfo(uid) {
  const profileInfo = await getUserInfo(uid);
  const linksInfo = await fetchLinkData(uid);
  return {
    profile: profileInfo,
    links: linksInfo,
  };
}

export async function getUserProfilePhoto(usernamePhoto) {
  // Create a child reference
  const imagesRef = ref(storage, `images/${usernamePhoto}`);
  // imagesRef now points to 'images'
}

export async function setUserProfilePhoto(uid, file) {
  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  //const mountainsRef = ref(storage, username);

  // Create a reference to 'images/mountains.jpg'
  const mountainImagesRef = ref(storage, `images/${uid}`);

  // While the file names are the same, the references point to different files
  //mountainsRef.name === mountainImagesRef.name; // true
  //mountainsRef.fullPath === mountainImagesRef.fullPath; // false
  // 'file' comes from the Blob or File API
  const res = await uploadBytes(mountainImagesRef, file);
  console.log("file uploaded", res);
  return res;
}

export async function getProfilePhotoUrl(profilePicture) {
  const profileRef = ref(storage, profilePicture);
  console.log(profilePicture);

  /* const url = await getDownloadURL(
    ref(storage, "images/MBr3m7RbiWSlnskhZ94EZ9Vkh542")
  ); */
  const url = await getDownloadURL(profileRef);
  /* .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      console.log("url", url);

      // Or inserted into an <img> element
      const img = document.getElementById("myimg");
      img.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    }); */
  console.log({ url });
  return url;
}

export async function logout() {
  await auth.signOut();
}

export async function deleteLink(docId) {
  await deleteDoc(doc(db, "links", docId));
}

export async function updateLink(docId, link) {
  const res = await setDoc(doc(db, "links", docId), link);
  console.log("update link", docId, link, res);
}
