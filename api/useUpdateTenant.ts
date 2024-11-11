import { useRouter } from 'expo-router'

import { urls } from '@/constants/typography'
import { ApolloClient, ApolloLink, FetchResult, HttpLink, InMemoryCache, Observable, useMutation } from '@apollo/client'
import { UPDATE_TENANT_MUTATION } from './mutations/tenantMutations'

import AsyncStorage from '@react-native-async-storage/async-storage'

const createApolloClientForUpdating = () => {
  const httpLink = new HttpLink({
    uri: urls.api.adminTenant
  })

  const authLink = new ApolloLink((operation, forward) => {
    return new Observable<FetchResult>((observer) => {
      AsyncStorage.getItem('accessToken')
        .then((accessToken) => {
          return AsyncStorage.getItem('teamId').then((teamId) => {
            operation.setContext({
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Team-Id': teamId
              }
            })

            forward(operation).subscribe({
              next: (result) => observer.next(result),
              error: (err) => observer.error(err),
              complete: () => observer.complete()
            })
          })
        })
        .catch((error) => {
          observer.error(error)
        })
    })
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })
}

export const useUpdateTenant = () => {
  const customClient = createApolloClientForUpdating()
  const router = useRouter()

  const [updateTenant, { loading, error }] = useMutation(UPDATE_TENANT_MUTATION, {
    client: customClient,
    onCompleted: () => {
      router.replace('/home')
    },
    onError: (err) => {
      console.error('Error during tenant update:', err)
    }
  })

  const updateTenantData = async (email: string, data: any) => {
    try {
      const variables = {
        email,
        name: data.firstName,
        industry: data.industry,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
          industry: data.industry,
          howDidYouFindUs: data.howDidYouFindUs
        }
      }

      await updateTenant({ variables })
      await AsyncStorage.setItem('profileVisited', 'true')
    } catch (error) {
      console.error('Error updating tenant:', error)
    }
  }

  return {
    updateTenantData,
    loading,
    error
  }
}
