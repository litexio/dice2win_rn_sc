import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

let BN = require('bn.js')

/* ------------- Types and Action Creators ------------- */

// const getRewardTime = (winRate, feeRate) => (1 - feeRate) * 0.95 / winRate + 0.05
const getRewardTime = (winRate, feeRate)=>2.00

const {Types, Creators} = createActions({
  loadCoin: null,
  loadOneDice: null,
  loadTwoDice: null,
  loadEtheroll: null,
  clickCoin: null,
  clickOneDice: ['idx'],
  clickTwoDice: ['idx'],
  clickEtheroll: ['val'],

  updateRewardTime: ['data'],
  betRequest: ['data'],
  betSuccess: ['payload'],
  betFailure: null
})

export const BetTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  bets: [],
  betsCount: 0,
  diceCount: 1,
  diceWeights: [],
  winRate: 0.5,
  rewardTime: 2,
  betMaskArr: [],
  betMask: new BN('1', 2),
  modulo: 2,
  feeRate: 0.01,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const BetSelectors = {
  getData: state => state.data,
  getWinRate: state => state.bet.winRate,
}

/* ------------- Reducers ------------- */
export const loadCoin = (state) =>
  state.merge({
    bets: [true, false],
    betsCount: 1,
    diceCount: 1,
    diceWeights: [1, 1],
    winRate: 0.5,
    rewardTime: 2.00,
    modulo: 2,
    betMask: 1,
    betMaskArr: [
      new BN('01', 2),
      new BN('10', 2)
    ]
  })

export const loadOneDice = (state) =>
  state.merge({
    bets: [true, false, true, false, true, false],
    betsCount: 3,
    diceCount: 3,
    diceWeights: [1, 1, 1, 1, 1, 1],
    winRate: 0.5,
    rewardTime: 2.00,
    betMask: 21,
    modulo: 6,
    betMaskArr: [
      new BN('000001', 2),
      new BN('000010', 2),
      new BN('000100', 2),
      new BN('001000', 2),
      new BN('010000', 2),
      new BN('100000', 2)
    ]
  })

export const loadTwoDice = (state) =>
  state.merge({
    bets: [true, false, true, false, true, false, true, false, true, false, true],
    betsCount: 6,
    diceCount: 18,
    diceWeights: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1],
    winRate: 0.5,
    rewardTime: 2.00,
    betMask: 45460576917,
    modulo: 36,
    betMaskArr: [
      new BN('000000000000000000000000000000000001', 2),
      new BN('000000000000000000000000000001000010', 2),
      new BN('000000000000000000000001000010000100', 2),
      new BN('000000000000000001000010000100001000', 2),
      new BN('000000000001000010000100001000010000', 2),
      new BN('000001000010000100001000010000100000', 2),
      new BN('000010000100001000010000100000000000', 2),
      new BN('000100001000010000100000000000000000', 2),
      new BN('001000010000100000000000000000000000', 2),
      new BN('010000100000000000000000000000000000', 2),
      new BN('100000000000000000000000000000000000', 2)]
  })

export const loadEtheroll = (state) => state.merge({
  betMask: 50,
  modulo: 100,
  winRate: 0.5,
  rewardTime: 2.00,
})

export const clickCoin = (state) => {
  console.tron.log('bets', state.bets)
  // let bets = _.clone(state.bets)
  let bets = [...state.bets]
  bets[0] = !bets[0]
  bets[1] = !bets[1]
  let betMaskSum = new BN('0', 2)
  for (var i = 0; i < 2; i++) {
    if (bets[i]) {
      betMaskSum = betMaskSum.iadd(state.betMaskArr[i])
    }
  }
  let betMask = betMaskSum.toNumber()
  let winRate = 0.5
  let {feeRate} = state
  let rewardTime = getRewardTime(winRate, feeRate)
  return state.merge({
    bets,
    betMask,
    winRate,
    rewardTime
  })
}

export const clickOneDice = (state, action) => {
  let bets = [...state.bets]
  let {idx} = action
  let betsCount = state.betsCount

  if ((betsCount === 1 && bets[idx]) || (betsCount === 5 && !bets[idx])) {
    return state
  } else {
    bets[idx] = !bets[idx]
    let betMaskSum = new BN('0', 2)
    let betsCount = 0
    let diceCount = 0
    for (let i = 0; i < 6; i++) {
      if (bets[i]) {
        betMaskSum = betMaskSum.iadd(state.betMaskArr[i])
        betsCount = betsCount + 1
        diceCount = diceCount + state.diceWeights[i]
      }
    }
    let betMask = betMaskSum.toNumber()

    let winRate = diceCount / 6
    let {feeRate} = state
    let rewardTime = getRewardTime(winRate, feeRate)
    return state.merge({
      bets,
      betMask,
      betsCount,
      diceCount,
      winRate,
      rewardTime
    })
  }
}

export const clickTwoDice = (state, action) => {
  let bets = [...state.bets]
  let {idx} = action
  let betsCount = state.betsCount

  if ((betsCount === 1 && bets[idx]) || (betsCount === 10 && !bets[idx])) {
    return state
  } else {
    bets[idx] = !bets[idx]
    let betMaskSum = new BN('0', 2)
    let betsCount = 0
    let diceCount = 0
    for (let i = 0; i < 11; i++) {
      if (bets[i]) {
        betMaskSum = betMaskSum.iadd(state.betMaskArr[i])
        betsCount = betsCount + 1
        diceCount = diceCount + state.diceWeights[i]
      }
    }
    let betMask = betMaskSum.toNumber()

    let winRate = diceCount / 36
    let {feeRate} = state
    let rewardTime = getRewardTime(winRate, feeRate)
    return state.merge({
      bets,
      betMask,
      betsCount,
      diceCount,
      winRate,
      rewardTime
    })
  }
}

export const clickEtheroll = (state, action) => {
  let betMask = action.val
  let winRate = action.val / 100
  let {feeRate} = state
  let rewardTime = getRewardTime(winRate, feeRate)
  return state.merge({
    betMask, winRate, rewardTime
  })
}

export const updateRewardTime = (state, {data:{winRate, feeRate}}) =>
  state.merge({rewardTime: getRewardTime(winRate, feeRate)})


// request the data from an api
export const request = (state, {data}) =>
  state.merge({fetching: true, data, payload: null})

// successful api lookup
export const success = (state, action) => {
  const {payload} = action
  return state.merge({fetching: false, error: null, ...payload})
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({fetching: false, error: true, payload: null})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_COIN]: loadCoin,
  [Types.LOAD_ONE_DICE]: loadOneDice,
  [Types.LOAD_TWO_DICE]: loadTwoDice,
  [Types.LOAD_ETHEROLL]: loadEtheroll,
  [Types.CLICK_COIN]: clickCoin,
  [Types.CLICK_ONE_DICE]: clickOneDice,
  [Types.CLICK_TWO_DICE]: clickTwoDice,
  [Types.CLICK_ETHEROLL]: clickEtheroll,

  [Types.UPDATE_REWARD_TIME]: updateRewardTime,
  [Types.BET_REQUEST]: request,
  [Types.BET_SUCCESS]: success,
  [Types.BET_FAILURE]: failure
})
