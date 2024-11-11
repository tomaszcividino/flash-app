import { gql } from '@apollo/client'

export const UPDATE_TENANT_MUTATION = gql`
  mutation UpdateTenant($email: String!, $data: Json!, $name: String, $industry: String) {
    updateTenant(email: $email, data: $data, name: $name, industry: $industry)
  }
`
