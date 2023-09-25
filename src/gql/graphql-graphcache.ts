import { offlineExchange } from "@urql/exchange-graphcache";
import {
  Resolver as GraphCacheResolver,
  UpdateResolver as GraphCacheUpdateResolver,
  OptimisticMutationResolver as GraphCacheOptimisticMutationResolver,
} from "@urql/exchange-graphcache";

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

export type WithTypename<T extends { __typename?: any }> = Partial<T> & {
  __typename: NonNullable<T["__typename"]>;
};

export type GraphCacheKeysConfig = {
  ApiToken?: (data: WithTypename<ApiToken>) => null | string;
  Collaborator?: (data: WithTypename<Collaborator>) => null | string;
  Invitation?: (data: WithTypename<Invitation>) => null | string;
  Label?: (data: WithTypename<Label>) => null | string;
  NotificationToken?: (data: WithTypename<NotificationToken>) => null | string;
  Project?: (data: WithTypename<Project>) => null | string;
  Reminder?: (data: WithTypename<Reminder>) => null | string;
  Section?: (data: WithTypename<Section>) => null | string;
  Task?: (data: WithTypename<Task>) => null | string;
  TimePreset?: (data: WithTypename<TimePreset>) => null | string;
  User?: (data: WithTypename<User>) => null | string;
};

export type GraphCacheResolvers = {
  Query?: {
    me?: GraphCacheResolver<
      WithTypename<Query>,
      Record<string, never>,
      WithTypename<User> | string
    >;
    ok?: GraphCacheResolver<
      WithTypename<Query>,
      Record<string, never>,
      Scalars["Boolean"] | string
    >;
  };
  ApiToken?: {
    generatedAt?: GraphCacheResolver<
      WithTypename<ApiToken>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<ApiToken>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
  };
  Collaborator?: {
    id?: GraphCacheResolver<
      WithTypename<Collaborator>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    project?: GraphCacheResolver<
      WithTypename<Collaborator>,
      Record<string, never>,
      WithTypename<Project> | string
    >;
    role?: GraphCacheResolver<
      WithTypename<Collaborator>,
      Record<string, never>,
      Role | string
    >;
    user?: GraphCacheResolver<
      WithTypename<Collaborator>,
      Record<string, never>,
      WithTypename<User> | string
    >;
  };
  Invitation?: {
    from?: GraphCacheResolver<
      WithTypename<Invitation>,
      Record<string, never>,
      WithTypename<User> | string
    >;
    id?: GraphCacheResolver<
      WithTypename<Invitation>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    project?: GraphCacheResolver<
      WithTypename<Invitation>,
      Record<string, never>,
      WithTypename<Project> | string
    >;
    to?: GraphCacheResolver<
      WithTypename<Invitation>,
      Record<string, never>,
      WithTypename<User> | string
    >;
  };
  Label?: {
    color?: GraphCacheResolver<
      WithTypename<Label>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<Label>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    name?: GraphCacheResolver<
      WithTypename<Label>,
      Record<string, never>,
      Scalars["String"] | string
    >;
  };
  NotificationToken?: {
    id?: GraphCacheResolver<
      WithTypename<NotificationToken>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    token?: GraphCacheResolver<
      WithTypename<NotificationToken>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    userAgent?: GraphCacheResolver<
      WithTypename<NotificationToken>,
      Record<string, never>,
      Scalars["String"] | string
    >;
  };
  Project?: {
    archived?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Scalars["Boolean"] | string
    >;
    collaborators?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Array<WithTypename<Collaborator> | string>
    >;
    createdAt?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    invitations?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Array<WithTypename<Invitation> | string>
    >;
    name?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    owner?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      WithTypename<User> | string
    >;
    ownerId?: GraphCacheResolver<
      WithTypename<Project>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    sections?: GraphCacheResolver<
      WithTypename<Project>,
      ProjectSectionsArgs,
      Array<WithTypename<Section> | string>
    >;
    task?: GraphCacheResolver<
      WithTypename<Project>,
      ProjectTaskArgs,
      WithTypename<Task> | string
    >;
  };
  Reminder?: {
    id?: GraphCacheResolver<
      WithTypename<Reminder>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    task?: GraphCacheResolver<
      WithTypename<Reminder>,
      Record<string, never>,
      WithTypename<Task> | string
    >;
    taskId?: GraphCacheResolver<
      WithTypename<Reminder>,
      Record<string, never>,
      Scalars["Int"] | string
    >;
    time?: GraphCacheResolver<
      WithTypename<Reminder>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
  };
  Section?: {
    archived?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Scalars["Boolean"] | string
    >;
    createdAt?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    name?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    project?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      WithTypename<Project> | string
    >;
    projectId?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    tasks?: GraphCacheResolver<
      WithTypename<Section>,
      Record<string, never>,
      Array<WithTypename<Task> | string>
    >;
  };
  Task?: {
    completed?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["Boolean"] | string
    >;
    createdAt?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    description?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    dueDate?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    labels?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Array<WithTypename<Label> | string>
    >;
    name?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    owner?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      WithTypename<User> | string
    >;
    ownerId?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    parentTask?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      WithTypename<Task> | string
    >;
    parentTaskId?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["Int"] | string
    >;
    priority?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["Int"] | string
    >;
    project?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      WithTypename<Project> | string
    >;
    projectId?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    reminders?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Array<WithTypename<Reminder> | string>
    >;
    section?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      WithTypename<Section> | string
    >;
    sectionId?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["Int"] | string
    >;
    startDate?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
    subTasks?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Array<WithTypename<Task> | string>
    >;
    subtaskCounts?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    updatedAt?: GraphCacheResolver<
      WithTypename<Task>,
      Record<string, never>,
      Scalars["DateTime"] | string
    >;
  };
  TimePreset?: {
    id?: GraphCacheResolver<
      WithTypename<TimePreset>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    time?: GraphCacheResolver<
      WithTypename<TimePreset>,
      Record<string, never>,
      Scalars["Int"] | string
    >;
    userId?: GraphCacheResolver<
      WithTypename<TimePreset>,
      Record<string, never>,
      Scalars["String"] | string
    >;
  };
  User?: {
    apiToken?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      WithTypename<ApiToken> | string
    >;
    apiTokens?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Array<WithTypename<ApiToken> | string>
    >;
    email?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    id?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Scalars["ID"] | string
    >;
    image?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    incomingInvitations?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Array<WithTypename<Invitation> | string>
    >;
    name?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Scalars["String"] | string
    >;
    notificationTokens?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Array<WithTypename<NotificationToken> | string>
    >;
    outgoingInvitations?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Array<WithTypename<Invitation> | string>
    >;
    project?: GraphCacheResolver<
      WithTypename<User>,
      UserProjectArgs,
      WithTypename<Project> | string
    >;
    projects?: GraphCacheResolver<
      WithTypename<User>,
      UserProjectsArgs,
      Array<WithTypename<Project> | string>
    >;
    tasks?: GraphCacheResolver<
      WithTypename<User>,
      UserTasksArgs,
      Array<WithTypename<Task> | string>
    >;
    timePresets?: GraphCacheResolver<
      WithTypename<User>,
      Record<string, never>,
      Array<WithTypename<TimePreset> | string>
    >;
  };
};

export type GraphCacheOptimisticUpdaters = {
  acceptInvitation?: GraphCacheOptimisticMutationResolver<
    MutationAcceptInvitationArgs,
    WithTypename<Invitation>
  >;
  addNotificationToken?: GraphCacheOptimisticMutationResolver<
    MutationAddNotificationTokenArgs,
    WithTypename<NotificationToken>
  >;
  addTimePreset?: GraphCacheOptimisticMutationResolver<
    MutationAddTimePresetArgs,
    Array<WithTypename<TimePreset>>
  >;
  createNewProject?: GraphCacheOptimisticMutationResolver<
    MutationCreateNewProjectArgs,
    WithTypename<Project>
  >;
  createReminder?: GraphCacheOptimisticMutationResolver<
    MutationCreateReminderArgs,
    WithTypename<Reminder>
  >;
  createSection?: GraphCacheOptimisticMutationResolver<
    MutationCreateSectionArgs,
    WithTypename<Section>
  >;
  createSubTask?: GraphCacheOptimisticMutationResolver<
    MutationCreateSubTaskArgs,
    WithTypename<Task>
  >;
  createTask?: GraphCacheOptimisticMutationResolver<
    MutationCreateTaskArgs,
    WithTypename<Task>
  >;
  deleteProject?: GraphCacheOptimisticMutationResolver<
    MutationDeleteProjectArgs,
    WithTypename<Project>
  >;
  deleteReminder?: GraphCacheOptimisticMutationResolver<
    MutationDeleteReminderArgs,
    WithTypename<Reminder>
  >;
  deleteSection?: GraphCacheOptimisticMutationResolver<
    MutationDeleteSectionArgs,
    WithTypename<Section>
  >;
  deleteTask?: GraphCacheOptimisticMutationResolver<
    MutationDeleteTaskArgs,
    WithTypename<Task>
  >;
  inviteCollaborator?: GraphCacheOptimisticMutationResolver<
    MutationInviteCollaboratorArgs,
    WithTypename<Invitation>
  >;
  rejectInvitation?: GraphCacheOptimisticMutationResolver<
    MutationRejectInvitationArgs,
    WithTypename<Invitation>
  >;
  removeCollaborator?: GraphCacheOptimisticMutationResolver<
    MutationRemoveCollaboratorArgs,
    WithTypename<Project>
  >;
  removeNotificationToken?: GraphCacheOptimisticMutationResolver<
    MutationRemoveNotificationTokenArgs,
    WithTypename<NotificationToken>
  >;
  removeTimePreset?: GraphCacheOptimisticMutationResolver<
    MutationRemoveTimePresetArgs,
    Array<WithTypename<TimePreset>>
  >;
  rerollApiToken?: GraphCacheOptimisticMutationResolver<
    MutationRerollApiTokenArgs,
    WithTypename<ApiToken>
  >;
  updateProject?: GraphCacheOptimisticMutationResolver<
    MutationUpdateProjectArgs,
    WithTypename<Project>
  >;
  updateSection?: GraphCacheOptimisticMutationResolver<
    MutationUpdateSectionArgs,
    WithTypename<Section>
  >;
  updateTask?: GraphCacheOptimisticMutationResolver<
    MutationUpdateTaskArgs,
    WithTypename<Task>
  >;
};

export type GraphCacheUpdaters = {
  Mutation?: {
    acceptInvitation?: GraphCacheUpdateResolver<
      { acceptInvitation: WithTypename<Invitation> },
      MutationAcceptInvitationArgs
    >;
    addNotificationToken?: GraphCacheUpdateResolver<
      { addNotificationToken: WithTypename<NotificationToken> },
      MutationAddNotificationTokenArgs
    >;
    addTimePreset?: GraphCacheUpdateResolver<
      { addTimePreset: Array<WithTypename<TimePreset>> },
      MutationAddTimePresetArgs
    >;
    createNewProject?: GraphCacheUpdateResolver<
      { createNewProject: WithTypename<Project> },
      MutationCreateNewProjectArgs
    >;
    createReminder?: GraphCacheUpdateResolver<
      { createReminder: WithTypename<Reminder> },
      MutationCreateReminderArgs
    >;
    createSection?: GraphCacheUpdateResolver<
      { createSection: WithTypename<Section> },
      MutationCreateSectionArgs
    >;
    createSubTask?: GraphCacheUpdateResolver<
      { createSubTask: WithTypename<Task> },
      MutationCreateSubTaskArgs
    >;
    createTask?: GraphCacheUpdateResolver<
      { createTask: WithTypename<Task> },
      MutationCreateTaskArgs
    >;
    deleteProject?: GraphCacheUpdateResolver<
      { deleteProject: WithTypename<Project> },
      MutationDeleteProjectArgs
    >;
    deleteReminder?: GraphCacheUpdateResolver<
      { deleteReminder: WithTypename<Reminder> },
      MutationDeleteReminderArgs
    >;
    deleteSection?: GraphCacheUpdateResolver<
      { deleteSection: WithTypename<Section> },
      MutationDeleteSectionArgs
    >;
    deleteTask?: GraphCacheUpdateResolver<
      { deleteTask: WithTypename<Task> },
      MutationDeleteTaskArgs
    >;
    inviteCollaborator?: GraphCacheUpdateResolver<
      { inviteCollaborator: WithTypename<Invitation> },
      MutationInviteCollaboratorArgs
    >;
    rejectInvitation?: GraphCacheUpdateResolver<
      { rejectInvitation: WithTypename<Invitation> },
      MutationRejectInvitationArgs
    >;
    removeCollaborator?: GraphCacheUpdateResolver<
      { removeCollaborator: WithTypename<Project> },
      MutationRemoveCollaboratorArgs
    >;
    removeNotificationToken?: GraphCacheUpdateResolver<
      { removeNotificationToken: WithTypename<NotificationToken> },
      MutationRemoveNotificationTokenArgs
    >;
    removeTimePreset?: GraphCacheUpdateResolver<
      { removeTimePreset: Array<WithTypename<TimePreset>> },
      MutationRemoveTimePresetArgs
    >;
    rerollApiToken?: GraphCacheUpdateResolver<
      { rerollApiToken: WithTypename<ApiToken> },
      MutationRerollApiTokenArgs
    >;
    updateProject?: GraphCacheUpdateResolver<
      { updateProject: WithTypename<Project> },
      MutationUpdateProjectArgs
    >;
    updateSection?: GraphCacheUpdateResolver<
      { updateSection: WithTypename<Section> },
      MutationUpdateSectionArgs
    >;
    updateTask?: GraphCacheUpdateResolver<
      { updateTask: WithTypename<Task> },
      MutationUpdateTaskArgs
    >;
  };
  Subscription?: {};
};

export type GraphCacheConfig = Parameters<typeof offlineExchange>[0] & {
  updates?: GraphCacheUpdaters;
  keys?: GraphCacheKeysConfig;
  optimistic?: GraphCacheOptimisticUpdaters;
  resolvers?: GraphCacheResolvers;
};
