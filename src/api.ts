import { URL } from "../api.config.json"
import { Cats } from "./@types/Cats"

const getCats = async (): Promise<Array<Cats> | null> => {
    let finalData: Array<Cats> = []

    const url = `${URL}/search?limit=10`
    const response = await fetch(url)
    const data = await response.json()

    if (!data) {
        return null
    }

    for (let i: number = 0, l: number = data.length; i < l; i++) {
        finalData.push({
            id: getId(data[i]?.url),
            url: data[i]?.url
        })
    }

    return finalData

}

const getId = (url: string): string => {
    let id = url.split("/")

    return id[id.length - 1]
}

export {
    getCats
}