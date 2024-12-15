import { gql } from '@apollo/client'

export const ALL_PLAYLISTS_QUERY = gql`
  query Playlists {
    playlists {
      playlistId
      tenantId
      teamId
      name
      duration
      contents {
        ... on App {
          appId
          duration
          config
          mediaIds
        }
        ... on ContentReference {
          contentId
          uniqueId
        }
        ... on DashboardInstance {
          dashboardId
          duration
          config
        }
        ... on Media {
          mediaId
          duration
          config
        }
      }
      playerIds
      playerGroupIds
      createdAt
      updatedAt
      publishedState
      endDate
    }
  }
`
