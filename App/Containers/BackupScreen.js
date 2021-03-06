import React, { Component } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'

// Styles
import styles from './Styles/BackupScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import I18n from '../I18n'

Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

class BackupScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('BackupMnemonic'),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      // mnemonic: 'a s d f g a',
      textareaArray: [],
      textarea: '',
      stateWord: [],
      wordState: []
    }

  }

  componentDidMount () {
    this._displayWord()
  }

  _displayWord () {
    console.log(this.state)
    var mnemonic = this.props.mnemonic
    // var words = mnemonic.split(' ').sort(()=> .5 - Math.random());
    var words = mnemonic.split(' ').sort(
      function() {
        return .5 - Math.random();
      }
    );
      var wordState = new Array()
      words.map((item, i) => wordState[i] = true)
      this.setState({
        stateWord: words,
        wordState: wordState
      }, () => {
        this.forceUpdate();
        console.tron.log(this.state);
      })
  }

  _addWord (i) {
    var wordState = this.state.wordState
    var stateWord = this.state.stateWord
    var textarea = this.state.textarea
    var textareaArray = this.state.textareaArray
    textareaArray.push(i)
    console.tron.log('add',textareaArray)
    textarea === '' ? textarea = stateWord[i] : textarea = textarea + ' ' + stateWord[i]
    // textareaArray = textarea.join(' ')
    wordState[i] = !wordState[i]
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    })
  }

  _rmWord (i) {
    var stateWord = this.state.stateWord
    var wordState = this.state.wordState
    var textareaArray = this.state.textareaArray
    textareaArray.remove(i)
    console.tron.log('rm',textareaArray)
    var textarea = ''
    var tmpArray = new Array()
    textareaArray.map(i => tmpArray.push(stateWord[i]))
    textarea = tmpArray.join(' ')
    wordState[i] = !wordState[i]
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    })
  }

  _checkMnemonic () {
    let { alert } = this.props

    if (this.state.textarea === this.props.mnemonic) {
      this.props.saveWallet(this.props.mnemonic, this.props.password)
    }
    else {
      alert(I18n.t('WrongMnemonic'))
    }
  }

  renderItem (item, i) {
    return (
      <TouchableOpacity
        style={ this.state.wordState[i] ? styles.darkButton : styles.lightButton}
        onPress={() => {this.state.wordState[i] ? this._addWord(i) : this._rmWord(i)}}
        key={i}>
        <Text
          style={styles.label}
          style={this.state.wordState[i] ? styles.darkText : styles.lightText}>
          {item}
        </Text>
      </TouchableOpacity>
    )

  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{I18n.t('BackupMnemonic')+'\n'}</Text>
          <Text style={styles.infoText}>{I18n.t('MnemonicConfirm')}</Text>
        </View>
        <TextInput style={styles.textArea}
                   placeholderTextColor={Colors.inActiveTint}
                   underlineColorAndroid={'transparent'}
                   multiline={true}
                   numberOfLines={5}
                   value={this.state.textarea}
                   editable={false}
                   onChangeText={(textarea) => this.setState({textarea})}/>
        <View style={styles.buttonArea}>
          {this.state.stateWord.map((item, i) => this.renderItem(item, i))}
        </View>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.confirmButton} onPress={() => this._checkMnemonic()}>
            <Text style={styles.label}> {I18n.t('Next')} </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mnemonic: state.wallet.wallet.mnemonic,
    password: state.doublePwdInput.pwd2
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveWallet: (mnemonic, password) => dispatch(WalletActions.saveWallet({mnemonic, password})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupScreen)
