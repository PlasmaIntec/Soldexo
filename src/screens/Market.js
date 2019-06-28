import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import BuyScreen from './Buy';
import SellScreen from './Sell';

const screens = {
    Buy: BuyScreen,
    Sell: SellScreen
};

const options = {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Buy') {
                iconName = 'shopping-cart';
            } else if (routeName === 'Sell') {
                iconName = 'tag';
            }

            return <Icon name={iconName} size={30} color={tintColor} />
        }
    })
}

export default createBottomTabNavigator(screens, options);