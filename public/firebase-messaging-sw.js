// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCpH4M4844rZYF9duxer45rTrYj6zErT_g",
  authDomain: "todoapp-d3b57.firebaseapp.com",
  projectId: "todoapp-d3b57",
  storageBucket: "todoapp-d3b57.appspot.com",
  messagingSenderId: "890377760325",
  appId: "1:890377760325:web:4884f966a03ca3666bfd2c",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

self.addEventListener("push", (event) => {
  console.log("Push event received!", event);
});

self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  console.log("Clicked notification:", clickedNotification);
  clickedNotification.close();

  const action = event.action;
  const data = clickedNotification.data.FCM_MSG.data;
  console.log("Data:", data);

  if (action === "complete") {
    // Complete the task

    const promise = fetch(`/api/trpc/tasks.update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: { id: parseInt(data.taskId), completed: true },
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log("Complete task returned response: ", json))
      .then(() => self.clients.openWindow(data.url));

    event.waitUntil(promise);
  } else {
    // If no action was selected, open the task in a new tab/window
    event.waitUntil(self.clients.openWindow(data.url));
  }
});

// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: "/icon.png",
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
