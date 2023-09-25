/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date };
};

export type ApiToken = {
  __typename?: "ApiToken";
  generatedAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
};

export type Collaborator = {
  __typename?: "Collaborator";
  id: Scalars["ID"]["output"];
  project: Project;
  role: Role;
  user: User;
};

export type Invitation = {
  __typename?: "Invitation";
  from: User;
  id: Scalars["ID"]["output"];
  project: Project;
  to: User;
};

export type Label = {
  __typename?: "Label";
  color: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  acceptInvitation: Invitation;
  addNotificationToken: NotificationToken;
  addTimePreset: Array<TimePreset>;
  createNewProject: Project;
  createReminder: Reminder;
  createSection: Section;
  createSubTask: Task;
  createTask: Task;
  deleteProject: Project;
  deleteReminder: Reminder;
  deleteSection: Section;
  deleteTask: Task;
  inviteCollaborator: Invitation;
  rejectInvitation: Invitation;
  removeCollaborator: Project;
  removeNotificationToken: NotificationToken;
  removeTimePreset: Array<TimePreset>;
  rerollApiToken: ApiToken;
  updateProject: Project;
  updateSection: Section;
  updateTask: Task;
};

export type MutationAcceptInvitationArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationAddNotificationTokenArgs = {
  token?: InputMaybe<Scalars["String"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationAddTimePresetArgs = {
  time?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationCreateNewProjectArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationCreateReminderArgs = {
  taskId?: InputMaybe<Scalars["Int"]["input"]>;
  time?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type MutationCreateSectionArgs = {
  projectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationCreateSubTaskArgs = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  parentTaskId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationCreateTaskArgs = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  sectionId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationDeleteProjectArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationDeleteReminderArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationDeleteSectionArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationDeleteTaskArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationInviteCollaboratorArgs = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  projectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationRejectInvitationArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationRemoveCollaboratorArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  projectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationRemoveNotificationTokenArgs = {
  token?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationRemoveTimePresetArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationRerollApiTokenArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationUpdateProjectArgs = {
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationUpdateSectionArgs = {
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationUpdateTaskArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type NotificationToken = {
  __typename?: "NotificationToken";
  id: Scalars["ID"]["output"];
  token: Scalars["String"]["output"];
  userAgent: Scalars["String"]["output"];
};

export type Project = {
  __typename?: "Project";
  archived: Scalars["Boolean"]["output"];
  collaborators: Array<Collaborator>;
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  invitations: Array<Invitation>;
  name: Scalars["String"]["output"];
  owner: User;
  ownerId: Scalars["String"]["output"];
  sections: Array<Section>;
  task: Task;
};

export type ProjectSectionsArgs = {
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ProjectTaskArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  ok: Scalars["Boolean"]["output"];
};

export type Reminder = {
  __typename?: "Reminder";
  id: Scalars["ID"]["output"];
  task: Task;
  taskId: Scalars["Int"]["output"];
  time: Scalars["DateTime"]["output"];
};

export enum Role {
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

export type Section = {
  __typename?: "Section";
  archived: Scalars["Boolean"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  project: Project;
  projectId: Scalars["String"]["output"];
  tasks: Array<Task>;
};

export type Task = {
  __typename?: "Task";
  completed: Scalars["Boolean"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  description: Scalars["String"]["output"];
  dueDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  labels: Array<Label>;
  name: Scalars["String"]["output"];
  owner: User;
  ownerId: Scalars["String"]["output"];
  parentTask?: Maybe<Task>;
  parentTaskId?: Maybe<Scalars["Int"]["output"]>;
  priority: Scalars["Int"]["output"];
  project: Project;
  projectId: Scalars["String"]["output"];
  reminders: Array<Reminder>;
  section: Section;
  sectionId?: Maybe<Scalars["Int"]["output"]>;
  startDate?: Maybe<Scalars["DateTime"]["output"]>;
  subTasks: Array<Task>;
  subtaskCounts: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type TimePreset = {
  __typename?: "TimePreset";
  id: Scalars["ID"]["output"];
  time: Scalars["Int"]["output"];
  userId?: Maybe<Scalars["String"]["output"]>;
};

export type User = {
  __typename?: "User";
  apiToken: ApiToken;
  apiTokens: Array<ApiToken>;
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  incomingInvitations: Array<Invitation>;
  name?: Maybe<Scalars["String"]["output"]>;
  notificationTokens: Array<NotificationToken>;
  outgoingInvitations: Array<Invitation>;
  project: Project;
  projects: Array<Project>;
  tasks: Array<Task>;
  timePresets: Array<TimePreset>;
};

export type UserProjectArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserProjectsArgs = {
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UserTasksArgs = {
  completed?: InputMaybe<Scalars["Boolean"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type DeleteProjectMutation = {
  __typename?: "Mutation";
  deleteProject: { __typename?: "Project"; id: string };
};

export type ShareModalQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type ShareModalQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      owner: {
        __typename?: "User";
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      invitations: Array<{
        __typename?: "Invitation";
        id: string;
        to: {
          __typename?: "User";
          name?: string | null;
          email?: string | null;
          image?: string | null;
        };
      }>;
      collaborators: Array<{
        __typename?: "Collaborator";
        id: string;
        role: Role;
        user: {
          __typename?: "User";
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
        };
      }>;
    };
  } | null;
};

export type RemoveCollaboratorMutationVariables = Exact<{
  id: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
}>;

export type RemoveCollaboratorMutation = {
  __typename?: "Mutation";
  removeCollaborator: {
    __typename?: "Project";
    collaborators: Array<{ __typename?: "Collaborator"; id: string }>;
  };
};

export type InviteCollaboratorMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
}>;

export type InviteCollaboratorMutation = {
  __typename?: "Mutation";
  inviteCollaborator: { __typename?: "Invitation"; id: string };
};

export type CompletedTasksQueryVariables = Exact<{ [key: string]: never }>;

export type CompletedTasksQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    tasks: Array<{
      __typename?: "Task";
      id: string;
      name: string;
      description: string;
      projectId: string;
      startDate?: Date | null;
      dueDate?: Date | null;
      createdAt: Date;
      completed: boolean;
    }>;
  } | null;
};

export type GetApiTokenQueryVariables = Exact<{ [key: string]: never }>;

export type GetApiTokenQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    apiToken: { __typename?: "ApiToken"; id: string };
  } | null;
};

export type RerollApiTokenMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type RerollApiTokenMutation = {
  __typename?: "Mutation";
  rerollApiToken: { __typename?: "ApiToken"; id: string };
};

export type GetNotificationTokensQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetNotificationTokensQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    notificationTokens: Array<{
      __typename?: "NotificationToken";
      id: string;
      token: string;
    }>;
  } | null;
};

export type AddNotificationTokenMutationVariables = Exact<{
  token: Scalars["String"]["input"];
  userAgent: Scalars["String"]["input"];
}>;

export type AddNotificationTokenMutation = {
  __typename?: "Mutation";
  addNotificationToken: {
    __typename?: "NotificationToken";
    id: string;
    token: string;
    userAgent: string;
  };
};

export type RemoveNotificationTokenMutationVariables = Exact<{
  token: Scalars["String"]["input"];
}>;

export type RemoveNotificationTokenMutation = {
  __typename?: "Mutation";
  removeNotificationToken: { __typename?: "NotificationToken"; id: string };
};

export type AddTimePresetMutationVariables = Exact<{
  time: Scalars["Int"]["input"];
}>;

export type AddTimePresetMutation = {
  __typename?: "Mutation";
  addTimePreset: Array<{ __typename?: "TimePreset"; id: string; time: number }>;
};

export type RemoveTimePresetMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type RemoveTimePresetMutation = {
  __typename?: "Mutation";
  removeTimePreset: Array<{
    __typename?: "TimePreset";
    id: string;
    time: number;
  }>;
};

export type GetArchivedProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetArchivedProjectsQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    projects: Array<{
      __typename?: "Project";
      id: string;
      name: string;
      archived: boolean;
    }>;
  } | null;
};

export type GetTasksQueryVariables = Exact<{ [key: string]: never }>;

export type GetTasksQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    tasks: Array<{
      __typename?: "Task";
      id: string;
      name: string;
      description: string;
      completed: boolean;
      projectId: string;
      dueDate?: Date | null;
      startDate?: Date | null;
      createdAt: Date;
      section: {
        __typename?: "Section";
        id: string;
        name: string;
        archived: boolean;
      };
      project: { __typename?: "Project"; id: string; name: string };
    }>;
  } | null;
};

export type ProjectAndInvitationListQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ProjectAndInvitationListQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    projects: Array<{
      __typename?: "Project";
      id: string;
      name: string;
      createdAt: Date;
      owner: {
        __typename?: "User";
        id: string;
        name?: string | null;
        image?: string | null;
      };
      collaborators: Array<{
        __typename?: "Collaborator";
        id: string;
        user: {
          __typename?: "User";
          name?: string | null;
          image?: string | null;
        };
      }>;
    }>;
    incomingInvitations: Array<{
      __typename?: "Invitation";
      id: string;
      from: { __typename?: "User"; id: string; name?: string | null };
      project: { __typename?: "Project"; id: string; name: string };
    }>;
  } | null;
};

export type AcceptInvitationMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type AcceptInvitationMutation = {
  __typename?: "Mutation";
  acceptInvitation: { __typename?: "Invitation"; id: string };
};

export type RejectInvitationMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type RejectInvitationMutation = {
  __typename?: "Mutation";
  acceptInvitation: { __typename?: "Invitation"; id: string };
};

export type GetProjectMetaQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetProjectMetaQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      name: string;
      archived: boolean;
      ownerId: string;
    };
  } | null;
};

export type ArchiveProjectMutationVariables = Exact<{
  id: Scalars["String"]["input"];
  archived: Scalars["Boolean"]["input"];
}>;

export type ArchiveProjectMutation = {
  __typename?: "Mutation";
  updateProject: {
    __typename?: "Project";
    id: string;
    name: string;
    archived: boolean;
  };
};

export type GetProjectQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetProjectQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      name: string;
      archived: boolean;
      sections: Array<{
        __typename?: "Section";
        projectId: string;
        archived: boolean;
        createdAt: Date;
        id: string;
        name: string;
        tasks: Array<{
          __typename?: "Task";
          id: string;
          projectId: string;
          parentTaskId?: number | null;
          sectionId?: number | null;
          name: string;
          description: string;
          dueDate?: Date | null;
          createdAt: Date;
          completed: boolean;
          startDate?: Date | null;
        }>;
      }>;
    };
  } | null;
};

export type UpdateSectionMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type UpdateSectionMutation = {
  __typename?: "Mutation";
  updateSection: {
    __typename?: "Section";
    id: string;
    name: string;
    archived: boolean;
  };
};

export type CreateSectionMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type CreateSectionMutation = {
  __typename?: "Mutation";
  createSection: {
    __typename?: "Section";
    id: string;
    name: string;
    archived: boolean;
  };
};

export type ProjectsListQueryVariables = Exact<{ [key: string]: never }>;

export type ProjectsListQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    projects: Array<{
      __typename?: "Project";
      ownerId: string;
      id: string;
      name: string;
    }>;
  } | null;
};

export type GetArchivedSectionsQueryVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type GetArchivedSectionsQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      sections: Array<{
        __typename?: "Section";
        id: string;
        name: string;
        archived: boolean;
      }>;
    };
  } | null;
};

export type NewProjectMutationVariables = Exact<{
  name: Scalars["String"]["input"];
}>;

export type NewProjectMutation = {
  __typename?: "Mutation";
  createNewProject: { __typename?: "Project"; id: string };
};

export type ProjectListQueryVariables = Exact<{ [key: string]: never }>;

export type ProjectListQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    projects: Array<{
      __typename?: "Project";
      id: string;
      name: string;
      ownerId: string;
    }>;
  } | null;
};

export type DeleteSectionMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteSectionMutation = {
  __typename?: "Mutation";
  deleteSection: {
    __typename?: "Section";
    id: string;
    name: string;
    archived: boolean;
  };
};

export type CreateTaskMutationVariables = Exact<{
  sectionId: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
}>;

export type CreateTaskMutation = {
  __typename?: "Mutation";
  createTask: {
    __typename?: "Task";
    id: string;
    sectionId?: number | null;
    parentTaskId?: number | null;
    projectId: string;
    name: string;
    description: string;
    completed: boolean;
    subtaskCounts: string;
  };
};

export type CreateSubTaskMutationVariables = Exact<{
  parentTaskId: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
}>;

export type CreateSubTaskMutation = {
  __typename?: "Mutation";
  createSubTask: {
    __typename?: "Task";
    id: string;
    sectionId?: number | null;
    parentTaskId?: number | null;
    projectId: string;
    name: string;
    description: string;
    completed: boolean;
    subtaskCounts: string;
  };
};

export type GetSectionsQueryVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type GetSectionsQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      sections: Array<{ __typename?: "Section"; id: string; name: string }>;
    };
  } | null;
};

export type CreateReminderMutationVariables = Exact<{
  taskId: Scalars["Int"]["input"];
  time: Scalars["DateTime"]["input"];
}>;

export type CreateReminderMutation = {
  __typename?: "Mutation";
  createReminder: {
    __typename?: "Reminder";
    taskId: number;
    id: string;
    time: Date;
  };
};

export type DeleteReminderMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteReminderMutation = {
  __typename?: "Mutation";
  deleteReminder: {
    __typename?: "Reminder";
    taskId: number;
    id: string;
    time: Date;
  };
};

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteTaskMutation = {
  __typename?: "Mutation";
  deleteTask: { __typename?: "Task"; id: string };
};

export type GetTaskQueryVariables = Exact<{
  projectId: Scalars["String"]["input"];
  taskId: Scalars["Int"]["input"];
}>;

export type GetTaskQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    project: {
      __typename?: "Project";
      id: string;
      task: {
        __typename?: "Task";
        id: string;
        name: string;
        description: string;
        parentTaskId?: number | null;
        completed: boolean;
        dueDate?: Date | null;
        projectId: string;
        startDate?: Date | null;
        reminders: Array<{
          __typename?: "Reminder";
          id: string;
          taskId: number;
          time: Date;
        }>;
        subTasks: Array<{
          __typename?: "Task";
          id: string;
          name: string;
          description: string;
          completed: boolean;
          priority: number;
          createdAt: Date;
          updatedAt: Date;
          startDate?: Date | null;
          dueDate?: Date | null;
          sectionId?: number | null;
          parentTaskId?: number | null;
          ownerId: string;
          projectId: string;
        }>;
        parentTask?: { __typename?: "Task"; id: string; name: string } | null;
      };
    };
  } | null;
};

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type UpdateTaskMutation = {
  __typename?: "Mutation";
  updateTask: {
    __typename?: "Task";
    id: string;
    name: string;
    description: string;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    completed: boolean;
    startDate?: Date | null;
    dueDate?: Date | null;
    sectionId?: number | null;
    parentTaskId?: number | null;
    ownerId: string;
    projectId: string;
  };
};

export type GetTimePresetsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTimePresetsQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    timePresets: Array<{ __typename?: "TimePreset"; id: string; time: number }>;
  } | null;
};

export const DeleteProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
>;
export const ShareModalDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "shareModal" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "email" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "image" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "invitations" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "to" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "email" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "collaborators" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "role" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "user" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "email" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ShareModalQuery, ShareModalQueryVariables>;
export const RemoveCollaboratorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "removeCollaborator" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeCollaborator" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "projectId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "projectId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "collaborators" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveCollaboratorMutation,
  RemoveCollaboratorMutationVariables
>;
export const InviteCollaboratorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "inviteCollaborator" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "inviteCollaborator" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "projectId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "projectId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InviteCollaboratorMutation,
  InviteCollaboratorMutationVariables
>;
export const CompletedTasksDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "completedTasks" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tasks" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "completed" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "projectId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "dueDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "completed" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompletedTasksQuery, CompletedTasksQueryVariables>;
export const GetApiTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getApiToken" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "apiToken" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetApiTokenQuery, GetApiTokenQueryVariables>;
export const RerollApiTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "rerollApiToken" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "rerollApiToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RerollApiTokenMutation,
  RerollApiTokenMutationVariables
>;
export const GetNotificationTokensDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getNotificationTokens" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "notificationTokens" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "token" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNotificationTokensQuery,
  GetNotificationTokensQueryVariables
>;
export const AddNotificationTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "addNotificationToken" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "token" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userAgent" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addNotificationToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "token" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "token" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "userAgent" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userAgent" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "token" } },
                { kind: "Field", name: { kind: "Name", value: "userAgent" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddNotificationTokenMutation,
  AddNotificationTokenMutationVariables
>;
export const RemoveNotificationTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "removeNotificationToken" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "token" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeNotificationToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "token" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "token" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveNotificationTokenMutation,
  RemoveNotificationTokenMutationVariables
>;
export const AddTimePresetDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "addTimePreset" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "time" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addTimePreset" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "time" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "time" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "time" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddTimePresetMutation,
  AddTimePresetMutationVariables
>;
export const RemoveTimePresetDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "removeTimePreset" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeTimePreset" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "time" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveTimePresetMutation,
  RemoveTimePresetMutationVariables
>;
export const GetArchivedProjectsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getArchivedProjects" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "archived" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "archived" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArchivedProjectsQuery,
  GetArchivedProjectsQueryVariables
>;
export const GetTasksDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTasks" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tasks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "completed" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "section" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "archived" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "projectId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "dueDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTasksQuery, GetTasksQueryVariables>;
export const ProjectAndInvitationListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "projectAndInvitationList" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "image" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "collaborators" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "user" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "incomingInvitations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "from" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectAndInvitationListQuery,
  ProjectAndInvitationListQueryVariables
>;
export const AcceptInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "acceptInvitation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "acceptInvitation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AcceptInvitationMutation,
  AcceptInvitationMutationVariables
>;
export const RejectInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "rejectInvitation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "acceptInvitation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RejectInvitationMutation,
  RejectInvitationMutationVariables
>;
export const GetProjectMetaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getProjectMeta" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "archived" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ownerId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProjectMetaQuery, GetProjectMetaQueryVariables>;
export const ArchiveProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "archiveProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "archived" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "archived" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "archived" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "archived" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ArchiveProjectMutation,
  ArchiveProjectMutationVariables
>;
export const GetProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "archived" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sections" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "projectId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "archived" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "tasks" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "projectId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "parentTaskId",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "sectionId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "description",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "dueDate" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "completed" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "startDate" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;
export const UpdateSectionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateSection" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "archived" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateSection" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "archived" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "archived" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "archived" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateSectionMutation,
  UpdateSectionMutationVariables
>;
export const CreateSectionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createSection" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createSection" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "projectId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "projectId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "archived" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSectionMutation,
  CreateSectionMutationVariables
>;
export const ProjectsListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "projectsList" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ownerId" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectsListQuery, ProjectsListQueryVariables>;
export const GetArchivedSectionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getArchivedSections" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sections" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "archived" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "archived" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArchivedSectionsQuery,
  GetArchivedSectionsQueryVariables
>;
export const NewProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "newProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createNewProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewProjectMutation, NewProjectMutationVariables>;
export const ProjectListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "projectList" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ownerId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectListQuery, ProjectListQueryVariables>;
export const DeleteSectionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteSection" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteSection" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "archived" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteSectionMutation,
  DeleteSectionMutationVariables
>;
export const CreateTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sectionId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dueDate" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "DateTime" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sectionId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sectionId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "description" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "description" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dueDate" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dueDate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "sectionId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parentTaskId" },
                },
                { kind: "Field", name: { kind: "Name", value: "projectId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "completed" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subtaskCounts" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateSubTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createSubTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "parentTaskId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dueDate" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "DateTime" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createSubTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "parentTaskId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "parentTaskId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "description" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "description" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dueDate" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dueDate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "sectionId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parentTaskId" },
                },
                { kind: "Field", name: { kind: "Name", value: "projectId" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "completed" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subtaskCounts" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSubTaskMutation,
  CreateSubTaskMutationVariables
>;
export const GetSectionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getSections" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sections" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSectionsQuery, GetSectionsQueryVariables>;
export const CreateReminderDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createReminder" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "taskId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "time" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DateTime" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createReminder" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "taskId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "taskId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "time" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "time" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "taskId" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "time" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateReminderMutation,
  CreateReminderMutationVariables
>;
export const DeleteReminderDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteReminder" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteReminder" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "taskId" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "time" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteReminderMutation,
  DeleteReminderMutationVariables
>;
export const DeleteTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const GetTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "taskId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "task" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "id" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "taskId" },
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "description" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "parentTaskId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "completed" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "dueDate" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "projectId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "startDate" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "reminders" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "taskId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "time" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "subTasks" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "description",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "completed" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "priority" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "updatedAt" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "startDate" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "dueDate" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "sectionId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "parentTaskId",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "ownerId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "projectId" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "parentTask" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
export const UpdateTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "priority" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "completed" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                { kind: "Field", name: { kind: "Name", value: "sectionId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parentTaskId" },
                },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "projectId" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const GetTimePresetsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTimePresets" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "timePresets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "time" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTimePresetsQuery, GetTimePresetsQueryVariables>;
