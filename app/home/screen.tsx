import { RefreshIcon } from '@/assets/icons/RefreshIcon'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { NoScreensFound } from './NoScreensFound'

const screen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [screenText, setScreenText] = useState('New Screen Text')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setScreenText('Searching...')
    setTimeout(() => {
      setIsRefreshing(false)
      setScreenText('New Screen Text')
    }, 2000)
  }

  const buttonData = [{ text: 'Refresh', icon: <RefreshIcon />, onPress: handleRefresh, filled: false }]

  return (
    <AuthenticationWrapper screenName="Add new screen" buttonData={buttonData}>
      <View style={styles.centeredContainer}>
        <CustomText style={{ fontSize: 30 }}>{screenText}</CustomText>
      </View>

      {isRefreshing ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={palette.colors.purple.light} />
        </View>
      ) : (
        <NoScreensFound button={false} />
      )}
    </AuthenticationWrapper>
  )
}

export default screen

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.colors.white
  },
  centeredContainer: {
    alignItems: 'center',
    padding: 20
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
