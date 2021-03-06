import React, { Component } from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Alert } from 'react-native'
import { connect } from 'react-redux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ImportWalletScreenStyle'
import WalletActions from '../Redux/WalletRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import DoublePwdInput from '../Components/DoublePwdInput'
import SinglePwdInput from '../Components/SinglePwdInput'
import I18n from '../I18n'

class ImportWalletScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('ImportWallet'),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      mnemonic: '', //'taxi reward file cattle canoe orbit uniform civil tourist sun donkey need',
      keystore: '', //'{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"d64a43b1-06de-468d-bc06-e6b39d515428","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"cdb19e71fcf868c842bf6c2a4006e0bb"},"ciphertext":"05cfe364bfb847ec9f27fd99f7dc4e30a4d58a2560ede52aef70d5c149b4635c","kdf":"scrypt","kdfparams":{"salt":"c9197a9b3ef9447e2c9b178cb8c0e9932ba7822002f08a06d85ecb8fc0c6c903","n":4096,"dklen":32,"p":1,"r":8},"mac":"a500e9ffd2b49794633dc5e846d6ef9856aea30de2095599b1db526cb964f028"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-10-01T09-31-29.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"7fec53a97319ebff9a671eeef9e25c3b","mnemonicCiphertext":"8f88352567bbb001cb64936f84d5721b","version":"0.1"}}',
    }
  }

  componentDidMount () {
    Alert.alert(
      I18n.t('Attention')+'!!!',
      I18n.t('ImportWarning'),
      [
        {text: I18n.t('ImportAnyway')},
        {text: I18n.t('Cancel'), onPress: this.props.back, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  _checkPwd () {
    let { alert } = this.props
    if (this.props.pwd1 === this.props.pwd2) {
      this.props.navigate('PreBackupScreen')
    } else {
      alert(I18n.t('PwdDismatch'))
    }
  }

  render () {
    let { pwd, pwd1, pwd2, pwdValid, back, importFromMnemonic, importEncryptWallet, alert, loading } = this.props
    return (
      <View style={styles.container}>
        <ScrollableTabView
          initialPage={0}
          style={styles.tabBarStyle}
          tabBarActiveTextColor={Colors.activeTint}
          tabBarInactiveTextColor={Colors.inActiveTint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <ScrollableTabBar style={{borderBottomWidth: 0}}/>}>
          <View tabLabel={I18n.t('Mnemonic')} style={styles.content}>
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100}>
            <TextInput
              multiline
              placeholder={I18n.t('ImportMnemonic')}
              placeholderTextColor={Colors.cloud}
              underlineColorAndroid={'transparent'}
              style={styles.mnemonicInput}
              value={this.state.mnemonic}
              onChangeText={(mnemonic) => this.setState({mnemonic})}/>
            <DoublePwdInput focus={false}/>

            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.cancelButton} onPress={back}>
                <Text style={styles.label}> {I18n.t('Cancel')} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}
                disabled={loading}
                onPress={() => {
                  console.tron.log('this.props', this.props)
                  if(!this.state.mnemonic || this.state.mnemonic.length < 40){
                    alert(I18n.t('IncorrectMnemonic'))
                    return;
                  }
                  if(!pwdValid){
                    alert(I18n.t('PwdInvalid'))
                  }
                  if (!!pwd1 && pwd1 === pwd2) {
                    importFromMnemonic(this.state.mnemonic, pwd2)
                  } else {
                    alert(I18n.t('PwdDismatch'))
                  }
                }}>
                <Text style={styles.label}> {I18n.t(loading?'Loading':'Import')} </Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </View>
          <View tabLabel='Keystore' style={styles.content}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100}>
            <TextInput
              multiline
              numberOfLines={5}
              placeholder={I18n.t('ImportKeystore')}
              placeholderTextColor={Colors.cloud}
              underlineColorAndroid={'transparent'}
              style={styles.keystoreInput}
              value={this.state.keystore}
              onChangeText={(keystore) => this.setState({keystore})}/>
            <SinglePwdInput/>

            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.cancelButton} onPress={back}>
                <Text style={styles.label}> {I18n.t('Cancel')} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}
                disabled={loading}
                onPress={() => {
                  var keystore = this.state.keystore
                  if(!keystore ){
                    alert(I18n.t('InvalidKeystore'))
                    return
                  }
                  if(!pwd){
                    alert(I18n.t('PwdEmpty'))
                    return
                  }
                  try {
                    keystore = JSON.parse(keystore)
                    importEncryptWallet(keystore, pwd)
                  } catch(e) {
                    alert(I18n.t('InvalidKeystore'))
                  }
                }
              }>
                <Text style={styles.label}> {I18n.t(loading?'Loading':'Import')} </Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollableTabView>
      </View>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    pwd1: state.doublePwdInput.pwd1,
    pwd2: state.doublePwdInput.pwd2,
    pwdValid: state.doublePwdInput.pwd1valid,
    pwd: state.singlePwdInput.pwd,
    loading: state.wallet.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    importFromMnemonic: (mnemonic, password) => dispatch(WalletActions.importFromMnemonic({mnemonic, password})),
    importEncryptWallet: (keystore, password) => dispatch(WalletActions.importEncryptWallet({keystore, password})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    back: () => dispatch(NavigationActions.back()),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
