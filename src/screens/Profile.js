import React, { PropTypes } from 'react';
import { ScrollView, View, Image, Button, Text, FlatList } from 'react-native';
import { ListItem, Badge, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react';
import { createBottomTabNavigator } from 'react-navigation';
import IconBadge from 'react-native-icon-badge';

import LogoutScreen from './Logout';
import OnBidScreen from './OnBid';
import ClaimedScreen from './Claimed';

import IconWithBadge from '../components/IconWithBadge';

const screens = {
  Logout: LogoutScreen,
  OnBid: OnBidScreen,
  Claimed: ClaimedScreen
};

const options = {
  defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Logout') {
            iconName = 'user';
          } else if (routeName === 'OnBid') {
            iconName = 'eye';
          } else if (routeName === 'Claimed') {
            iconName = 'shield';
          }

          return <IconWithBadge route={routeName} icon={iconName} tintColor={tintColor} />
      }
  })
}

export default createBottomTabNavigator(screens, options);

