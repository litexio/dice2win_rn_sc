import Toast from 'react-native-root-toast'

const Web3 = require('web3');

async function checkWeb3Status() {
  try{
    let result = await web3.eth.net.isListening();
    Toast.show('web3 is ok' + result);
    console.tron.log('web3 is ok', result);
  }catch(err){
    web3.setProvider(new Web3.providers.WebsocketProvider(global.ethWSUrl));
    if (global.scclient != null) {
      Toast.show('init web3 here' );
      global.scclient.initWeb3(web3);
    }
  }
}

module.exports = {
  checkWeb3Status,
}
