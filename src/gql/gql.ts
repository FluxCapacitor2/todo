/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  mutation deleteProject($id: String!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteProjectDocument,
  "\n  query shareModal($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        owner {\n          id\n          name\n          email\n          image\n        }\n        invitations {\n          id\n          to {\n            name\n            email\n            image\n          }\n        }\n        collaborators {\n          id\n          role\n          user {\n            id\n            name\n            email\n            image\n          }\n        }\n      }\n    }\n  }\n":
    types.ShareModalDocument,
  "\n  mutation removeCollaborator($id: String!, $projectId: String!) {\n    removeCollaborator(id: $id, projectId: $projectId) {\n      collaborators {\n        id\n      }\n    }\n  }\n":
    types.RemoveCollaboratorDocument,
  "\n  mutation inviteCollaborator($projectId: String!, $email: String!) {\n    inviteCollaborator(projectId: $projectId, email: $email) {\n      id\n    }\n  }\n":
    types.InviteCollaboratorDocument,
  "\n  query completedTasks {\n    me {\n      tasks(completed: true) {\n        id\n        name\n        description\n        projectId\n        startDate\n        dueDate\n        createdAt\n        completed\n      }\n    }\n  }\n":
    types.CompletedTasksDocument,
  "\n  query getApiToken {\n    me {\n      id\n      apiToken {\n        id\n      }\n    }\n  }\n":
    types.GetApiTokenDocument,
  "\n  mutation rerollApiToken($id: String!) {\n    rerollApiToken(id: $id) {\n      id\n    }\n  }\n":
    types.RerollApiTokenDocument,
  "\n  query getNotificationTokens {\n    me {\n      id\n      notificationTokens {\n        id\n        token\n      }\n    }\n  }\n":
    types.GetNotificationTokensDocument,
  "\n  mutation addNotificationToken($token: String!, $userAgent: String!) {\n    addNotificationToken(token: $token, userAgent: $userAgent) {\n      id\n      token\n      userAgent\n    }\n  }\n":
    types.AddNotificationTokenDocument,
  "\n  mutation removeNotificationToken($token: String!) {\n    removeNotificationToken(token: $token) {\n      id\n    }\n  }\n":
    types.RemoveNotificationTokenDocument,
  "\n  mutation addTimePreset($time: Int!) {\n    addTimePreset(time: $time) {\n      id\n      time\n    }\n  }\n":
    types.AddTimePresetDocument,
  "\n  mutation removeTimePreset($id: Int!) {\n    removeTimePreset(id: $id) {\n      id\n      time\n    }\n  }\n":
    types.RemoveTimePresetDocument,
  "\n  query getArchivedProjects {\n    me {\n      id\n      projects(archived: true) {\n        id\n        name\n        archived\n      }\n    }\n  }\n":
    types.GetArchivedProjectsDocument,
  "\n  query getTasks {\n    me {\n      id\n      tasks {\n        id\n        name\n        description\n        completed\n        section {\n          id\n          name\n          archived\n        }\n        projectId\n        dueDate\n        startDate\n        createdAt\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n":
    types.GetTasksDocument,
  "\n  query projectAndInvitationList {\n    me {\n      id\n      projects {\n        id\n        name\n        createdAt\n        owner {\n          id\n          name\n          image\n        }\n        collaborators {\n          id\n          user {\n            name\n            image\n          }\n        }\n      }\n      incomingInvitations {\n        id\n        from {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n":
    types.ProjectAndInvitationListDocument,
  "\n  mutation acceptInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n":
    types.AcceptInvitationDocument,
  "\n  mutation rejectInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n":
    types.RejectInvitationDocument,
  "\n  query getProjectMeta($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        ownerId\n      }\n    }\n  }\n":
    types.GetProjectMetaDocument,
  "\n  mutation archiveProject($id: String!, $archived: Boolean!) {\n    updateProject(id: $id, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n":
    types.ArchiveProjectDocument,
  "\n  query getProject($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        sections {\n          projectId\n          archived\n          createdAt\n          id\n          name\n          tasks {\n            id\n            projectId\n            parentTaskId\n            sectionId\n            name\n            description\n            dueDate\n            createdAt\n            completed\n            startDate\n          }\n        }\n      }\n    }\n  }\n":
    types.GetProjectDocument,
  "\n  mutation updateSection($id: Int!, $name: String, $archived: Boolean) {\n    updateSection(id: $id, name: $name, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n":
    types.UpdateSectionDocument,
  "\n  mutation createSection($projectId: String!) {\n    createSection(projectId: $projectId) {\n      id\n      name\n      archived\n    }\n  }\n":
    types.CreateSectionDocument,
  "\n  query projectsList {\n    me {\n      id\n      projects {\n        ownerId\n        id\n        name\n      }\n    }\n  }\n":
    types.ProjectsListDocument,
  "\n  query getArchivedSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections(archived: true) {\n          id\n          name\n          archived\n        }\n      }\n    }\n  }\n":
    types.GetArchivedSectionsDocument,
  "\n  mutation newProject($name: String!) {\n    createNewProject(name: $name) {\n      id\n    }\n  }\n":
    types.NewProjectDocument,
  "\n  query projectList {\n    me {\n      id\n      projects {\n        id\n        name\n        ownerId\n      }\n    }\n  }\n":
    types.ProjectListDocument,
  "\n  mutation deleteSection($id: Int!) {\n    deleteSection(id: $id) {\n      id\n      name\n      archived\n    }\n  }\n":
    types.DeleteSectionDocument,
  "\n  mutation createTask(\n    $sectionId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createTask(\n      sectionId: $sectionId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n":
    types.CreateTaskDocument,
  "\n  mutation createSubTask(\n    $parentTaskId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createSubTask(\n      parentTaskId: $parentTaskId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n":
    types.CreateSubTaskDocument,
  "\n  query getSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections {\n          id\n          name\n        }\n      }\n    }\n  }\n":
    types.GetSectionsDocument,
  "\n  mutation createReminder($taskId: Int!, $time: DateTime!) {\n    createReminder(taskId: $taskId, time: $time) {\n      taskId\n      id\n      time\n    }\n  }\n":
    types.CreateReminderDocument,
  "\n  mutation deleteReminder($id: Int!) {\n    deleteReminder(id: $id) {\n      taskId\n      id\n      time\n    }\n  }\n":
    types.DeleteReminderDocument,
  "\n  mutation deleteTask($id: Int!) {\n    deleteTask(id: $id) {\n      id\n    }\n  }\n":
    types.DeleteTaskDocument,
  "\n  query getTask($projectId: String!, $taskId: Int!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        task(id: $taskId) {\n          id\n          name\n          description\n          parentTaskId\n          completed\n          dueDate\n          projectId\n          startDate\n          reminders {\n            id\n            taskId\n            time\n          }\n          subTasks {\n            id\n            name\n            description\n            completed\n            priority\n            createdAt\n            updatedAt\n            startDate\n            dueDate\n            sectionId\n            parentTaskId\n            ownerId\n            projectId\n          }\n          parentTask {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.GetTaskDocument,
  "\n  mutation updateTask($id: Int!) {\n    updateTask(id: $id) {\n      id\n      name\n      description\n      priority\n      createdAt\n      updatedAt\n      completed\n      startDate\n      dueDate\n      sectionId\n      parentTaskId\n      ownerId\n      projectId\n    }\n  }\n":
    types.UpdateTaskDocument,
  "\n  query getTimePresets {\n    me {\n      id\n      timePresets {\n        id\n        time\n      }\n    }\n  }\n":
    types.GetTimePresetsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation deleteProject($id: String!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation deleteProject($id: String!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query shareModal($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        owner {\n          id\n          name\n          email\n          image\n        }\n        invitations {\n          id\n          to {\n            name\n            email\n            image\n          }\n        }\n        collaborators {\n          id\n          role\n          user {\n            id\n            name\n            email\n            image\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query shareModal($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        owner {\n          id\n          name\n          email\n          image\n        }\n        invitations {\n          id\n          to {\n            name\n            email\n            image\n          }\n        }\n        collaborators {\n          id\n          role\n          user {\n            id\n            name\n            email\n            image\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation removeCollaborator($id: String!, $projectId: String!) {\n    removeCollaborator(id: $id, projectId: $projectId) {\n      collaborators {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation removeCollaborator($id: String!, $projectId: String!) {\n    removeCollaborator(id: $id, projectId: $projectId) {\n      collaborators {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation inviteCollaborator($projectId: String!, $email: String!) {\n    inviteCollaborator(projectId: $projectId, email: $email) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation inviteCollaborator($projectId: String!, $email: String!) {\n    inviteCollaborator(projectId: $projectId, email: $email) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query completedTasks {\n    me {\n      tasks(completed: true) {\n        id\n        name\n        description\n        projectId\n        startDate\n        dueDate\n        createdAt\n        completed\n      }\n    }\n  }\n"
): (typeof documents)["\n  query completedTasks {\n    me {\n      tasks(completed: true) {\n        id\n        name\n        description\n        projectId\n        startDate\n        dueDate\n        createdAt\n        completed\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getApiToken {\n    me {\n      id\n      apiToken {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getApiToken {\n    me {\n      id\n      apiToken {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation rerollApiToken($id: String!) {\n    rerollApiToken(id: $id) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation rerollApiToken($id: String!) {\n    rerollApiToken(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getNotificationTokens {\n    me {\n      id\n      notificationTokens {\n        id\n        token\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getNotificationTokens {\n    me {\n      id\n      notificationTokens {\n        id\n        token\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation addNotificationToken($token: String!, $userAgent: String!) {\n    addNotificationToken(token: $token, userAgent: $userAgent) {\n      id\n      token\n      userAgent\n    }\n  }\n"
): (typeof documents)["\n  mutation addNotificationToken($token: String!, $userAgent: String!) {\n    addNotificationToken(token: $token, userAgent: $userAgent) {\n      id\n      token\n      userAgent\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation removeNotificationToken($token: String!) {\n    removeNotificationToken(token: $token) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation removeNotificationToken($token: String!) {\n    removeNotificationToken(token: $token) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation addTimePreset($time: Int!) {\n    addTimePreset(time: $time) {\n      id\n      time\n    }\n  }\n"
): (typeof documents)["\n  mutation addTimePreset($time: Int!) {\n    addTimePreset(time: $time) {\n      id\n      time\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation removeTimePreset($id: Int!) {\n    removeTimePreset(id: $id) {\n      id\n      time\n    }\n  }\n"
): (typeof documents)["\n  mutation removeTimePreset($id: Int!) {\n    removeTimePreset(id: $id) {\n      id\n      time\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getArchivedProjects {\n    me {\n      id\n      projects(archived: true) {\n        id\n        name\n        archived\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getArchivedProjects {\n    me {\n      id\n      projects(archived: true) {\n        id\n        name\n        archived\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getTasks {\n    me {\n      id\n      tasks {\n        id\n        name\n        description\n        completed\n        section {\n          id\n          name\n          archived\n        }\n        projectId\n        dueDate\n        startDate\n        createdAt\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getTasks {\n    me {\n      id\n      tasks {\n        id\n        name\n        description\n        completed\n        section {\n          id\n          name\n          archived\n        }\n        projectId\n        dueDate\n        startDate\n        createdAt\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query projectAndInvitationList {\n    me {\n      id\n      projects {\n        id\n        name\n        createdAt\n        owner {\n          id\n          name\n          image\n        }\n        collaborators {\n          id\n          user {\n            name\n            image\n          }\n        }\n      }\n      incomingInvitations {\n        id\n        from {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query projectAndInvitationList {\n    me {\n      id\n      projects {\n        id\n        name\n        createdAt\n        owner {\n          id\n          name\n          image\n        }\n        collaborators {\n          id\n          user {\n            name\n            image\n          }\n        }\n      }\n      incomingInvitations {\n        id\n        from {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation acceptInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation acceptInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation rejectInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation rejectInvitation($id: String!) {\n    acceptInvitation(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getProjectMeta($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        ownerId\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getProjectMeta($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        ownerId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation archiveProject($id: String!, $archived: Boolean!) {\n    updateProject(id: $id, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n"
): (typeof documents)["\n  mutation archiveProject($id: String!, $archived: Boolean!) {\n    updateProject(id: $id, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getProject($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        sections {\n          projectId\n          archived\n          createdAt\n          id\n          name\n          tasks {\n            id\n            projectId\n            parentTaskId\n            sectionId\n            name\n            description\n            dueDate\n            createdAt\n            completed\n            startDate\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getProject($id: String!) {\n    me {\n      id\n      project(id: $id) {\n        id\n        name\n        archived\n        sections {\n          projectId\n          archived\n          createdAt\n          id\n          name\n          tasks {\n            id\n            projectId\n            parentTaskId\n            sectionId\n            name\n            description\n            dueDate\n            createdAt\n            completed\n            startDate\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation updateSection($id: Int!, $name: String, $archived: Boolean) {\n    updateSection(id: $id, name: $name, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n"
): (typeof documents)["\n  mutation updateSection($id: Int!, $name: String, $archived: Boolean) {\n    updateSection(id: $id, name: $name, archived: $archived) {\n      id\n      name\n      archived\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation createSection($projectId: String!) {\n    createSection(projectId: $projectId) {\n      id\n      name\n      archived\n    }\n  }\n"
): (typeof documents)["\n  mutation createSection($projectId: String!) {\n    createSection(projectId: $projectId) {\n      id\n      name\n      archived\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query projectsList {\n    me {\n      id\n      projects {\n        ownerId\n        id\n        name\n      }\n    }\n  }\n"
): (typeof documents)["\n  query projectsList {\n    me {\n      id\n      projects {\n        ownerId\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getArchivedSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections(archived: true) {\n          id\n          name\n          archived\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getArchivedSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections(archived: true) {\n          id\n          name\n          archived\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation newProject($name: String!) {\n    createNewProject(name: $name) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation newProject($name: String!) {\n    createNewProject(name: $name) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query projectList {\n    me {\n      id\n      projects {\n        id\n        name\n        ownerId\n      }\n    }\n  }\n"
): (typeof documents)["\n  query projectList {\n    me {\n      id\n      projects {\n        id\n        name\n        ownerId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation deleteSection($id: Int!) {\n    deleteSection(id: $id) {\n      id\n      name\n      archived\n    }\n  }\n"
): (typeof documents)["\n  mutation deleteSection($id: Int!) {\n    deleteSection(id: $id) {\n      id\n      name\n      archived\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation createTask(\n    $sectionId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createTask(\n      sectionId: $sectionId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n"
): (typeof documents)["\n  mutation createTask(\n    $sectionId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createTask(\n      sectionId: $sectionId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation createSubTask(\n    $parentTaskId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createSubTask(\n      parentTaskId: $parentTaskId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n"
): (typeof documents)["\n  mutation createSubTask(\n    $parentTaskId: Int!\n    $name: String!\n    $description: String\n    $dueDate: DateTime\n  ) {\n    createSubTask(\n      parentTaskId: $parentTaskId\n      name: $name\n      description: $description\n      dueDate: $dueDate\n    ) {\n      id\n      sectionId\n      parentTaskId\n      projectId\n      name\n      description\n      completed\n      subtaskCounts\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections {\n          id\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getSections($projectId: String!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        sections {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation createReminder($taskId: Int!, $time: DateTime!) {\n    createReminder(taskId: $taskId, time: $time) {\n      taskId\n      id\n      time\n    }\n  }\n"
): (typeof documents)["\n  mutation createReminder($taskId: Int!, $time: DateTime!) {\n    createReminder(taskId: $taskId, time: $time) {\n      taskId\n      id\n      time\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation deleteReminder($id: Int!) {\n    deleteReminder(id: $id) {\n      taskId\n      id\n      time\n    }\n  }\n"
): (typeof documents)["\n  mutation deleteReminder($id: Int!) {\n    deleteReminder(id: $id) {\n      taskId\n      id\n      time\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation deleteTask($id: Int!) {\n    deleteTask(id: $id) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation deleteTask($id: Int!) {\n    deleteTask(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getTask($projectId: String!, $taskId: Int!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        task(id: $taskId) {\n          id\n          name\n          description\n          parentTaskId\n          completed\n          dueDate\n          projectId\n          startDate\n          reminders {\n            id\n            taskId\n            time\n          }\n          subTasks {\n            id\n            name\n            description\n            completed\n            priority\n            createdAt\n            updatedAt\n            startDate\n            dueDate\n            sectionId\n            parentTaskId\n            ownerId\n            projectId\n          }\n          parentTask {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getTask($projectId: String!, $taskId: Int!) {\n    me {\n      id\n      project(id: $projectId) {\n        id\n        task(id: $taskId) {\n          id\n          name\n          description\n          parentTaskId\n          completed\n          dueDate\n          projectId\n          startDate\n          reminders {\n            id\n            taskId\n            time\n          }\n          subTasks {\n            id\n            name\n            description\n            completed\n            priority\n            createdAt\n            updatedAt\n            startDate\n            dueDate\n            sectionId\n            parentTaskId\n            ownerId\n            projectId\n          }\n          parentTask {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation updateTask($id: Int!) {\n    updateTask(id: $id) {\n      id\n      name\n      description\n      priority\n      createdAt\n      updatedAt\n      completed\n      startDate\n      dueDate\n      sectionId\n      parentTaskId\n      ownerId\n      projectId\n    }\n  }\n"
): (typeof documents)["\n  mutation updateTask($id: Int!) {\n    updateTask(id: $id) {\n      id\n      name\n      description\n      priority\n      createdAt\n      updatedAt\n      completed\n      startDate\n      dueDate\n      sectionId\n      parentTaskId\n      ownerId\n      projectId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getTimePresets {\n    me {\n      id\n      timePresets {\n        id\n        time\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getTimePresets {\n    me {\n      id\n      timePresets {\n        id\n        time\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
