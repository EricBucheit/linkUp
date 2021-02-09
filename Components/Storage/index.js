import AsyncStorage from '@react-native-async-storage/async-storage';



const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('linkData', jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('linkData')
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch(e) {
    // error reading value
  }
}

export {
  storeData,
  getData,
}