/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put} from 'redux-saga/effects'
import WalletActions from '../Redux/WalletRedux'
import AppConfig from '../Config/AppConfig'
import abi from '../Config/abi'
import walletLib from '../Lib/Wallet/wallet'

// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')


export function * newWallet (api, action) {
  console.tron.log('newWallet begin')
  const wallet = yield call(ethers.Wallet.RNCreateRandom)
  console.tron.log('newWallet', wallet)
  AppConfig.wallet = wallet
  yield put(WalletActions.setWallet(wallet))
}



export function * initWallet (api, action) {

  yield call(walletLib.initWallet)
  // const delay = (ms) => new Promise(res => setTimeout(res, ms))
  yield socket.emit('lottery', W.wallet.address)
  //yield call(delay, 1000)
  // yield delay(5000)




}
// 从助记词导入钱包
export function * importWallet (api, action) {

  const wallet = yield call(ethers.Wallet.fromMnemonic, action.mnemonic.mnemonic)
  AppConfig.wallet = wallet
}

// 从keystore导入钱包
export function * importEncryptWallet (api, action) {
  console.log('wallet importEncryptWallet', action)
  var json = JSON.stringify(action.data.keystore)
  var pwd = action.data.pwd
  let wallet = yield call(ethers.Wallet.RNfromEncryptedWallet, json, pwd)
  AppConfig.wallet = wallet
}

export function * encryptWallet (api, action) {
  const wallet = AppConfig.wallet
  const keystore = yield wallet.RNencrypt(action.data.pwd)
  yield put(WalletActions.setKeystore(keystore))
}

export function * transfer (api, action) {
  const wallet = AppConfig.wallet
  let amount = ethers.utils.parseEther(action.data.value)
  var provider = ethers.providers.getDefaultProvider(AppConfig.network)
  wallet.provider = provider
  let txHash = yield wallet.send(action.data.to, amount)
  console.tron.log('setTx', txHash)
  yield put(WalletActions.setTx(txHash))
}

export function * getBlance (api, action) {
  const balance = yield call(walletLib.getBalance, W.wallet)
  yield put(WalletActions.setBalance(balance))
}

export function * getRandom (api, action) {
  console.tron.log('action', action)
  var url = 'http://api.eth4.fun:7001/api/v1/games/dev/random'
  const res = yield axios.put(url, {
    'address': action.data.address,
    'network_id': '1'
  })
  console.tron.log('res', res)
  const wallet = W.wallet
  wallet.provider = ethers.providers.getDefaultProvider(W.network)


  console.tron.log('res2', wallet)

  var contractAddress = '0xAe985667078744A8EFb0C6c0300D7861EF427148'
  var contract = new ethers.Contract(contractAddress, abi, wallet)
  var overrideOptions = {
    value: ethers.utils.parseEther(action.data.value),
    gasPrice: parseInt(res.data.gasPrice)
  }


  console.tron.log('res3', action.data, overrideOptions)
  let ans = yield contract.placeBet(action.data.betMask, action.data.modulo, res.data.secret.commitLastBlock, res.data.secret.commit,
    res.data.secret.signature.r, res.data.secret.signature.s, overrideOptions)
  console.tron.log('ans', ans)
}

export function* getWallet(api, action) {
  const { data } = action
  try {
    const balance = yield call(walletLib.getBalance, W.wallet)
    console.tron.log('getWallet', balance)
    yield put(WalletActions.walletSuccess({ address: W.wallet.address, balance: balance }))

  } catch (err) {
    yield put(WalletActions.walletFailure())
  }
}
