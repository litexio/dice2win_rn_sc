import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes';

const COIN_SIZE = 100
export default StyleSheet.create({
  coinBox: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around',
    padding: 12,
  },
  coinItem: {
    width: COIN_SIZE, 
    height: COIN_SIZE
  },
  infoBox: {
    flex: 1, 
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  infoText: {
    ...Fonts.style.h5,
    color: Colors.activeTint,
    textAlign: 'center',
  },
})
