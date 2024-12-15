import { urls } from '@/constants/constants'
import { apolloClient } from '../apollo/apolloClient'
import { GET_ACCOUNT_EMAIL } from '../queries/accountQueries'
import { useFetchData } from './useFetchData'

export const useFetchUserEmail = () => {
  const client = apolloClient(urls.cmsTenant)

  const { data, error } = useFetchData({
    client,
    key: 'accountEmail',
    query: GET_ACCOUNT_EMAIL
  })

  return { email: data?.account?.email, error }
}
