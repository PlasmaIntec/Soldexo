import React, { PropTypes } from 'react';
import { ScrollView, View, Image, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { Container, Header, Content, Card, CardItem, Text, Body, ListItem, Badge, Right,Left } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { observer, inject } from 'mobx-react';

@inject('users', 'itemsStore') 
@observer
export default class OnBidScreen extends React.Component {
  render () {
    const { confirmLower } = this.props.itemsStore;
    const { users } = this.props;
    const ownItems = this.props.itemsStore.getOwnItems(users);
    return (
      <ScrollView style={{ padding: 20 }}>
        <ListItem itemHeader>
          <Text>Your bidding items ({ownItems.length})</Text>
        </ListItem>
        <FlatList
            data={ownItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Card style={{ borderWidth: 50 }}>
                <CardItem header bordered>
                    <Text>Meal</Text>
                    {
                        item.isForbidden &&
                        !item.lowerPrice &&
                        <Right>
                        <Badge style={{ backgroundColor: 'green', color: 'white' }}>
                            <Text>SOLD</Text>
                        </Badge>
                        </Right>
                    }
                    {
                        item.isForbidden &&
                        item.lowerPrice &&
                        item.lowerConfirmed &&
                        item.lowerAccepted &&
                        <Right>
                        <Badge style={{ backgroundColor: 'purple', color: 'white' }}>
                            <Text>LOWER SOLD</Text>
                        </Badge>
                        </Right>
                    }
                    {
                        item.isForbidden &&
                        item.lowerPrice &&
                        item.lowerConfirmed &&
                        !item.lowerAccepted &&
                        <Right>
                        <Badge style={{ backgroundColor: 'red', color: 'white' }}>
                            <Text>LOWER DENIED</Text>
                        </Badge>
                        </Right>
                    }
                </CardItem>
                {
                  item.buyer &&
                  <CardItem bordered>
                    <Body>
                      <Text>Buyer: {item.buyer}</Text>
                    </Body>
                  </CardItem>
                  
                }
                <CardItem bordered>
                    <Body>
                        <Text>Time: {item.time}</Text>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>Price: ${item.lowerAccepted ? item.lowerPrice : item.price}</Text>
                    </Body>
                </CardItem>
                {
                  item.lowerPrice &&
                  !item.lowerConfirmed &&
                  <>
                    <CardItem bordered>
                        <Body>
                            <Text>Lower from: {item.lowerer}</Text>
                        </Body>
                        <Right>
                          <Text>Lower Price: ${item.lowerPrice}</Text>
                        </Right>
                    </CardItem>     
                    <CardItem>     
                      <Left>
                          <Button 
                              buttonStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} 
                              containerStyle={{ height: 50, width: '40%', margin: 10 }}
                              title='CALL' 
                              transparent 
                              onPress={() => {
                                  confirmLower({
                                    id: item.id,
                                    time: (new Date()).toString(),
                                    confirm: true,
                                    buyer: item.bidder
                                  })
                                  showMessage({
                                      message: 'CALLED',
                                      type: 'success',
                                      icon: 'auto'
                                  })
                              }}
                          ></Button>
                      </Left>
                      <Right>
                          <Button 
                              buttonStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'red' }} 
                              containerStyle={{ height: 50, width: '60%', margin: 10 }}
                              title='DENY' 
                              transparent 
                              onPress={() => { 
                                  confirmLower({
                                    id: item.id,
                                    time: (new Date()).toString(),
                                    confirm: false
                                  })
                                  showMessage({
                                      message: 'DENIED',
                                      type: 'danger',
                                      backgroundColor: 'red',
                                      icon: 'auto'
                                  })
                              }}
                          ></Button>
                      </Right>
                  </CardItem>     
                  </>               
                }
            </Card>
          )}
        />
      </ScrollView>
    )
  }
}