import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "./../util/firebase";

const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});
