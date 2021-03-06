// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from 'react-native-config'

// our "constructor"
const create = (baseURL = Config.BASE_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  ApiSauceObj = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getRoot = () => ApiSauceObj.get('')
  const getConfig = ({locale}) => ApiSauceObj.get('api/v1/games/dev/configs', {locale})
  const getABI = () => ApiSauceObj.get('api/v1/games/dev/abi')
  const getBanners = ({locale}) => ApiSauceObj.get('api/v1/games/dev/banners', {locale})
  const getNotices = ({locale}) => ApiSauceObj.get('api/v1/games/dev/notices', {locale})
  const getRecord = ({gameId, address, page, size}) => ApiSauceObj.get('api/v1/games/dev/bet/history', {gameId, address, page, size})
  const getUser = (uid) => ApiSauceObj.get('api/v1/games/dev/userinfo', {uid})
  const getPromotion = (uid) => ApiSauceObj.get('api/v1/games/dev/shareinfo', {uid})
  const getPromotionRecords = (data) => ApiSauceObj.get('api/v1/games/dev/shares', data)
  const getRandom = ({address, network_id}) => ApiSauceObj.put('api/v1/games/dev/random', {address, network_id})
  const getTx = (data) => ApiSauceObj.get('api/v1/games/dev/transactions', data)
  const commitTx = ({commit, tx_hash}) => ApiSauceObj.put('api/v1/games/dev/commit', {commit, tx_hash})
  const refreshStatus = ({hash}) => ApiSauceObj.get('api/v1/games/dev/bet_status', {hash})

  const register = ({inviter, nickname, address}) => ApiSauceObj.put('api/v1/games/dev/register', {aff_code: inviter, nickname, eth_address: address})
  const withdraw = ({uid, amount}) => ApiSauceObj.put('api/v1/games/dev/withdraw', {uid, amount})

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getConfig,
    getABI,
    getBanners,
    getNotices,
    getRecord,
    getUser,
    getPromotion,
    getPromotionRecords,
    getRandom,
    getTx,
    commitTx,
    refreshStatus,

    register,
    withdraw,
  }
}

// let's return back our create method as the default.
export default {
  create
}
