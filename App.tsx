import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions, StatusBar, Pressable } from 'react-native'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { clearLocalStorage, getAllItems, IStorage } from "./src/local-storage"
import { themes } from "./src/helpers/constants"
import { Cats } from './src/@types/Cats'

import { getCats } from "./src/api"

import Cat from './src/components/Cat'
import Favorite from './src/components/Favorite'

export default function App() {
  const [isLoaded, setLoaded] = useState(false)
  const [isExpanded, setExpanded] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [cats, setCats] = useState<Array<Cats> | null>(null)
  const [localStorage, setLocalStorage] = useState<Array<IStorage> | null>(null)
  const snapPoints = useMemo(() => ['8%', "40%", '93%'], []);

  const expandBottomSheet = () => {
    isExpanded ? bottomSheetRef.current?.collapse() : bottomSheetRef.current?.expand()

    setExpanded(!isExpanded)

  }

  const handleBottomSheetChanges = useCallback((index: number) => {
    if (index !== 2) {
      setExpanded(false)

    }

    if (index === 0) {
      getAllItems()
        .then((res) => {
          console.log(res)
          setLocalStorage(res)
        })
    }

  }, [])

  /* I have no idea what have i done but it works */
  /* god forgive me for this. i gonna improve. i promise */
  const getCxttos = () => {
    getCats().then(res => {
      if (res !== null) {
        let temp: Array<Cats | null> = []

        for (let i = 0; i < cats?.length; i++) {
          temp.push({ id: cats[i]?.id, url: cats[i]?.url })

        }

        temp = [...temp, ...res]

        setCats(temp)

      }
    })
  }

  useEffect(() => {
    getCxttos()
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
            renderItem={({ item, index }) => <Cat url={item.url} id={item.id} />}
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
        onChange={() => handleBottomSheetChanges}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: themes.colors.PRUNUSAVIM }}
        handleIndicatorStyle={{ backgroundColor: themes.colors.PICOPINK }}
        handleStyle={{
          backgroundColor: themes.colors.PRUNUSAVIM,
          borderTopEndRadius: 10,
          borderTopLeftRadius: 10
        }}>
        <Pressable
          onPress={() => expandBottomSheet()}
          android_ripple={{ color: themes.colors.RADICALRED }}
          style={{ paddingVertical: 10, paddingHorizontal: 30, alignSelf: "center", marginBottom: 10 }}>
          <Text style={[styles.text, { fontSize: 15, fontWeight: 'bold' }]}>Favorites</Text>
        </Pressable>
        {isLoaded &&
          <BottomSheetFlatList
            style={{ marginBottom: 20, borderTopColor: "white", alignSelf: "center" }}
            data={localStorage}
            renderItem={({ item, index }) => {
              if (item?.id) {
                return <Favorite url={item.url} id={item.id} />
              }

              return null

            }}
          />
        }
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


/**
 * 
 * <FlatList
          data={cxtt}
          horizontal
          onEndReached={getCxttos}
          onEndReachedThreshold={0.2}
          pagingEnabled={true}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.catContainer}>
                <View style={styles.catContent}>
                  <Text>{index}</Text>
                </View>
                <View style={styles.actionBar}>
                  <Text>A</Text>
                  <Text>A</Text>
                </View>
              </View>
            )
          }}
          keyExtractor={(item: any) => item.id}
        />
 */