import { View, Image, Text, StyleSheet, Dimensions, Pressable } from "react-native"
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { handleDownload } from "./Cat"
import { deleteCachedImage } from "../cache"
import { Props } from "../@types/Props"
import { themes } from "../helpers/constants";

export default function Favorite({ id, url }: Props) {

    const handleUnFavorite = async (id: string) => {

        await deleteCachedImage(id)
    }

    return (
        <View key={id} style={styles.container}>
            <Image style={styles.image} source={{ uri: url }} />
            <View style={{
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
                padding: 20,
                backgroundColor: themes.colors.SWEETLY,
                borderColor: themes.colors.PICOPINK,
                borderWidth: 2,
                marginBottom: 15,
                borderRadius: 5,
                width: Dimensions.get("window").width - 42,
            }}>
                <Pressable
                    onPress={() => handleDownload(id)}
                    android_ripple={{ color: themes.colors.RADICALRED, borderless: true }}
                >
                    <AntDesign name="download" size={24} color={themes.colors.PRUNUSAVIM} />
                </Pressable>
                <Pressable
                    onPress={() => handleUnFavorite(id)}
                    android_ripple={{ color: themes.colors.RADICALRED, borderless: true }}>
                    <FontAwesome5 name="heart-broken" size={24} color={themes.colors.PRUNUSAVIM} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        marginBottom: 10,
        backgroundColor: "white"
    },

    image: {
        height: 350,
        marginBottom: 15,
        width: Dimensions.get("window").width - 44,
        margin: 2,
    }
})