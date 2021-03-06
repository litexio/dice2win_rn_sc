import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
    padding: 20,
  },
  content: {
    alignItems: 'stretch',
    backgroundColor: Colors.neetGray,
  },
  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    justifyContent: 'center',
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text
  },
  actionWrapper: {
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  confirmButton: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.ember,
  },
  titleBox: {
    margin: 10,
    alignItems: 'center',
  },
  titleText: {
    color: Colors.ricePaper,
    fontSize: 18
  },
})
