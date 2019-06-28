import React, { PropTypes } from 'react';
import { ScrollView, View, Image, Button, Text, FlatList } from 'react-native';
import { ListItem, Badge, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react';
import { createBottomTabNavigator } from 'react-navigation';
import IconBadge from 'react-native-icon-badge';

const fetchBadgeCount = (user, route, store) => {
    switch (route) {
        case 'OnBid':
            return store.getOwnItemsNotificationsCount(user);
        case 'Claimed': // TODO: think of a user-oriented reason to be notified about this screen
            return 0;
        default:
            return 0;
    }
}

@inject('users', 'itemsStore')
@observer
export default class IconWithBadge extends React.Component {
    render() {
        const { route, icon, tintColor, itemsStore, users } = this.props;
        const ownBids = this.props.itemsStore.getOwnBids(name);
        const ownItems = this.props.itemsStore.getOwnItems(name);
        const badgeCount = fetchBadgeCount(users, route, itemsStore);
        return (
            <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                <IconBadge
                MainElement={
                    <Icon style={{ margin: 6 }} name={icon} size={30} color={tintColor} />
                }
                BadgeElement={
                    <Text style={{color:'#FFFFFF'}}>{badgeCount}</Text>
                }
                Hidden={!badgeCount}
                />
            </View>
        )
    }
}