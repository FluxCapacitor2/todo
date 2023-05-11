import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const app = initializeApp({
  apiKey: "AIzaSyCpH4M4844rZYF9duxer45rTrYj6zErT_g",
  authDomain: "todoapp-d3b57.firebaseapp.com",
  projectId: "todoapp-d3b57",
  storageBucket: "todoapp-d3b57.appspot.com",
  messagingSenderId: "890377760325",
  appId: "1:890377760325:web:4884f966a03ca3666bfd2c",
});

const messaging = getMessaging(app);

const prisma = new PrismaClient({
  log: ["query"],
});

const sendNotifications = async () => {
  const jobs = await prisma.notificationJob.findMany({
    where: {
      time: {
        lte: new Date(),
      },
    },
    include: {
      User: {
        include: {
          notificationTokens: true,
        },
      },
    },
  });

  if (jobs.length > 0) {
    const messages = jobs.flatMap((notif) => {
      const tokens = notif.User.notificationTokens.map((it) => it.token);
      return tokens.map((token) => ({
        notification: {
          title: notif.title,
          body: notif.description,
          click_action: notif.url,
        },
        token,
      }));
    });
    console.log("Created messages", JSON.stringify(messages));
    await messaging.sendEach(messages);
    console.log("Sent");
  }
};

const job = new CronJob(
  "* * * * /5",
  sendNotifications,
  null,
  false,
  "America/New_York"
);
sendNotifications();
job.start();
