import React from "react";
import { AppRegistry, ImageBackground, Image, FlatList, StatusBar } from "react-native";
import { Container, Content, Text, Button, Left, Body, Right, Badge } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { inject, observer } from 'mobx-react';

const routeIcon = (route) => {
    switch (route) {
        case 'Market':
            return 'flag'
        case 'Chats':
            return 'comments-o'
        case 'Profile':
            return 'user'
        case 'Search':
            return 'link'
    }
}

@inject('itemsStore', 'users')
@observer
export default class SideBar extends React.Component {
    render() {
    return (
      <Container>
        <Content>
            <ImageBackground
                source={{
                    uri: "https://raw.githubusercontent.com/GeekyAnts/NativeBase-KitchenSink/master/assets/drawer-cover.png"
                }}
                style={{
                    height: 120,
                    alignSelf: "stretch",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >                
                <Image
                    square
                    style={{ height: 80, width: 70 }}
                    source={{
                        uri: "https://raw.githubusercontent.com/GeekyAnts/NativeBase-KitchenSink/master/assets/logo.png"
                    }}
                />
            </ImageBackground>
            <FlatList
                data={this.props.navigation.state.routes}
                renderItem={({item}) => ((
                    <Button
                        full
                        light
                        onPress={() => this.props.navigation.navigate(item.key)}>
                        <Left style={{ marginLeft: 20 }}>
                            <Icon 
                                name={routeIcon(item.key)}
                                size={20} 
                                color={"red"} 
                            />
                        </Left>
                        <Body style={{ marginHorizontal: 30 }}>
                            <Text>{item.key}</Text>
                        </Body>
                        <Right style={{ marginRight: 20 }}>
                            {
                                item.key === 'Profile' &&
                                this.props.itemsStore.getOwnItems(this.props.users).length != 0 &&
                                <Badge><Text>{this.props.itemsStore.getOwnItemsNotificationsCount(this.props.users)}</Text></Badge>
                            }
                        </Right>
                    </Button>
                ))}
            />
        </Content>
      </Container>
    );
  }
}
