import { StyleSheet, Text, View, FlatList, Dimensions, StatusBar, Pressable } from 'react-native'
import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"

import { getAllItemsLocalStorage, IStorage } from "./src/local-storage"
import { themes } from "./src/helpers/constants"
import { errors } from './src/helpers/errors'
import { Cats } from './src/@types/Cats'
import { getCats } from "./src/api"

import Favorite from './src/components/Favorite'
import Error from './src/components/Error'
import Cat from './src/components/Cat'

export default function App() {
  const [isLoaded, setLoaded] = useState(false)
  const [isExpanded, setExpanded] = useState(false)
  const [cats, setCats] = useState<Array<Cats> | Array<null>>([])
  const [localStorage, setLocalStorage] = useState<Array<IStorage> | null>(null)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['8%', "40%", '93%'], []);

  const expandBottomSheet = () => {
    isExpanded ? bottomSheetRef.current?.collapse() : bottomSheetRef.current?.expand()

    setExpanded(!isExpanded)

  }

  const handleBottomSheetChanges = useCallback(async (index: number) => {
    if (index !== 2) {
      setExpanded(false)

    }

    if (index === 0) {
      const response = await getAllItemsLocalStorage()

      if (response && response?.length > 0) {
        setLocalStorage(response)
        setLoaded(true)

      } else {
        setLoaded(false)
        setLocalStorage(null)

      }
    }
  }, [])

  const getCxttos = async () => {
    const response: Array<Cats> | null = await getCats()

    if (response) {
      let temp: Array<Cats> = []

      for (let i: number = 0; i < cats?.length; i++) {
        // @ts-ignore
        temp.push({ id: cats[i]?.id, url: cats[i]?.url })

      }

      temp = [...temp, ...response]

      setCats(temp)

    }
  }

  useEffect(() => { getCxttos() }, [])

  useEffect(() => {

    (async () => {
      const response = await getAllItemsLocalStorage()

      if (response && response?.length > 0) {
        setLocalStorage(response)
        setLoaded(true)

      }
    })()

  }, [])

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>cxtto</Text>
      </View>
      <View style={styles.content}>
        <View>
          <FlatList
            data={cats}
            renderItem={({ item }) => item?.id ? <Cat url={item.url} id={item.id} /> : null}
            showsHorizontalScrollIndicator={false}
            onEndReached={getCxttos}
            onEndReachedThreshold={0.1}
            horizontal={true}
            pagingEnabled
          />
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        onChange={handleBottomSheetChanges}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: themes.colors.PRUNUSAVIM }}
        handleIndicatorStyle={{ backgroundColor: themes.colors.PICOPINK }}
        handleStyle={styles.handleStyle}>
        <Pressable
          onPress={() => expandBottomSheet()}
          android_ripple={{ color: themes.colors.RADICALRED }}
          style={styles.pressable}>
          <Text style={[styles.text]}>Favorites</Text>
        </Pressable>
        {isLoaded ?
          <BottomSheetFlatList
            style={styles.bottomFlatList}
            data={localStorage}
            renderItem={({ item }) => item.id ? <Favorite url={item.url} id={item.id} /> : null}
          />
          : <Error error={errors.emptyList} />}
      </BottomSheet>
      <StatusBar backgroundColor={themes.colors.PRUNUSAVIM} />
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: '#000',
  },

  pressable: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginBottom: 10
  },

  bottomFlatList: {
    marginBottom: 20,
    borderTopColor: "white",
    alignSelf: "center"
  },

  header: {
    display: "flex",
    padding: 15,
    backgroundColor: themes.colors.PICOPINK,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themes.colors.PRUNUSAVIM
  },

  text: {
    color: "white"
  },

  handleStyle: {
    backgroundColor: themes.colors.PRUNUSAVIM,
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10
  },

  content: {
    flex: 1,
    display: 'flex',
    justifyContent: "center",
    backgroundColor: themes.colors.SWEETLY
  },

  catContainer: {
    width: Dimensions.get("window").width,
    padding: 20
  },

  catContent: {
    height: 400,
    backgroundColor: "red"
  },

  actionBar: {
    padding: 5,
    flexDirection: "row",
    backgroundColor: "blue",
    display: 'flex',
    justifyContent: "space-between"
  }
})