import { apolloClient } from '@/api/apollo/apolloClient'
import { useFetchData } from '@/api/hooks/useFetchData'
import { ALL_PLAYLISTS_QUERY } from '@/api/queries/publisherQueries'
import { DragIcon } from '@/assets/icons/DragIcon'
import { PlaylistIcon } from '@/assets/icons/PlaylistIcon'
import { TimerIcon } from '@/assets/icons/TimerIcon'
import { SecondaryButton } from '@/components/buttons/SecondaryButton'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'

const SingleScreen = () => {
  const { name, screenOrientation } = useLocalSearchParams()

  const client = apolloClient('https://api.dev-fugo.com/cms/publisher')

  const { refetch, data, isLoading, isError } = useFetchData({
    client,
    key: 'allScreens',
    query: ALL_PLAYLISTS_QUERY
  })

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  const playlists = data?.playlists || []

  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const formatDuration = (durationMs) => {
    const totalSeconds = Math.floor(durationMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const formattedDuration = [hours > 0 ? `${hours}h` : '', minutes > 0 ? `${minutes}m` : '', `${seconds}s`]
      .filter(Boolean)
      .join(' ')

    return formattedDuration
  }

  const calculateTotalDuration = (contents) => {
    if (!contents || contents.length === 0) {
      return 0
    }

    return contents.reduce((sum, content) => sum + (content.duration || 0), 0)
  }

  const DeleteButton = ({ onPress }) => {
    return (
      <View style={styles.container}>
        <Pressable style={styles.deleteButton} onPress={onPress}>
          <CustomText style={styles.deleteText}>Delete</CustomText>
        </Pressable>
      </View>
    )
  }

  const renderPlaylistOverview = ({ item }) => {
    const totalDurationMs = calculateTotalDuration(item.contents)

    return (
      <TouchableOpacity onPress={() => setSelectedPlaylist(item)}>
        <View style={styles.playlistItem}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaylistIcon />
              <CustomText style={styles.playlistName}>{item.name}</CustomText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TimerIcon />
              <CustomText style={[styles.playlistDuration, { marginLeft: 4 }]}>
                {formatDuration(totalDurationMs)}
              </CustomText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
              <PlaylistIcon />
              <CustomText style={styles.playlistContents}>{item.contents?.length || 0} Items</CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSelectedPlaylist = () => (
    <View style={{ flex: 1 }}>
      <FlatList
        data={selectedPlaylist?.contents}
        keyExtractor={(item, index) => `${selectedPlaylist?.playlistId}-${index}`}
        contentContainerStyle={{ gap: 10 }}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.contentItem}>
            <DragIcon />
            <View style={styles.contentSpacer} />
            <View style={styles.contentThumbnail} />
            <View style={styles.contentDetails}>
              <CustomText style={[styles.contentText, { textAlign: 'center', fontWeight: 'bold' }]}>
                {item.name || 'Name of asset'}
              </CustomText>
              <View style={styles.durationContainer}>
                <TimerIcon />
                <CustomText style={styles.contentDuration}>{formatDuration(item.duration || 0)}</CustomText>
              </View>
              <CustomText style={styles.contentStatus}>Published</CustomText>
            </View>

            <View>
              <Pressable />
            </View>
          </View>
        )}
      />
    </View>
  )

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
          <CustomText style={styles.deviceText}>{name}</CustomText>
          <CustomText style={styles.deviceText}>{screenOrientation}°</CustomText>
        </View>
        <View style={styles.header}>
          <CustomText style={styles.headerText}>Your playlist</CustomText>
          <SecondaryButton text="Add" filled onPress={() => console.log('Add playlist')} />
        </View>
        {selectedPlaylist ? (
          renderSelectedPlaylist()
        ) : (
          <FlatList
            scrollEnabled
            data={playlists}
            renderItem={renderPlaylistOverview}
            keyExtractor={(item) => item.playlistId}
          />
        )}

        {selectedPlaylist && (
          <View style={{ marginTop: 10 }}>
            <SecondaryButton text="Add" filled={false} onPress={() => console.log('pressed')} />
          </View>
        )}
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
    marginBottom: 24
  },
  thumbnail: {
    height: 175,
    width: '100%',
    backgroundColor: '#7B838A',
    borderRadius: 8
  },
  deviceInfo: {
    marginTop: 14,
    marginBottom: 24
  },
  deviceText: {
    fontSize: 20,
    marginBottom: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  headerText: {
    fontSize: 20
  },
  playlistItem: {
    borderColor: '#EEF0F2',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 12
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },
  playlistDuration: {
    fontSize: 15,
    color: '#495057'
  },
  playlistContents: {
    fontSize: 15,
    color: '#495057'
  },
  contentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#EEF0F2',
    padding: 12,
    backgroundColor: '#F8F9FA',
    position: 'relative',
    overflow: 'hidden'
  },
  contentSpacer: {
    width: 1,
    height: 76,
    backgroundColor: 'grey',
    marginRight: 8
  },
  contentThumbnail: {
    width: 117,
    height: 76,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginRight: 12
  },
  contentDetails: {
    flexDirection: 'column'
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  contentDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  contentStatus: {
    fontSize: 12
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
