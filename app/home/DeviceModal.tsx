import React, { FC, useCallback } from 'react'
import { FlatList, ListRenderItemInfo, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Device } from 'react-native-ble-plx'

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>
  connectToPeripheral: (device: Device) => void
  closeModal: () => void
}

type DeviceModalProps = {
  devices: Device[]
  visible: boolean
  connectToPeripheral: (device: Device) => void
  closeModal: () => void
}

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item)
    closeModal() // Close modal after connecting to device
  }, [closeModal, connectToPeripheral, item.item])

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={modalStyle.ctaButton}>
      <Text style={modalStyle.ctaButtonText}>{item.item.name || 'Unnamed Device'}</Text>
    </TouchableOpacity>
  )
}

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, connectToPeripheral, closeModal } = props

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return <DeviceModalListItem item={item} connectToPeripheral={connectToPeripheral} closeModal={closeModal} />
    },
    [closeModal, connectToPeripheral]
  )

  return (
    <Modal style={modalStyle.modalContainer} animationType="slide" transparent={false} visible={visible}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>Tap on a device to connect</Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </Modal>
  )
}

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: 'center'
  },
  modalTitle: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center'
  },
  ctaButton: {
    backgroundColor: '#FF6060',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
})

export default DeviceModal
