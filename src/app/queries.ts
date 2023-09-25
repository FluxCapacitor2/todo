import { graphql } from "@/gql";

export const GetProjectMetaQuery = graphql(`
  query getProjectMeta($id: String!) {
    me {
      id
      project(id: $id) {
        id
        name
        archived
        ownerId
      }
    }
  }
`);

export const UpdateProjectMutation = graphql(`
  mutation archiveProject($id: String!, $archived: Boolean!) {
    updateProject(id: $id, archived: $archived) {
      id
      name
      archived
    }
  }
`);

// TODO re-add `subtaskCounts` once I can optimize it
export const GetProjectQuery = graphql(`
  query getProject($id: String!) {
    me {
      id
      project(id: $id) {
        id
        name
        archived
        sections {
          projectId
          archived
          createdAt
          id
          name
          tasks {
            id
            projectId
            parentTaskId
            sectionId
            name
            description
            dueDate
            createdAt
            completed
            startDate
          }
        }
      }
    }
  }
`);

export const UpdateSectionMutation = graphql(`
  mutation updateSection($id: Int!, $name: String, $archived: Boolean) {
    updateSection(id: $id, name: $name, archived: $archived) {
      id
      name
      archived
    }
  }
`);

export const CreateSectionMutation = graphql(`
  mutation createSection($projectId: String!) {
    createSection(projectId: $projectId) {
      id
      name
      archived
    }
  }
`);

export const ProjectListQuery = graphql(`
  query projectsList {
    me {
      id
      projects {
        ownerId
        id
        name
      }
    }
  }
`);

export const GetArchivedSectionsQuery = graphql(`
  query getArchivedSections($projectId: String!) {
    me {
      id
      project(id: $projectId) {
        id
        sections(archived: true) {
          id
          name
          archived
        }
      }
    }
  }
`);
