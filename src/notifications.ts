import { ToastAndroid } from "react-native"

const sendToastNotification = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT)
}

/* TO DO: Push notifications */

export {
    sendToastNotification
}