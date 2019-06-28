import React from 'react';
import { Button } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextInputMask } from 'react-native-masked-text'
import { showMessage, hideMessage } from 'react-native-flash-message';

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

// TODO: REFORMAT SCREEN
@inject('itemsStore', 'users')
@observer
export default class SellScreen extends React.Component {
    constructor(props) {
    super(props);
        this.state = {
            isDateTimePickerVisible: false,
            chosenTime: null,
            chosenMoney: null,
            canSell: false
        };
    }
   
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
   
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
   
    handleDatePicked = chosenTime => {
        this.hideDateTimePicker();
        this.setState({chosenTime}, () => {
            this.updateCanSell();
        });
    };

    handleMoneyPicked = (chosenMoney) => {
        this.setState({
            chosenMoney: chosenMoney.slice(1)
        }, () => {
            this.updateCanSell();
        });
    }

    updateCanSell = () => {
        const { chosenTime, chosenMoney } = this.state;
        if (chosenTime && chosenMoney) {
            this.setState({ canSell: true });
        }
    }

    handleSell = () => {
        const { chosenTime, chosenMoney } = this.state;
        const { users } = this.props;
        const { addItem } = this.props.itemsStore;
        const payload = {
            users,
            price: chosenMoney,
            time: chosenTime
        }
        addItem(payload);
        this.setState({
            chosenTime: null,
            chosenMoney: null,
            canSell: false
        })
        showMessage({
            message: 'Your Item is now Bidding',
            type: 'success',
            icon: 'auto'
        })
        this.props.navigation.navigate('Buy');
        console.log('PAYLOAD: ', payload); // DELETE
    }
   
    render() {
        const { chosenTime, chosenMoney, canSell } = this.state;
        return (
            <>
                <TextInputMask
                    type='money'
                    options={{
                        precision: 2,
                        separator: '.',
                        delimiter: ',',
                        unit: '$',
                        suffixUnit: ''
                    }}
                    value={chosenMoney}
                    style={{ height: 40, borderColor: 'green', borderWidth: 1}}
                    onChangeText={this.handleMoneyPicked}
                    autoFocus
                />
                {
                    chosenMoney && 
                    <Text>{`You have chosen $${chosenMoney}`}</Text>
                }
                <Button title="Select Time" onPress={this.showDateTimePicker} />
                <DateTimePicker
                    mode='datetime'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
                {
                    chosenTime &&
                    <Text>{`You have chosen ${chosenTime}`}</Text> // TODO: FORMAT
                }
                <Button 
                    title="Sell"
                    style={{ margin: 20 }}
                    onPress={this.handleSell}
                    disabled={!canSell}
                />
            </>
        );
    }
}