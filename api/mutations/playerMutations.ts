import { gql } from '@apollo/client'

export const ALL_SCREENS_QUERY = gql`
  query AllScreens {
    allScreens {
      player {
        tenantId
        playerId
        info
        name
      }
    }
  }
`

export const SCREEN_COUNT_QUERY = gql`
  query ExternalQuery {
    screenCount
  }
`
export const DELETE_PLAYER_MUTATION = gql`
  mutation DeletePlayer($playerId: String!) {
    deletePlayer(playerId: $playerId)
  }
`

export const PAIR_PLAYER_MUTATION = gql`
  mutation pairPlayer($pin: String!, $name: String!, $colour: String!, $settings: Json!, $shared: [String!]!) {
    pairPlayer(pin: $pin, name: $name, colour: $colour, settings: $settings, shared: $shared) {
      playerId
      tenantId
      name
      colour
      groupId
      settings
      shared
      createdAt
      updatedAt
      registrationStatus
      address
    }
  }
`
