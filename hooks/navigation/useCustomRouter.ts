import { ExternalPathString, RelativePathString, useRouter } from 'expo-router'

export function useCustomRouter() {
  const router = useRouter()

  const navigateTo = (path: RelativePathString | ExternalPathString) => {
    router.push(path)
  }

  return { navigateTo }
}
