/*
 * 5. App.js
 */

import React from 'react';
import { Platform, View } from 'react-native';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import { Provider, observer, inject } from 'mobx-react';
import FlashMessage from 'react-native-flash-message';

import SideBar from './src/components/SideBar';
import Market from './src/screens/Market';
import Login from './src/screens/Login';
import Chats from './src/screens/Chats';
import Search from './src/screens/Search';
import Profile from './src/screens/Profile';
import { users, chats, itemsStore } from './src/stores';

const screens = {
    Market:  { screen: Market  },
    Chats:   { screen: Chats   },
    Search:  { screen: Search  },
    Profile: { screen: Profile }
};
let Stack, options;
if(Platform.OS === 'ios') {
  options = {
    tabBarOptions: {
      inactiveTintColor: '#aaa',
      activeTintColor:   '#000',
      showLabel: 	 true
    }
  };
  Stack = createBottomTabNavigator(screens, options);
} else {
  options = {
    contentComponent: SideBar
  }
  Stack = createDrawerNavigator(screens, options);
}

const Navigator = createAppContainer(Stack);

type Props = {};
@inject('users', 'chats', 'itemsStore')
@observer
class AuctionApp extends React.Component<Props> {
  render() {
    if(this.props.users.isLoggedIn) {
      return (
        <View style={{ flex: 1 }}>
          <Navigator/>
          <FlashMessage style={{ flex: 1, justifyContent: 'center' }} position='top' />
        </View>
      )
    } else {
      return <Login/>
    }
  }
}

export default class App extends React.Component<Props> {
  render() {
    return (
      <Provider users={users} chats={chats} itemsStore={itemsStore}>
        <AuctionApp/>
      </Provider>
    )
  }
}