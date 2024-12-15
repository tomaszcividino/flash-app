import { apolloClient } from '@/api/apollo/apolloClient'
import { useFetchData } from '@/api/hooks/useFetchData'
import { ALL_PLAYLISTS_QUERY } from '@/api/queries/publisherQueries'
import { ForwardIcon2 } from '@/assets/icons/ForwardIcon2'
import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { OrientationIcon } from '@/assets/icons/OrientationIcon'
import { PlaylistIcon } from '@/assets/icons/PlaylistIcon'
import { TimerIcon } from '@/assets/icons/TimerIcon'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'

const SingleScreen = () => {
  const { name, playerId, screenOrientation } = useLocalSearchParams()

  const client = apolloClient('https://api.dev-fugo.com/cms/publisher')

  const { refetch, data, isLoading, isError } = useFetchData({
    client,
    key: 'allScreens',
    query: ALL_PLAYLISTS_QUERY
  })

  // Refetch data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  const playlists = data?.playlists || []

  const formatDuration = (durationMs) => {
    // Convert milliseconds to seconds
    const totalSeconds = Math.floor(durationMs / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds].map((val) => String(val).padStart(2, '0')).join(':')
  }

  const calculateTotalDuration = (contents) => {
    if (!contents || contents.length === 0) {
      return 0
    }

    // Sum up durations of all items in the contents array (assuming durations are in milliseconds)
    return contents.reduce((sum, content) => sum + (content.duration || 0), 0)
  }

  const renderPlaylistItem = ({ item }) => {
    // Calculate total duration for the playlist
    const totalDurationMs = calculateTotalDuration(item.contents)

    return (
      <View style={styles.playlistItem}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlaylistIcon />
            <CustomText style={styles.playlistName}>{item.name}</CustomText>
          </View>

          <ForwardIcon2 fill={'black'} />
        </View>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TimerIcon />
            <CustomText style={styles.playlistDuration}>{formatDuration(totalDurationMs)}</CustomText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlaylistIcon />
            <CustomText style={styles.playlistContents}>{item.contents?.length || 0} Items</CustomText>
          </View>
        </View>
      </View>
    )
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#7B838A" style={styles.loading} />
  }

  if (isError) {
    return <CustomText style={styles.error}>Error fetching playlists</CustomText>
  }

  return (
    <AuthenticationWrapper screenName="">
      <View style={styles.container}>
        <CustomText style={styles.title}>{name}</CustomText>
        <View style={styles.thumbnail} />

        <View style={styles.deviceInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GreenDotIcon />
            <CustomText style={styles.deviceText}>{name}</CustomText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <OrientationIcon />
            <CustomText style={styles.deviceText}>
              {screenOrientation}° {/* Display screen orientation here */}
            </CustomText>
          </View>
        </View>

        {/* Render the playlist list */}
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.name} // Assuming each item has an 'id'
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 30,
    lineHeight: 32,
    marginBottom: 24
  },
  thumbnail: {
    height: 175,
    width: '100%',
    backgroundColor: '#7B838A',
    borderRadius: 8
  },
  deviceInfo: {
    flexDirection: 'column',
    marginTop: 14,
    marginBottom: 24
  },
  deviceText: {
    fontSize: 20,
    marginLeft: 10
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 12
  },
  headerText: {
    fontSize: 20,
    lineHeight: 26
  },
  flatListContainer: {
    paddingBottom: 16
  },
  playlistItem: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#EEF0F2',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 10
  },
  playlistDuration: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 4,
    marginLeft: 4
  },
  playlistContents: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 4
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: 'red'
  }
})

export default SingleScreen
