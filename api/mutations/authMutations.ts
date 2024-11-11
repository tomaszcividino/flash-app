import { gql } from '@apollo/client'

export const AUTHENTICATE_USER = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      auth {
        accessToken
        refreshToken
      }
      teamId
      tenantId
    }
  }
`
