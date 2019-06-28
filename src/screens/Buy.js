import React from 'react';
import { View, TouchableHighlight, TextInput, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { meals, prices } from '../constants';
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text'

import {
    Card,
    CardItem,
    Left,
    Body,
    Text,
    Right,
    Title,
    DatePicker
} from 'native-base';

const timeToColor = (time) => {
    for (meal of meals) {
        if (time < meal.time) {
            return meal.color;
        }
    }
    return 'black';
}

const calculateDiscount = (price, time) => {
    let mealType;
    for (meal of meals) {
        if (time < meal.time) {
            mealType = meal.meal;
        }
    }
    return mealType ? (100 - price / prices[mealType] * 100).toFixed(0) : 'No';
}

@inject('itemsStore', 'users')
@observer
export default class BuyScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            bidValue: 0,
            currentItem: null
        }
    }

    handleLowerBid = (chosenMoney) => {
        this.setState({
            bidValue: chosenMoney.slice(1)
        });
    }

    render() {
        const { users } = this.props;
        const { addBid, addLower } = this.props.itemsStore;
        if (
            this.props.itemsStore && 
            !this.props.itemsStore.downloadingItems && 
            this.props.itemsStore.availableBids.length === 0
        ) return (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                <ImageBackground 
                    style={{ alignSelf: 'stretch', height: 160 }} 
                    resizeMode='center'
                    source={{ uri: 'https://blog.hubspot.com/hubfs/Shrug-Emoji.jpg' }} 
                />
                <Text style={{ textAlign: 'center', fontSize: 50 }}>NO ITEMS</Text>
                <Text note style={{ textAlign: 'center', fontSize: 12 }}>Why not be the first?</Text>
            </View>
        )
        return (
            <ScrollView style={{ padding: 20 }}>
            {
                this.props.itemsStore &&
                this.props.itemsStore.downloadingItems &&
                <ActivityIndicator style={{marginTop: 20}}/>
            }
            {
                <Modal
                animationIn="slideInUp"
                isVisible={this.state.showModal}
                onBackdropPress={() => this.setState({ showModal: false })}
                >
                <View>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text style={{ textAlign: 'center' }}>Lower bid to: </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <TextInputMask
                                    type='money'
                                    options={{
                                        precision: 2,
                                        separator: '.',
                                        delimiter: ',',
                                        unit: '$',
                                        suffixUnit: ''
                                    }}
                                    value={this.state.bidValue}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, borderColor: 'green', borderWidth: 1}}
                                    onChangeText={this.handleLowerBid}
                                    autoFocus
                                />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button 
                                    buttonStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} 
                                    containerStyle={{ height: 50, width: '70%', margin: 10 }}
                                    title='CONFIRM' 
                                    transparent 
                                    onPress={() => {
                                        console.log('LOWER:', this.state.currentItem)
                                        console.log('BID:', this.state.bidValue)
                                        console.log('TIME: ', `${(new Date()).toString()}`)
                                        addLower({
                                            users,
                                            id: this.state.currentItem,
                                            time: `${(new Date()).toString()}`,
                                            price: this.state.bidValue
                                        })
                                        showMessage({
                                            message: 'LOWERED',
                                            type: 'default',
                                            backgroundColor: 'purple',
                                            icon: 'warning'
                                        })
                                        this.setState({ showModal: false })
                                    }}
                                ></Button>
                            </Left>
                            <Right>
                                <Button 
                                    buttonStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'red' }} 
                                    containerStyle={{ height: 50, width: '60%', margin: 10 }}
                                    title='CANCEL' 
                                    transparent 
                                    onPress={() => { 
                                        this.setState({ showModal: false })} 
                                    }
                                ></Button>
                            </Right>
                        </CardItem>
                    </Card>
                </View>
                </Modal>
            }
            {
                this.props.itemsStore &&
                this.props.itemsStore.list &&
                this.props.itemsStore.availableBids.map(item => (
                    <Card key={item.id}>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text>{item.seller}</Text>
                                    <Text note>{
                                        calculateDiscount(
                                            item.price, 
                                            new Date(item.time).getHours()
                                        )
                                    }% discount</Text>
                                </Body>
                            </Left>
                            {
                                !item.lowerPrice &&
                                <Right style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 2, borderColor: 'green' }}>
                                    <Text style={{ fontSize: 40 }}>${item.price}</Text>
                                </Right>
                            }
                            {
                                item.lowerPrice &&
                                <Right style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 2, borderColor: 'purple' }}>
                                    <Text style={{ fontSize: 40 }}>${item.lowerPrice}</Text>
                                </Right>
                            }
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={{ textAlign: 'center', fontSize: 30 }}>Time: {item.time}</Text>
                            </Body>
                        </CardItem>
                        <CardItem 
                            cardBody
                            style={{ height: 200, flex: 1, alignItems: 'center', justifyContent: 'center' }} 
                        >
                            <Icon 
                                name="coffee" 
                                size={200} 
                                color={timeToColor(new Date(item.time).getHours())} 
                            />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button 
                                    buttonStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} 
                                    containerStyle={{ height: 50, width: '40%', margin: 10 }}
                                    title='CALL' 
                                    transparent 
                                    onPress={() => {
                                        addBid({
                                            users,
                                            id: item.id,
                                            time: `${(new Date()).toString()}`
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
                                    title='LOWER' 
                                    transparent 
                                    onPress={() => { 
                                        this.setState({ showModal: true, currentItem: item.id })} 
                                    }
                                ></Button>
                            </Right>
                        </CardItem>
                    </Card>
                )) 
            }
            </ScrollView>
        )
    }
}
