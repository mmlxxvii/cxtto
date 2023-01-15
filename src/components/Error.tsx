import React from "react"
import { Text, View, StyleSheet } from "react-native"

type Props = {
    error: string
}

export default function Error({ error }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.error}>{error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },

    error: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    }
})