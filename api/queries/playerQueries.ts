import { gql } from '@apollo/client'

export const ALL_SCREENS_QUERY = gql`
  query AllScreens {
    allScreens {
      player {
        tenantId
        playerId
        info
        name
        settings
        registrationStatus
      }
    }
  }
`

export const SCREEN_COUNT_QUERY = gql`
  query ExternalQuery {
    screenCount
  }
`
