import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet, Pressable, Dimensions } from "react-native"
import { AntDesign } from '@expo/vector-icons'
import * as MediaLibrary from "expo-media-library"
import { cacheImage, deleteCachedImage, getCachedImage } from "../cache"
import { IStorage, addItem, removeItem } from "../local-storage"
import { sendToastNotification } from "../notifications"
import { themes } from "../helpers/constants"
import { Props } from "../@Types/Props"

export const handleDownload = async (id: string) => {
    try {
        let imagePath = await getCachedImage(id)

        if (!imagePath) {
            imagePath = await cacheImage(id)
        }

        const permissiion = await MediaLibrary.requestPermissionsAsync()

        if (permissiion.status !== "granted") {
            sendToastNotification("Permission denied")
            return
        }

        const save = await MediaLibrary.createAssetAsync(imagePath)

        sendToastNotification(`${save.filename} was saved`)

    } catch (err) {
        // @ts-ignore
        console.log(err.message)
    }
}

export default function Cat({ url, id }: Props) {
    const [isFav, setFav] = useState(false)

    const handleFavorite = async (id: string) => {
        const image: string | null = await getCachedImage(id)

        if (!image) {
            const imagePath: string = await cacheImage(id)
            const item: IStorage = { id: id, url: imagePath }

            await addItem(item)

        } else {
            await removeItem(id)
            await deleteCachedImage(id)

        }

        setFav(!isFav)
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: url }} />
            <View style={styles.actionBar}>
                <View style={styles.buttonContainer}>
                    <Pressable
                        android_ripple={{ color: themes.colors.RADICALRED, borderless: true }}
                        style={styles.pressable}
                        onPress={() => handleDownload(id)}
                    >
                        <AntDesign name="download" size={24} color={themes.colors.PRUNUSAVIM} />
                    </Pressable>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable
                        android_ripple={{ color: themes.colors.RADICALRED, borderless: true }}
                        style={styles.pressable}
                        onPress={() => { handleFavorite(id) }}
                    >
                        <AntDesign name={isFav ? "heart" : "hearto"} size={24} color={themes.colors.PRUNUSAVIM} />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        width: Dimensions.get("window").width,
        paddingHorizontal: 20
    },
    actionBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: themes.colors.PICOPINK,
    },

    image: {
        height: 350,
        width: Dimensions.get("window").width - 40,
        borderTopRightRadius: 7,
        borderTopLeftRadius: 7
    },

    buttonContainer: {
        position: "relative",
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },

    pressable: {
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        height: 32,
    }
})