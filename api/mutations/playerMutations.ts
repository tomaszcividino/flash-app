import { gql } from '@apollo/client'

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

export const UPDATE_PLAYER_MUTATION = gql`
  mutation updatePlayer($playerId: String!, $newName: String, $newColour: String, $newInfo: Json, $newAddress: String) {
    updatePlayer(
      playerId: $playerId
      newName: $newName
      newColour: $newColour
      newInfo: $newInfo
      newAddress: $newAddress
    ) {
      tenantId
      playerId
      name
      colour
      groupId
      info
      registrationStatus
      address
      settings
      owners
      shared
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }
`
