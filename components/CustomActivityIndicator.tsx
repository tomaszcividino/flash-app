import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export const CustomActivityIndicator = ({ label }: { label: string }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="#9B4DFF" />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  label: {
    marginTop: 10, // Adds space between the spinner and the label
    fontSize: 16,
    color: '#9B4DFF', // Use the same color as the spinner or customize
    fontWeight: 'bold'
  }
})
