import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { app } from "./../util/firebase";

const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});
