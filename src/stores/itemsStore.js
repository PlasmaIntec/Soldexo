// for dealing with uploading and retrieving auction items from firebase

import { observable, action, computed } from 'mobx';

import { firebaseApp } from '../firebase';

class Items {
    @observable list = [];
    @observable downloadingItems = true;

    getOwnItems(users) {
        return computed(() => this.list.filter(item => item.seller === users.name)).get();
    } 

    getOwnItemsNotificationsCount(users) {
        return computed(() => this.list.filter(item => item.seller === users.name && item.isForbidden).length).get();
    }

    getOwnBids(users) {
        return computed(() => this.list.filter(item => item.bidder === users.name)).get();
    } 

    @computed get availableBids() {
        return this.list.filter(item => !item.isForbidden);
    }
    
    @action addItem({ users, price, time }) {
        return new Promise((resolve, reject) => {
            firebaseApp.database().ref(`/items`).push({
                seller: users.name,
                price,
                time: time.toString()
            })
            .then(resolve)
        })
    }

    @action addLower({ users, id, time, price }) {
        return new Promise((resolve, reject) => {
            firebaseApp.database().ref(`/items/${id}`).update({
                lowerer: users.name,
                lowerTime: time,
                lowerPrice: price
            })
            .then(resolve)
        })
    }

    @action addBid({ users, id, time }) {
        return new Promise((resolve, reject) => {
            firebaseApp.database().ref(`/items/${id}`).update({
                bidder: users.name,
                buyer: users.name,
                bidTime: time,
                isForbidden: true
            })
            .then(resolve)
        })
    }

    @action confirmLower({ id, time, confirm, buyer }) {
        return new Promise((resolve, reject) => {
            firebaseApp.database().ref(`/items/${id}`).update({
                lowerConfirmed: true,
                lowerAccepted: confirm,
                lowerConfirmTime: time,
                buyer: confirm ? buyer : null
            })
            .then(resolve)
        })
    }

    constructor() {
        this.bindtoFirebase();
    }

    bindtoFirebase() {
        this.downloadingItems = true;
        firebaseApp.database().ref('/items').on('value', (snapshot) => {
            this.downloadingItems = false;            
            const itemsObj = snapshot.val();
            this.list = [];
            for (let id in itemsObj) {
                this.list.push({
                    id,
                    ...itemsObj[id]
                })
            }
        })
    }
}

export default new Items();