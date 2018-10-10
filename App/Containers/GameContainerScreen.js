import React, { Component } from 'react'
import { ScrollView, Text, View, Button, TouchableOpacity, TextInput, Image} from 'react-native'
import { connect } from 'react-redux'

import NavigationActions from 'react-navigation/src/NavigationActions'
import GameActions from '../Redux/GameRedux'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'
import PwdModalActions from '../Redux/PwdModalRedux'

import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TwoDice'
import Etheroll from '../Components/Etheroll'

import ResultModal from '../Components/ResultModal'

import styles from './Styles/GameContainerScreenStyle'

import WalletActions from '../Redux/WalletRedux'
import { displayETH, DECIMAL } from '../Lib/Utils/format'

const GAME_COMS = {2:<Coin />, 6:<OneDice />, 36:<TwoDice />, 100:<Etheroll />}
const GAME_TITLES = {2: 'Coin Flip', 6: 'Roll a Dice', 36: 'Two Dices', 100: 'Etheroll'}

class GameContainerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.getParam('title'),
      headerRight: (
        <Button
          onPress={navigation.getParam('gotoRecords')}
          title="Records"
          color="#fff"
        />
      )
    }
  }

  _placeBet = ()=>{
    let { index, stake, contract_address, address, betMask, openConfirmModal, navigate, getRandom, balance } = this.props


    if(!W.address) {
      navigate('WalletManageScreen')
    } else if (stake >= balance) {

      alert('You don\'t have enough balance to place Bet')

    } else {



      getRandom({address: W.address})

      // callback actions
      let confirmedActions = [{
        action: WalletActions.placeBet,
        data: { address, value: stake, betMask, modulo: index, password: '' }
      }]

      openConfirmModal({
        amount: stake,
        from: address,
        to: contract_address,
        confirmedActions
      })
    }
  }

  componentDidMount(){
    this.props.navigation.setParams({ gotoRecords: _=>this.props.navigate('GameRecordScreen')})
    this.props.navigation.setParams({ title: GAME_TITLES[this.props.index]})
    this.props.loadWallet()
  }

  render () {
    let { index, stake, balance, status, result, rewardTime, winRate,
      setStake, addUnit, rmUnit,
    } = this.props
    return (
      <ScrollView style={styles.container}>
        <View style={styles.GameContainerScreen}>
          {status[index]!='idle' && (
            <ResultModal modulo={index} status={status[index]} result={result[index]} />
          )}

          {status[index] === 'idle' && <View style={styles.gameConetent}>

            {GAME_COMS[index]}

            <View style={styles.stakeBox}>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake('0.05')}>
                <Text style={styles.stakeButtonText}>0.05</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake('0.10')}>
                <Text style={styles.stakeButtonText}>0.10</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake('0.15')}>
                <Text style={styles.stakeButtonText}>0.15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton}>
                <Text style={styles.stakeButtonText}>Max</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stakeBox} >
              <TouchableOpacity style={styles.stakeButton} onPress={rmUnit}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>-</Text>
              </TouchableOpacity>
              <TextInput value={stake} style={styles.stakeInput}
                        autoFocus={true} onChangeText={(val) => setStake(val)}/>
              <TouchableOpacity style={styles.stakeButton} onPress={addUnit}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceText}>balance: <Text>{displayETH(balance)} ETH</Text></Text>
            <View style={styles.rewardWrapper}>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning pays</Text>
                  <Text style={styles.keyText}>{(this.props.rewardTime).toFixed(2)}x</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning chance</Text>
                  <Text style={styles.keyText}>{(winRate * 100).toFixed(2)}%</Text>
                </View>
              </View>
              <Text style={styles.rewardText}>you will win <Text style={styles.keyText}>{(rewardTime * stake).toFixed(DECIMAL)} ETH</Text></Text>
              <Text style={[styles.label, {fontSize: 11}]}>1% fee, 5% of bonus to your inviter</Text>
            </View>
            <View style={styles.startButtonWrapper}>
              <TouchableOpacity style={styles.startButton} onPress={this._placeBet}>
                <Text style={styles.startButtonText}> Bet! </Text>
              </TouchableOpacity>
            </View>
          </View>}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    game: {key, stake, status, result },
    confirmModal: { modalIsOpen, loading, gas },
    bet: { winRate, rewardTime, betMask, },
    config: {contract_address},
    wallet: { balance, address, gasPrice, secret }
  } = state
  return {
    index:key, stake, status, result,
    modalIsOpen, loading, gas,
    winRate, rewardTime, betMask,
    contract_address,
    balance, address, gasPrice, secret
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    initGame: () => dispatch(GameActions.initGame()),
    request: () => dispatch(GameActions.gameRequest()),

    setStake: (stake) => dispatch(GameActions.setStake(stake)),
    addUnit: () => dispatch(GameActions.addUnit()),
    rmUnit: () => dispatch(GameActions.rmUnit()),

    openConfirmModal: (data) => dispatch(ConfirmModalActions.openConfirmModal(data)),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),

    updateStatus: (status) => dispatch(GameActions.updateStatus(status)),

    sendStake: () => dispatch(WalletActions.sendStake()),
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    getRandom: (data) => dispatch(WalletActions.getRandom(data)),
    placeBet: (data) => dispatch(WalletActions.placeBet(data)),

    navigate: (target) => dispatch(NavigationActions.navigate({routeName:target}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainerScreen)
