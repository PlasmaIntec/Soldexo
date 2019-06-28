/*
 * 5. src/stores/users.js
 */

import {observable, computed, map, toJS, action} from 'mobx';
import chats from './chats'
import firebase from 'firebase';
import { firebaseApp } from '../firebase';

class Users {
  @observable id = null;
  @observable isLoggedIn = false;
  @observable name = null;
  @observable avatar = null;
  @observable loggingIn = false;
  @observable registering = false;
  @observable loggingError = null;
  @observable registeringError = null;

  @action login = function(email, password) {
    this.loggingIn = true;
    this.loggingError = null;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      this.loggingIn = false;
    })
    .catch((error) => {
      this.loggingIn = false;
      this.loggingError = error.message;
    });
  }

  @action logout = function() {
    firebase.auth().signOut();
    this.userBind.off(); // ADDED
    this.chatsBind.off(); // ADDED
  }

  @action register = function(email, password, name) {
    if(!name || name == '') {
      this.registering = false;
      this.registeringError = 'Name was not entered';
      return;
    }
    this.registering = true;
    this.registeringError = null;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      this.registering = false;
      firebaseApp.database().ref('/users/' + credential.user.uid).set({
        name: name
      });
    })
    .catch((error) => {
      this.registering = false;
      this.registeringError = error.message;
    });
  }

  searchUsers(name) {
    return new Promise(function(resolve) {
      firebaseApp.database().ref('/users/').once('value')
      .then(function(snapshot) {
        let foundUsers = [];
        const users = snapshot.val();
        for(var id in users) {
          if(users[id].name.toLowerCase().indexOf(name.toLowerCase()) !== -1) { // MODIFIED
            foundUsers.push({
              name: users[id].name,
              avatar: users[id].avatar,
              id
            });
          }
        }
        resolve(foundUsers);
      });
    });
  }

  constructor() {
    this.bindToFirebase();
  }

  bindToFirebase() {
    return firebase.auth().onAuthStateChanged((user) => {
      if(this.chatsBind && typeof this.chatsBind.off === 'function') this.chatsBind.off();
      if(this.userBind && typeof this.userBind.off === 'function') this.userBind.off();

      if (user) {
        this.id = user.uid;
        this.isLoggedIn = true;
        this.chatsBind = chats.bindToFirebase(user.uid);
        this.userBind = firebaseApp.database().ref('/users/' + this.id); // ADDED
        this.userBind.on('value', (snapshot) => { // MODIFIED
          const userObj = snapshot.val();
          if(!userObj) return;
          this.name = userObj.name;
          this.avatar = userObj.avatar;
        });
      } else {
        this.id = null;
        this.isLoggedIn = false;
        this.userBind = null;
        this.name = null;
        this.avatar = null;
      }
    });
  }
}

export default new Users();