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
        lte: new Date(new Date().getTime() + 60_000),
      },
    },
    include: {
      user: {
        include: {
          notificationTokens: true,
        },
      },
      Task: {
        include: {
          project: {
            select: {
              archived: true,
            },
          },
        },
      },
    },
  });

  if (reminders.length > 0) {
    const messages = reminders
      .flatMap((notif) => {
        if (notif.Task.project.archived) {
          return undefined;
        }

        const taskLink = `https://todo.bswanson.dev/project/${notif.projectId}/${notif.Task.id}`;

        const tokens = notif.user.notificationTokens.map((it) => it.token);
        return tokens.map((token) => ({
          notification: {
            title: notif.Task.name,
            body: notif.Task.dueDate
              ? `⏰ Due ${formatDistanceToNow(notif.Task.dueDate, {
                  addSuffix: true,
                })}.`
              : "🔔 You set a reminder for this task.",
          },
          webpush: {
            notification: {
              icon: "https://todo.bswanson.dev/icon.png",
              click_action: taskLink,
              actions: [
                {
                  action: "complete",
                  title: "Complete",
                },
              ],
              tag: `todo-task-${notif.Task.id}`,
              timestamp: notif.time.getTime(),
              renotify: true,
            },
            fcm_options: {
              link: taskLink,
            },
          },
          data: {
            id: notif.id.toString(),
            url: taskLink,
            projectId: notif.projectId,
            taskId: notif.Task.id.toString(),
          },
          token,
        }));
      })
      .filter((it) => it !== undefined);

    if (messages.length === 0) return;

    const results = await messaging.sendEach(messages);

    let tokensToRemove = [];
    for (const i in results.responses) {
      const response = results.responses[i];
      console.log(i, response);
      if (response.error) {
        if (
          response.error.code === "messaging/registration-token-not-registered"
        ) {
          // Remove unregistered notification tokens
          console.log("Removing unregistered token", messages[i].token);
          tokensToRemove.push(messages[i].token);
        } else {
          console.warn(
            "Unknown error code: ",
            response.error,
            "message ID: ",
            response.messageId
          );
        }
      }
    }

    if (tokensToRemove.length > 0) {
      console.log("Removing inactive notification tokens");
      await prisma.notificationToken.deleteMany({
        where: {
          token: {
            in: tokensToRemove,
          },
        },
      });
    }

    const successes = results.responses
      .map((response, i) => ({
        response,
        i,
      }))
      .filter(({ response, i }) => response.success)
      .map(({ response, i }) => parseInt(messages[i].data.id));

    await prisma.reminder.deleteMany({
      where: {
        id: {
          in: successes,
        },
      },
    });
  }
};

const job = new CronJob(
  "*/2 * * * *",
  sendNotifications,
  null,
  false,
  "America/New_York"
);
await sendNotifications();
job.start();
