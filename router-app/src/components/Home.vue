<template>
    <div id="home">
        <h1 id="hometitle">EXPLORE SAN FRANCISCO</h1>
        <br>
        <h2 id="homesubtitle">BUCKET LIST</h2>
        <br><br>
        <router-link to="/bucketlist"><button id="bucketlistbtn">Bucket List</button></router-link>
        <router-link to="/map"><button id="mapbtn">Map</button></router-link>
        <router-link to="/suggestions"><button id="suggestionsbtn">Suggestions</button></router-link>
        <router-link v-if="CheckPriv(users)" to="/dash"><button id="dashbtn">Dashboard</button></router-link>  
        <router-link to="/profile"><button id="profilebtn">Profile</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <router-view></router-view>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'Home',
        data() {
            return {
                role: '',
                users: {}
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
            //check if admin vs user (show dash button if admin)
            CheckPriv: function(users) {
                for(var user of users) {
                    if(user['.key']==firebase.auth().currentUser.uid) {
                        if(user.role == 'admin') {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            },
            //log out of user
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin');
                });
            }
        }
    }
</script>

<style scoped>
    #hometitle {
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        font-weight: bold;
        font-size: 90pt; 
        color: white;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    #bucketlistbtn,
    #suggestionsbtn,
    #mapbtn,
    #dashbtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 30pt;
        color: white;
        border: solid white 3px;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        margin: 20px;
        margin-top: 10px;
        font-weight: bold;
        border-radius: 8px;
    }
    #bucketlistbtn:hover,
    #suggestionsbtn:hover,
    #logoutbtn:hover,
    #profilebtn:hover,
    #mapbtn:hover,
    #dashbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
    #homesubtitle {
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        margin-top: 0;
        padding-top: 0;
        font-weight: bold;
        font-size: 50pt; 
        color: white;
    }
    #logoutbtn,
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
        /*    font-weight: bold;*/
        border-radius: 8px;
        position:absolute;
        top:0;
        right:0;
    }
    #profilebtn {
        right:100px;
    }


</style>
