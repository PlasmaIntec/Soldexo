/*
 * 3. src/screens/Login.js
 */

import React from 'react'
import {
  ScrollView,
  TextInput,
  Button,
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet // ADDED
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer, inject } from 'mobx-react'

import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

@inject('users') 
@observer
class Login extends React.Component {
  onLogin = (email, password) => { // MODIFIED
    this.props.users.login(email, password);
  }

  onPressRegister = (email, password, name) => { // MODIFIED
    this.props.users.register(email, password, name);
  }

  render() {
    return (
      <KeyboardAwareScrollView
        style={ styles.background } // MODIFIED
      >
        <Icon
          name="comments"
          size={60}
          color='#ccc'
          style={ styles.commentsIcon } // MODIFIED
        />
        <View
          style={ styles.topText } // MODIFIED
        >
          <Text>- please, login to continue -</Text>
        </View>
        <LoginForm
          onPress={this.onLogin} // MODIFIED
          busy={this.props.users.loggingIn}
          loggingError={this.props.users.loggingError}
        />
        <View
          style={ styles.bottomText } // MODIFIED
        >
          <Text>- or register -</Text>
        </View>
        <RegistrationForm
          onPress={this.onPressRegister} // MODIFIED
          busy={this.props.users.registering}
          registeringError={this.props.users.registeringError}
        />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({ // ADDED
  background: {
    padding: 20, 
    marginTop: 20, 
    backgroundColor: '#eee'
  },
  commentsIcon: {
    alignSelf: 'center',
    paddingBottom: 20
  },
  topText: {
    alignItems: 'center', 
    marginBottom: 20
  },
  bottomText: {
    alignItems: 'center',
    marginTop: 20, 
    marginBottom: 20
  }
})

export default Login;