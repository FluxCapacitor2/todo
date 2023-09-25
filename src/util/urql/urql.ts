import schema from "@/../public/schema.json";
import { GetNotificationTokensQuery } from "@/app/(sidebar)/profile/NotificationSignUp";
import { GetTimePresetsQuery } from "@/components/ui/DatePickerPopover";
import { GraphCacheConfig } from "@/gql/graphql-graphcache";
import { getBaseURL } from "@/lib/utils";
import { cacheExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { refocusExchange } from "@urql/exchange-refocus";
import { retryExchange } from "@urql/exchange-retry";
import { Client, fetchExchange } from "urql";

const storage =
  typeof window !== "undefined" && process.env.NODE_ENV !== "development"
    ? makeDefaultStorage({
        idbName: `graphcache-${
          process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local-dev"
        }`,
        maxAge: 7, // The maximum age of the persisted data in days
      })
    : undefined;

const optimisticId = () => "temp-optimistic-" + Math.random();

const cache = cacheExchange<GraphCacheConfig>({
  schema,
  resolvers: {
    Task: {
      //@ts-ignore
      dueDate: (parent) => {
        return parent.dueDate !== null
          ? new Date(parent.dueDate as unknown as string)
          : null;
      },
      //@ts-ignore
      startDate: (parent) => {
        return parent.startDate !== null
          ? new Date(parent.startDate as unknown as string)
          : null;
      },
      //@ts-ignore
      createdAt: (parent) => new Date(parent.createdAt as unknown as string),
      parentTask: (parent, _args, cache) => {
        return {
          __typename: "Task",
          id: cache.resolve(parent, "parentTaskId")?.toString(),
        };
      },
    },
    Reminder: {
      //@ts-ignore
      time: (parent) =>
        typeof parent.time === "string" ? new Date(parent.time) : parent.time,
      task: (parent, _args, cache) => {
        return {
          __typename: "Task",
          id: cache.resolve(parent, "taskId")?.toString(),
        };
      },
    },
    Project: {
      //@ts-ignore
      createdAt: (parent) => new Date(parent.createdAt as unknown as string),
    },
  },
  optimistic: {
    createReminder: (args, cache, info) => {
      return {
        __typename: "Reminder",
        id: optimisticId(),
        taskId: args.taskId!,
        time: args.time!,
      };
    },
    deleteReminder: (args, cache, info) => {
      return {
        __typename: "Reminder",
        id: args.id?.toString(),
      };
    },
    addNotificationToken: (args, cache, info) => {
      return {
        __typename: "NotificationToken",
        id: optimisticId(),
        token: args.token!,
        userAgent: args.userAgent!,
      };
    },
    removeNotificationToken: (args, cache, info) => {
      return {
        __typename: "NotificationToken",
        token: args.token!,
      };
    },
  },
  updates: {
    Mutation: {
      createReminder: (result, args, cache, info) => {
        const reminders = cache.resolve(
          { __typename: "Task", id: result.createReminder.taskId! },
          "reminders"
        );

        if (Array.isArray(reminders)) {
          cache.link(
            { __typename: "Task", id: result.createReminder.taskId! },
            "reminders",
            [...reminders, cache.keyOfEntity(result.createReminder)]
          );
        }
      },
      deleteReminder: (result, args, cache, info) => {
        const taskId = cache
          .resolve(
            {
              __typename: "Reminder",
              id: result.deleteReminder.id!,
            },
            "taskId"
          )
          ?.toString();

        const reminders = cache.resolve(
          { __typename: "Task", id: taskId! },
          "reminders"
        );

        if (Array.isArray(reminders)) {
          const key = cache.keyOfEntity({
            __typename: "Reminder",
            id: args.id!,
          });
          cache.link(
            { __typename: "Task", id: taskId! },
            "reminders",
            reminders.filter((it) => it !== key)
          );
        }
      },
      addNotificationToken: (result, args, cache, info) => {
        cache.updateQuery(
          {
            query: GetNotificationTokensQuery,
          },
          (data) => {
            if (data?.me?.notificationTokens) {
              data.me.notificationTokens.push(
                result.addNotificationToken as (typeof data.me.notificationTokens)[0]
              );
            }
            return data;
          }
        );
      },
      removeNotificationToken: (result, args, cache, info) => {
        cache.updateQuery(
          {
            query: GetNotificationTokensQuery,
          },
          (data) => {
            if (data?.me?.notificationTokens) {
              data.me.notificationTokens = data.me.notificationTokens.filter(
                (it) =>
                  it.id !== result.removeNotificationToken.id &&
                  it.token !== result.removeNotificationToken.token
              );
            }
            return data;
          }
        );
      },
      addTimePreset: (result, args, cache, info) => {
        const me = cache.resolve({ __typename: "Query" }, "me")?.toString();
        const timePresets = cache.resolve(me, "timePresets");

        if (Array.isArray(timePresets)) {
          cache.updateQuery(
            {
              query: GetTimePresetsQuery,
            },
            (data) => {
              if (data?.me?.timePresets) {
                data.me.timePresets =
                  result.addTimePreset as typeof data.me.timePresets;
              }
              return data;
            }
          );
        }
      },
    },
  },
  // @ts-expect-error Storage can't be initialized without a browser environment, so it can be undefined here.
  storage,
});

const retry = retryExchange({
  initialDelayMs: 500,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 3,
});

export const queryClient = new Client({
  url: getBaseURL() + "/api/graphql",
  exchanges: [refocusExchange(), retry, cache, fetchExchange],
});
