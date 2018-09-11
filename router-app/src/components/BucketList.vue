<template>
    <div id="bucketlist">
        <h1 id="bltitle">BUCKET LIST</h1>
        <router-link to="/home"><button id="homebtn">Home</button></router-link>
        <router-link to="/profile"><button id="profilebtn">Profile</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <router-link to="/suggestions"><button id="suggestionsbtn">Suggestions</button></router-link>
        <br>
        <router-link to="/addbl"><button id="addblbtn">ADD+</button></router-link>
        <BLItem 
                v-for="(x, index) in this.itemsFunc(users)"
                :key="x[11]"
                :code="x[11]"
                :title="x[8]"
                :description="x[3]"
                :image="x[9]"
                :date="x[2]"
                :category="x[0]"
                :location="x[7]"
                :completed="x[1]"
                :edit="x[4]"
                :private="x[10]"
                v-on:editing="EditChange(x[11], x[4])"
                ></BLItem>
        <router-view></router-view>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';
    import BLItem from './BLItem';

    export default {
        name: 'BucketList',
        components: {
            BLItem
        },
        data() {
            return {
                users: {},
                border: ''
            };
        },
        firebase: {
            users: {
                source: db.ref('users'),
                // Optional, allows you to handle any errors.
                cancelCallback(err) {
                    console.error(err);
                }
            }
        },
        methods: {
            //editing a BLItem
            EditChange: function(code, edit) {
                var user = firebase.auth().currentUser;
                this.$firebaseRefs.users.child(user.uid).child('items').child(code).update({editing: !edit});
            },
            //log user out
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin');
                });
            },
            //loads from firebase
            itemsFunc: function(users) {
                var array = [];
                for(var user of users) {
                    if(user['.key']==firebase.auth().currentUser.uid) {
                        for(var key in user) {
                            if(key=='items') {
                                for(var k in user[key]) {
                                    var o = Object.values(user[key][k]);
                                    o.push(k);
                                    array.push(o);
                                }
                            }
                        }
                    }
                }
                //                console.log(array)
                return array;
            }
        }
    }
</script>

<style scoped>
    #bltitle {
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        /*    font-weight: bold;*/
        font-size: 90pt; 
        color: white;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    #addblbtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 40pt;
        color: white;
        border: solid white 3px;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        margin: 10px;
        font-weight: bold;
        border-radius: 8px;
        align-content: center;
    }
    #logoutbtn,
    #homebtn,
    #profilebtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 15pt;
        color: white;
        border: solid white 3px;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        margin: 10px;
        font-weight: bold;
        border-radius: 8px;
        position:absolute;
        top:0;
        right:0;
    }
    #homebtn {
        right:100px;
    }
    #profilebtn {
        right:190px;
    }
    #suggestionsbtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 15pt;
        color: white;
        border: solid white 3px;
        cursor:pointer;
        overflow: hidden;
        margin: 10px;
        font-weight: bold;
        border-radius: 8px;
        position:absolute;
        top:0;
        left:0;
    }
    #logoutbtn:hover,
    #profilebtn:hover,
    #homebtn:hover,
    #addblbtn:hover,
    #suggestionsbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
</style>
