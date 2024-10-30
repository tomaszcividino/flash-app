import { SafeAreaView, StyleSheet } from 'react-native'

export default function HomeScreen() {
  return <SafeAreaView style={styles.titleContainer}></SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute'
  }
})
