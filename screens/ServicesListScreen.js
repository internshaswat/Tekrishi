import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import ServiceCard from './ServiceCard'

const Separator = () => <View style={styles.separator} />

const Row = (props) => (
  <ServiceCard />
  // <View style={styles.row}>
  //   <Text style={styles.text}>{props.name}</Text>
  //   <Text>{props.phone}</Text>
  //   <Separator />
  // </View>
)

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
]

export default class ServicesListScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={Row}
          data={DATA}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: { padding: 20 },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontWeight: 'bold',
  },
})