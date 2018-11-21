import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'
import { red } from 'ansi-colors';
// import Metrics from './Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myBalance: {
    fontSize: Fonts.size.medium,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingLeft: 35,
    paddingTop: 10
  },

  rivalBalance: {
    fontSize: Fonts.size.medium,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingRight: 35,
    paddingTop: 10
  },

  channelStatusClosed: {
    padding: 15,
    color: 'red',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    fontSize: Fonts.size.h3
  },

  channelStatusActive: {
    padding: 15,
    color: 'green',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    fontSize: Fonts.size.h3
  },

  buttonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-evenly",
  },

  rechargeButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  depositButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  buttonText: {
    ...Fonts.style.description,
    color: Colors.text,
  },


  item:{
    flexDirection:"row",
    paddingHorizontal:15,
    paddingVertical:20,

    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
  },
  leftSection:{
    flexDirection:"column",
    flex:1,
    alignItems:'center',
  },
  centerSection:{
    flexDirection:"row",
    flex:2,
    paddingLeft: 10,
    paddingRight:30,
    alignItems: 'center',
  },
  rightSection:{
    flexDirection:"row",
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  header:{
    flexDirection:"row",
    paddingHorizontal:15,
    paddingVertical:5,
    backgroundColor:Colors.steel,

    alignItems:'center',
    opacity:0.5,
  },

  channelTradingList:{
    marginTop:15,
  },


})
