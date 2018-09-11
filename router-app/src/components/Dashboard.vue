<template>
    <div id="dashboard">
        <h1 id="dashtitle">Dashboard</h1>
        <router-link to="/home"><button id="homebtn">Home</button></router-link>
        <router-link to="/profile"><button id="profilebtn">Profile</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <br><br>
        <div
             v-for="user in users">
            <b-card class="card mx-auto"
                    :title="user.displayName"

                    >
                <h5>Role: {{user.role}}</h5>
                <h6>Number of times visiting site: {{user.numAccess}}</h6>
            </b-card>
            <br>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'Dashboard',
        data() {
            return {
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
            //log user out
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin');
                });
            },
        }
    }
</script>

<style scoped>
    .card {
        max-width: 50%;
        border: solid white 5px;
        border-radius: 8px;
    }
    #dashtitle {
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
    #logoutbtn:hover,
    #profilebtn:hover,
    #homebtn:hover,
    #bucketlistbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
    #tabs {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 0 auto 30px;
        box-shadow: 5px 8px lightgray;
    }
    .user {
        background: white;
    }
</style>
