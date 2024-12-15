import { gql } from '@apollo/client'

export const GET_ACCOUNT_EMAIL = gql`
  query Account {
    account {
      email
    }
  }
`
