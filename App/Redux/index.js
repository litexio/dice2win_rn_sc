import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import ReduxPersist from '../Config/ReduxPersist'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  user: require('./UserRedux').reducer,
  activity: require('./ActivityRedux').reducer,
  record: require('./RecordRedux').reducer,
  wallet: require('./WalletRedux').reducer,
  game: require('./GameRedux').reducer,
  bet: require('./BetRedux').reducer,
  confirmModal: require('./ConfirmModalRedux').reducer,
  newPwdModal: require('./NewPwdModalRedux').reducer,
  pwdModal: require('./PwdModalRedux').reducer,
  messageBox: require('./MessageBoxRedux').reducer,
  config: require('./ConfigRedux').reducer,
  setting: require('./SettingRedux').reducer,
  notification: require('./NotificationRedux').reducer,
  doublePwdInput: require('./DoublePwdInputRedux').reducer,
  singlePwdInput: require('./SinglePwdInputRedux').reducer,
  channelConfirmModal: require('./ChannelConfirmModalRedux').reducer,
  channelWithdrawModal: require('./ChannelWithdrawModalRedux').reducer,
  channel: require('./ChannelRedux').reducer,
})

export default () => {
  let finalReducers = reducers
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig
    finalReducers = persistReducer(persistConfig, reducers)
  }

  let {store, sagasManager, sagaMiddleware} = configureStore(finalReducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas)
      })
    })
  }

  return store
}
