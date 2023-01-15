import * as FileSystem from "expo-file-system"

const cxttoDir: string = `${FileSystem.cacheDirectory}cxtto/`
const imagePath = (id: string) => cxttoDir + `${id}`
const imageUrl = (id: string) => `https://cdn2.thecatapi.com/images/${id}`
const checkImageDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(cxttoDir)

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cxttoDir, { intermediates: true })
    }
}

const getCachedImage = async (id: string): Promise<string | null> => {
    await checkImageDir()

    const imageUri = imagePath(id)
    const imageInfo = await FileSystem.getInfoAsync(imageUri)

    if (!imageInfo.exists) {
        return null
    }

    return imageInfo.uri
}

const cacheImage = async (id: string): Promise<string> => {
    await checkImageDir()

    const path = imagePath(id)
    const uri = imageUrl(id)
    const image = await FileSystem.downloadAsync(uri, path)

    return image.uri
}

const deleteCachedImage = async (id: string) => {
    try {
        const path = await imagePath(id)
        await FileSystem.deleteAsync(path)

    } catch (err) {
        console.log(err.message)
        
    }
}

export {
    deleteCachedImage,
    getCachedImage,
    cacheImage,
}