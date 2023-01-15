import AsyncStorage from '@react-native-async-storage/async-storage'

interface IStorage {
    id: string,
    url: string,
}

const dirName: string = "@cxttos"

const addItemLocalStorage = async (item: IStorage) => {
    try {
        let items: Array<IStorage | null> = []
        let localStorage = await AsyncStorage.getItem(dirName)

        console.log(localStorage)

        if (localStorage) {
            localStorage = JSON.parse(localStorage)
            // @ts-ignore
            for (let i: number = 0, l: number = localStorage?.length; i < l; i++) {
                items.push({
                    // @ts-ignore
                    id: localStorage[i]?.id,
                    // @ts-ignore
                    url: localStorage[i]?.url
                })
            }
        }

        items.push(item)

        await AsyncStorage.setItem(dirName, JSON.stringify(items))

    } catch (err) {
        // @ts-ignore
        console.log(err.message)
    }
}

const getAllItemsLocalStorage = async (): Promise<any | null> => {
    try {
        const items = await AsyncStorage.getItem(dirName)

        return items ? JSON.parse(items) : null

    } catch (err) {
        // @ts-ignore
        console.log(err.message)
    }

}

const removeItemLocalStorage = async (id: string) => {
    try {
        const localStorage = await AsyncStorage.getItem(dirName)

        if (!localStorage) {
            return
        }

        let items: Array<IStorage> = JSON.parse(localStorage)
        let index: number = items.findIndex(e => e.id === id)

        if (index === -1) {
            return
        }

        items.splice(index, 1)

        await AsyncStorage.setItem(dirName, JSON.stringify(items))

    } catch (err) {
        // @ts-ignore
        console.log(err.message)
    }
}

const clearLocalStorage = async () => {
    await AsyncStorage.clear()
}

export {
    addItemLocalStorage,
    removeItemLocalStorage,
    getAllItemsLocalStorage,
    clearLocalStorage,
    IStorage
}