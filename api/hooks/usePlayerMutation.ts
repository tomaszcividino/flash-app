import { apolloClient } from '@/api/apollo/apolloClient'
import { useMutateData } from '@/api/hooks/useMutateData'
import { DELETE_PLAYER_MUTATION, UPDATE_PLAYER_MUTATION } from '@/api/mutations/playerMutations'
import { urls } from '@/constants/constants'

export const usePlayerMutation = () => {
  const client = apolloClient(urls.cmsPlayer)

  const { mutate: deletePlayer } = useMutateData({
    client,
    key: 'deletePlayer',
    mutation: DELETE_PLAYER_MUTATION
  })

  const { mutate: updatePlayer } = useMutateData({
    client,
    key: 'updatePlayer',
    mutation: UPDATE_PLAYER_MUTATION
  })

  return {
    deletePlayer,
    updatePlayer
  }
}
