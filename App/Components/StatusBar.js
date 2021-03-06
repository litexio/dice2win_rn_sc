import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/StatusBarStyle'

import { connect } from 'react-redux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import ChannelActions from '../Redux/ChannelRedux'

import I18n from '../I18n'

class StatusBar extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if(!dbInitializing && scclient == null) {
      this.props.loadChannel(true)
    } else {
      this.props.loadChannel(false)
    }
  }

  _getChannelstyles=(status)=>{
    switch (status) {
      case 0:
        return styles.channelStatusPending;
      case 2:
        return styles.channelStatusActive;
      case 6:
        return styles.channelStatusClosed;
      default:
        return styles.channelStatusClosed;
    }

  }

  _getChannelStatusDescribe=(status)=>{
    switch (status) {
      case 0:
        return I18n.t('ChannelPending');
      case 2:
        return I18n.t('ChannelActive');
      case 6:
        return I18n.t('ChannelClosed');
      default:
        return I18n.t('ChannelClosed');
    }
 }

 _getChannelDescribe=(status)=>{
  switch (status) {
    case 2:
      return I18n.t('ChannelActiveDesc');
    default:
      return I18n.t('ChannelDesc');
  }
}

_onPressNavigate=()=>{
  const { routes, index } = this.props;
  const route = routes[index];
  const {routeName=''} = route;
  if (routes &&  routeName !== 'ChannelScreen') {
    this.props.navigate('ChannelScreen');
  }
}

  render () {
    const { channel, web3Status, socketStatus} = this.props;
    const connetcStyle = web3Status && socketStatus ? {} : {backgroundColor: 'red'};
    const channelText = I18n.t('ChannelStatus') + ':' + this._getChannelStatusDescribe(channel.status) + ', ' + this._getChannelDescribe(channel.status) + '.';
    const connectDes =  web3Status && socketStatus ? channelText : I18n.t('ServerConnectionException');


    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={_=>this._onPressNavigate()}>
          <Text style={[this._getChannelstyles(channel.status), connetcStyle]}>{connectDes}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    channel: { channel, web3Status, socketStatus},
    nav:{routes=[], index=0}
  } = state;
  return { channel, web3Status, socketStatus, routes, index}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    loadChannel: (doInit) => dispatch(ChannelActions.channelRequest({doInit}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)

