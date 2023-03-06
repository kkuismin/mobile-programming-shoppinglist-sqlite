import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Text, Button, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists purchase (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  // Save purchase
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into purchase (product, amount) values (?, ?);', 
      [product, amount]);
    }, null, updateList)
    setProduct('');
    setAmount('');
  };

  // Update shopping list
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from purchase;', [], (_, { rows }) =>
        setShoppinglist(rows._array)
      );
    }, null, null);
    console.log(shoppinglist)
  };

  // Delete purchase
  const deleteitem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from purchase where id = ?;', [id]);
     }, null, updateList)
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}/>
      <TextInput
        style={styles.input}
        placeholder='Amount'
        onChangeText={amount => setAmount(amount)}
        value={amount}/>
      <Button onPress={saveItem} title="Save" />
      <Text style={styles.listtitle}>Shopping list</Text>
      <FlatList 
        data={shoppinglist}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.flatlistcontainer}>
            <Text>{item.product}, {item.amount}</Text>
            <Text style={styles.deletebutton} onPress={() => deleteitem(item.id)}>bought</Text>
          </View>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  input: {
    marginTop: 5, 
    marginBottom: 5, 
    width: 200, 
    height: 40, 
    borderColor:'gray', 
    borderWidth: 1,
  },
  flatlistcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center',
   marginTop: 10,
  },
  listtitle: {
    marginTop: 30, 
    fontSize: 18,
  },
  deletebutton: {
    color: 'blue', 
    marginLeft: 10
  },
});
