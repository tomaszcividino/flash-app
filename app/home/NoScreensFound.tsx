import { SecondaryButton } from '@/components/buttons/SecondaryButton'
import { CustomText } from '@/components/typography/CustomText'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, View } from 'react-native'

export const NoScreensFound = ({ button }: { button: boolean }) => {
  const router = useRouter()

  const handleNavigateNewScreen = () => {
    router.push('/home/screen')
  }
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/screens.webp')} style={styles.image} />
        <CustomText style={styles.mainText}>No screens found</CustomText>
        <CustomText style={styles.secondaryText}>
          {`Please turn on your fugo flash and \n it will appear here`}
        </CustomText>
        {button && <SecondaryButton text="Add new screen" filled={false} onPress={handleNavigateNewScreen} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    marginBottom: 10
  },
  mainText: {
    fontSize: 30,
    color: 'grey'
  },
  secondaryText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 15
  }
})
