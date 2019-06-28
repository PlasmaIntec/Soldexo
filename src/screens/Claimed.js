import React, { PropTypes } from 'react';
import { ScrollView, View, Image, Button, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Body, ListItem, Badge, Right, Left } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react';

@inject('users', 'itemsStore') 
@observer
export default class ClaimedScreen extends React.Component {
  render () {
    const ownBids = this.props.itemsStore.getOwnBids(this.props.users);
    return (
      <ScrollView style={{ padding: 20 }}>
        <ListItem itemHeader>
          <Text>Your claimed bids ({ownBids.length})</Text>
        </ListItem>
        <FlatList
          data={ownBids}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ borderWidth: 50 }}>
                <CardItem header bordered>
                    <Text>Meal</Text>
                    {
                      item.buyer &&
                      !item.lowerer || item.lowerAccepted &&
                      <Right>
                      <Badge style={{ backgroundColor: 'green', color: 'white' }}>
                          <Text>BOUGHT</Text>
                      </Badge>
                      </Right>
                    }
                    {
                      item.lowerPrice &&
                      item.lowerConfirmed &&
                      !item.lowerAccepted &&
                      <Right>
                      <Badge style={{ backgroundColor: 'red', color: 'white' }}>
                          <Text>REJECTED</Text>
                      </Badge>
                      </Right>
                    }
                </CardItem>
                <CardItem bordered>
                    <Body>
                      <Text>Seller: {item.seller}</Text>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>Time: {item.time}</Text>
                    </Body>
                </CardItem>
                {
                  item.lowerPrice &&
                  item.lowerConfirmed &&
                  item.lowerAccepted &&
                  <CardItem bordered>
                    <Body>
                        <Text>Accepted Price: ${item.lowerPrice}</Text>
                    </Body>
                    <Right>
                    <Badge style={{ backgroundColor: 'purple', color: 'white' }}>
                        <Text>Original: ${item.price}</Text>
                    </Badge>
                    </Right>
                  </CardItem>
                }
                {
                  item.lowerPrice &&
                  item.lowerConfirmed &&
                  !item.lowerAccepted &&
                  <CardItem bordered>
                    <Body>
                        <Text>Rejected Price: ${item.lowerPrice}</Text>
                    </Body>
                    <Right>
                    <Badge style={{ backgroundColor: 'red', color: 'white' }}>
                        <Text>Original: ${item.price}</Text>
                    </Badge>
                    </Right>
                  </CardItem>
                }
                {
                  item.lowerPrice &&
                  !item.lowerConfirmed &&
                  <CardItem bordered>
                    <Body>
                        <Text>Pending Price: ${item.lowerPrice}</Text>
                    </Body>
                    <Right>
                    <Badge style={{ backgroundColor: 'orange', color: 'white' }}>
                        <Text>Original: ${item.price}</Text>
                    </Badge>
                    </Right>
                  </CardItem>
                }
                {
                  !item.lowerPrice &&
                  <CardItem bordered>
                    <Body>
                        <Text>Price: ${item.price}</Text>
                    </Body>
                  </CardItem>
                }
            </Card>
          )}
        />
      </ScrollView>
    )
  }
}