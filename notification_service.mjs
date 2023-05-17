import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { formatDistanceToNow } from "date-fns";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const app = initializeApp({
  apiKey: "AIzaSyCpH4M4844rZYF9duxer45rTrYj6zErT_g",
  authDomain: "todoapp-d3b57.firebaseapp.com",
  projectId: "todoapp-d3b57",
  storageBucket: "todoapp-d3b57.appspot.com",
  messagingSenderId: "890377760325",
  appId: "1:890377760325:web:4884f966a03ca3666bfd2c",
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString()
    )
  ),
});

const messaging = getMessaging(app);

const prisma = new PrismaClient({
  log: ["query"],
});

const sendNotifications = async () => {
  const reminders = await prisma.reminder.findMany({
    where: {
      time: {
        lte: new Date(),
      },
    },
    include: {
      Task: {
        include: {
          owner: {
            include: {
              notificationTokens: true,
            },
          },
        },
      },
    },
  });

  if (reminders.length > 0) {
    const messages = reminders.flatMap((notif) => {
      const tokens = notif.Task.owner.notificationTokens.map((it) => it.token);
      return tokens.map((token) => ({
        notification: {
          title: notif.Task.name,
          body: notif.Task.dueDate
            ? `⏰ Due ${formatDistanceToNow(notif.Task.dueDate, {
                addSuffix: true,
              })}.`
            : "🔔 You set a reminder for this task.",
          icon: "https://todo-app-seven-lime.vercel.app/icon.png",
          click_action: `https://todo-app-seven-lime.vercel.app/project/${notif.projectId}/${notif.Task.id}`,
        },
        token,
      }));
    });
    const result = await messaging.sendEach(messages);

    await prisma.reminder.deleteMany({
      where: {
        id: {
          in: reminders.map((r) => r.id),
        },
      },
    });

    console.log("Sent", JSON.stringify(result));
  }
};

const job = new CronJob(
  "*/5 * * * *",
  sendNotifications,
  null,
  false,
  "America/New_York"
);
await sendNotifications();
job.start();
