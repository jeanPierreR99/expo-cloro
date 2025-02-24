import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImageManipulator from 'expo-image-manipulator';


interface ModalCameraProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    photo: any,
    setPhoto: any
}
const ModalCamera: React.FC<ModalCameraProps> = ({ modalVisible, setModalVisible, photo, setPhoto }) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [flash, setFlash] = useState<FlashMode>('off');
    const cameraRef = useRef<CameraView | null>(null);
    const [photoStatus, setPhotoStatus] = useState<boolean>(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className='w-full'>
                <Text className='text-gray-400'>Se necesita habilitar permisos para acceder a la camara, <TouchableOpacity onPress={requestPermission}><Text className='text-red-400'>Otorgar permisos</Text></TouchableOpacity></Text>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // function toggleCameraFlash() {
    //     setFlash(current => (current === 'off' ? 'on' : 'off'));
    // }

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const picture = await cameraRef.current.takePictureAsync({ quality: 1, base64: true, exif: true });

            let actions = [];

            if (facing === 'front') {
                actions.push({ flip: ImageManipulator.FlipType.Horizontal });
            }

            actions.push({ rotate: 0 });

            const manipulatedImage = await ImageManipulator.manipulateAsync(
                picture ? picture.uri : "",
                actions,
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            setPhoto((prev: any) => [...prev, { base64: manipulatedImage.base64, uri: manipulatedImage.uri }]);
            setPhotoStatus(true);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modalContainer} className="relative">
                <View style={styles.modalContent}>
                    {photoStatus ?
                        <View className='w-full h-full relative'>
                            <Image source={{ uri: "data:image/jpg;base64," + photo[photo.length - 1].base64 }} style={{ width: '100%', height: '100%', objectFit: "contain" }} />
                            <View className='flex-row justify-between px-2 mt-4 items-center absolute bottom-8 w-full' style={{ gap: 4, zIndex: 999 }}>

                                <TouchableOpacity onPress={() => setPhotoStatus(false)}>
                                    <Ionicons name="arrow-undo-outline" size={46} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setPhoto((prev: any) => prev.slice(0, -1))
                                    setPhotoStatus(false)
                                }}>
                                    <Ionicons name="trash-outline" size={46} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View className='h-full pb-4'>
                            <CameraView ref={cameraRef} facing={facing} flash={flash} className='flex-1'>
                                <ScrollView horizontal className='absolute bottom-0 flex-row'>
                                    {photo.map((data: any, index: any) => (
                                        <View key={index} className='w-[70px] h-[70px] relative'>
                                            <Image source={{ uri: "data:image/jpg;base64," + data.base64 }} style={{ width: '100%', height: '100%' }} />
                                        </View>
                                    ))}
                                </ScrollView>
                            </CameraView>
                            <View className='flex-row justify-between px-2 mt-4 items-center' style={{ gap: 4 }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} className=' p-2'>
                                    <Ionicons name="arrow-undo-outline" size={46} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleTakePicture} className='bg-gray-300  rounded-full p-4'>
                                    <Ionicons name="camera-outline" size={46} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleCameraFacing} className=' p-2'>
                                    <Ionicons name="camera-reverse-outline" size={46} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>}

                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,.4)",
    },
    modalContent: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default ModalCamera;