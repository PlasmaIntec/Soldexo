import React, { PropTypes } from 'react';
import { ScrollView, View, Image, Button, Text, FlatList } from 'react-native';
import { ListItem, Badge, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react';

@inject('users') 
@observer
export default class LogoutScreen extends React.Component {

  imgPlaceholder = 'https://cdn.pixabay.com/photo/2017/03/21/02/00/user-2160923_960_720.png'

  onPressLogout() {
    this.props.users.logout();
  }

  render () {
    return (
      <ScrollView style={{ padding: 20 }}>
        {
          this.props.users && this.props.users.name &&  
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{uri: (this.props.users.avatar || this.imgPlaceholder)}}
              style={{
                width: 100, 
                height: 100, 
                borderRadius: 50, 
                margin: 20, 
                resizeMode: 'cover'
              }}
            />
            <Text style={{fontSize: 25}}>{
              this.props.users.name
            }</Text>
          </View>
        }
        <Button
          style={{ margin: 20 }}
          onPress={this.onPressLogout.bind(this)}
          title="Logout"
        />
      </ScrollView>
    )
  }
}