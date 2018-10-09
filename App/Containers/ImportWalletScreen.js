import React, { Component } from 'react'
import { ScrollView, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ImportWalletScreenStyle'
import WalletActions from '../Redux/WalletRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import NewPwdModal from '../Components/NewPwdInput'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

import PwdModal from '../Components/PwdModal'
import PwdModalActions from '../Redux/PwdModalRedux'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import ListEmptyComponent from '../Components/ListEmptyComponent'
import DoublePwdInput from '../Components/DoublePwdInput'
import SinglePwdInput from '../Components/SinglePwdInput'

class ImportWalletScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Import a Wallet',
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      mnemonic: 'taxi reward file cattle canoe orbit uniform civil tourist sun donkey need',

      keystore: '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"d64a43b1-06de-468d-bc06-e6b39d515428","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"cdb19e71fcf868c842bf6c2a4006e0bb"},"ciphertext":"05cfe364bfb847ec9f27fd99f7dc4e30a4d58a2560ede52aef70d5c149b4635c","kdf":"scrypt","kdfparams":{"salt":"c9197a9b3ef9447e2c9b178cb8c0e9932ba7822002f08a06d85ecb8fc0c6c903","n":4096,"dklen":32,"p":1,"r":8},"mac":"a500e9ffd2b49794633dc5e846d6ef9856aea30de2095599b1db526cb964f028"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-10-01T09-31-29.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"7fec53a97319ebff9a671eeef9e25c3b","mnemonicCiphertext":"8f88352567bbb001cb64936f84d5721b","version":"0.1"}}',
      password1: '',
      password2: '',
      keystore_password: '',

    }
  }

  render () {
    return (

      <View style={styles.container}>
        <ScrollableTabView
          initialPage={0}
          style={styles.tabBarStyle}
          tabBarActiveTextColor={Colors.activeTint}
          tabBarInactiveTextColor={Colors.inActiveTint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <ScrollableTabBar style={{borderBottomWidth: 0}}/>}
          onChangeTab={({i, ref}) => {
            // this.props.loadRecords(RecordTags[i])
          }}>
          <View tabLabel='Mnemonic' style={styles.content}>
            {/*<View style={styles.titleBox}>*/}
              {/*<Text style={styles.titleText}>Import mnemonic</Text>*/}
            {/*</View>*/}
            <TextInput
              multiline
              placeholder='输入助记词'
              style={styles.mnemonicInput}
              value={this.state.mnemonic}
              onChangeText={(mnemonic) => this.setState({mnemonic})}/>
            <DoublePwdInput/>

            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.cancelButton} onPress={this.props.navigate.back}>
                <Text style={styles.label}> Cancel </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}
                                onPress={() => {this.props.importFromMnemonic(this.state.mnemonic, '123')}}>
                <Text style={styles.label}> Confirm </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View tabLabel='Keystore' style={styles.content}>
            <TextInput
              multiline
              numberOfLines={5}
              placeholder='keystore文本内容'
              placeholderTextColor={Colors.cloud}
              style={styles.keystoreInput}
              value={this.state.keystore}
              onChangeText={(keystore) => this.setState({keystore})}/>
            <SinglePwdInput/>

            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.cancelButton} onPress={this.props.navigate.back}>
                <Text style={styles.label}> Cancel </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={() => {
                // this.props.openPwdModal()
                var keystore = this.state.keystore
                this.props.importEncryptWallet(JSON.parse(keystore), '123')
              }}>
                <Text style={styles.label}> Confirm </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollableTabView>

      </View>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    pwd: state.newPwdModal.pwd2
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    importFromMnemonic: (mnemonic, password) => dispatch(WalletActions.importFromMnemonic({mnemonic, password})),
    importEncryptWallet: (keystore, password) => dispatch(WalletActions.importEncryptWallet({keystore, password})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
