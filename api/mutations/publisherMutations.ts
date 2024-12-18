import { gql } from '@apollo/client'

export const UPDATE_PLAYLIST_MUTATION = gql`
  mutation UpdatePlaylist($playlistId: String!, $playlist: PartialPlaylistInput!) {
    updatePlaylist(playlistId: $playlistId, playlist: $playlist) {
      playlistId
      tenantId
      teamId
      name
      duration
      contents {
        contentId
        mediaId
        duration
        config
      }
      playerIds
      playerGroupIds
      startDate
      endDate
      schedule {
        day
        time
      }
      createdAt
      updatedAt
      published
    }
  }
`

export const DELETE_CONTENT_MUTATION = gql`
  mutation DeleteContent($contentId: String!) {
    deleteContent(contentId: $contentId) {
      contentId
    }
  }
`

export const REMOVE_CONTENT_MUTATION = gql`
  mutation Update($playlistId: String!, $playlist: PartialPlaylistInput!) {
    update(playlistId: $playlistId, playlist: $playlist) {
      contents {
        ... on Media {
          mediaId
          duration
          config
        }
      }
    }
  }
`
