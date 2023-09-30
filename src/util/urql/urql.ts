import schema from "@/../public/schema.json";
import { GetNotificationTokensQuery } from "@/app/(sidebar)/profile/NotificationSignUp";
import { GetTimePresetsQuery } from "@/components/ui/DatePickerPopover";
import { GraphCacheConfig } from "@/gql/graphql-graphcache";
import { getBaseURL } from "@/lib/utils";
import {
  Cache,
  Entity,
  FieldArgs,
  cacheExchange,
} from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { refocusExchange } from "@urql/exchange-refocus";
import { requestPolicyExchange } from "@urql/exchange-request-policy";
import { retryExchange } from "@urql/exchange-retry";
import toast from "react-hot-toast";
import { Client, errorExchange, fetchExchange } from "urql";

const storage =
  typeof window !== "undefined" && process.env.NODE_ENV !== "development"
    ? makeDefaultStorage({
        idbName: `graphcache-${
          process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local-dev"
        }`,
        maxAge: 14, // The maximum age of the persisted data in days
      })
    : undefined;

const optimisticId = () => "optimistic-" + Math.random();

// This function is explicitly typed to return "any" to avoid having to add a `ts-ignore` directive above every usage.
function ensureDate(value: any): any {
  if (value === null || value === undefined) {
    return null;
  } else if (typeof value === "string") {
    if (isNaN(Date.parse(value))) {
      throw new Error("Invalid date: " + value);
    }
    return new Date(value);
  } else if (typeof value === "object") {
    const type = Object.prototype.toString.call(value);
    if (type === "[object Date]") {
      return value as Date;
    } else {
      throw new Error("Unexpected object type: " + type);
    }
  } else {
    throw new Error("Unexpected primitive type: " + typeof value);
  }
}

const cache = cacheExchange<GraphCacheConfig>({
  schema,
  resolvers: {
    Task: {
      dueDate: (parent) => ensureDate(parent.dueDate),
      startDate: (parent) => ensureDate(parent.startDate),
      createdAt: (parent) => ensureDate(parent.createdAt),
    },
    Reminder: {
      time: (parent) => ensureDate(parent.time),
      task: (parent, _args, cache) => {
        return {
          __typename: "Task",
          id: parent.taskId?.toString(),
        };
      },
    },
    Project: {
      createdAt: (parent) => ensureDate(parent.createdAt),
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
    rejectInvitation: (args, cache, info) => {
      return {
        __typename: "Invitation",
        id: args.id!,
      };
    },
    createTask: (args, cache, info) => {
      return {
        __typename: "Task",
        id: optimisticId(),
        completed: false,
        createdAt: new Date(),
        description: args.description ?? "",
        dueDate: args.dueDate,
        name: args.name ?? "",
        sectionId: args.sectionId,
        updatedAt: new Date(),
      };
    },
    deleteTask: (args, cache, info) => {
      return {
        __typename: "Task",
        id: args.id!.toString(),
      };
    },
  },
  updates: {
    Mutation: {
      createReminder: (result, args, cache, info) =>
        addToList(
          cache,
          { __typename: "Task", id: result.createReminder.taskId! },
          "reminders",
          result.createReminder
        ),
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
      rejectInvitation: (result, args, cache, info) => {
        cache.invalidate({
          __typename: "Invitation",
          id: result.rejectInvitation.id!,
        });
      },
      inviteCollaborator: (result, args, cache, info) =>
        addToList(
          cache,
          { __typename: "Project", id: args.projectId! },
          "collaborators",
          {
            __typename: "Collaborator",
            id: result.inviteCollaborator.id!,
          }
        ),

      createTask: (result, args, cache, info) =>
        addToList(
          cache,
          { __typename: "Section", id: result.createTask.sectionId! },
          "tasks",
          { __typename: "Task", id: result.createTask.id! }
        ),
      deleteTask: (result, args, cache, info) => {
        if (result.deleteTask.sectionId) {
          removeFromList(
            cache,
            {
              __typename: "Section",
              id: result.deleteTask.sectionId,
            },
            "tasks",
            { __typename: "Task", id: result.deleteTask.id! }
          );
        } else {
          removeFromList(
            cache,
            {
              __typename: "Task",
              id: result.deleteTask.parentTaskId!,
            },
            "subTasks",
            { __typename: "Task", id: result.deleteTask.id! }
          );
        }
      },
      updateSection: (result, args, cache, info) => {
        const item = result.updateSection;
        const projectEntity = {
          __typename: "Project",
          id: item.projectId!,
        };
        addToList(cache, projectEntity, "sections", item, {
          archived: item.archived!,
        });
        removeFromList(cache, projectEntity, "sections", item, {
          archived: !item.archived,
        });
      },
      createNewProject: (result, args, cache, info) => {
        const me = cache.resolve({ __typename: "Query" }, "me")?.toString();
        const projects = cache.resolve(me, "projects", { archived: false });

        if (!Array.isArray(projects)) {
          return;
        }

        cache.link(me, "projects", { archived: false }, [
          ...projects,
          cache.keyOfEntity(result.createNewProject),
        ]);
      },
      deleteSection: (result, args, cache, info) => {
        removeFromList(
          cache,
          { __typename: "Project", id: result.deleteSection.projectId! },
          "sections",
          result.deleteSection,
          { archived: false }
        );
        removeFromList(
          cache,
          {
            __typename: "Project",
            id: result.deleteSection.projectId!,
          },
          "sections",
          result.deleteSection,
          { archived: true }
        );
      },
      createSection: (result, args, cache, info) =>
        addToList(
          cache,
          { __typename: "Project", id: result.createSection.projectId! },
          "sections",
          result.createSection,
          { archived: false }
        ),
    },
  },
  // @ts-expect-error Storage can't be initialized without a browser environment, so it can be undefined here.
  storage,
});

function addToList(
  cache: Cache,
  parent: Entity,
  listName: string,
  item: Entity,
  args?: FieldArgs
) {
  const list = cache.resolve(parent, listName, args);
  console.log("Adding", item, "to", parent, ">", list, args ?? "(no args)");
  if (!Array.isArray(list)) {
    return;
  }
  const key = cache.keyOfEntity(item) as any;
  if (list.includes(key)) {
    return; // Prevent duplicates
  }
  cache.link(parent, listName, args, [...list, item]);
}

function removeFromList(
  cache: Cache,
  parent: Entity,
  listName: string,
  item: Entity,
  args?: FieldArgs
) {
  const list = cache.resolve(parent, listName, args);
  const key = cache.keyOfEntity(item);
  console.log("Removing", key, "from", parent, ">", list, args ?? "(no args)");
  if (!Array.isArray(list)) {
    return;
  }
  cache.link(
    parent,
    listName,
    args,
    list.filter((item) => item !== key)
  );
}

const retry = retryExchange({
  initialDelayMs: 500,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 3,
});

let lastError: string | undefined = undefined;
let lastErrorTime = Date.now();

const errors = errorExchange({
  onError: (error, operation) => {
    console.error(error);
    error.graphQLErrors.forEach((error) => {
      console.warn("GraphQL error (part of CombinedError):", error);
      const message =
        error.originalError?.message ??
        // @ts-ignore Extensions aren't typed
        error.extensions?.originalError?.message ??
        "Unknown Error";

      if (message !== lastError || Date.now() - lastErrorTime > 3_000) {
        toast.error(message);
        lastError = message;
        lastErrorTime = Date.now();
      }
    });
  },
});

const refetch = requestPolicyExchange({
  shouldUpgrade: (op) => {
    // TODO automatically refetch some queries
    return false;
  },
});

export const queryClient = new Client({
  url: getBaseURL() + "/api/graphql",
  exchanges: [refocusExchange(), retry, cache, errors, refetch, fetchExchange],
});
