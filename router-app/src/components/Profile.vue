<template>
    <div id="profile">
        <h1 id="proftitle">Profile</h1>
        <router-link to="/home"><button id="homebtn">Home</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <div id="inner">
            <h1>{{this.name}}</h1>
            <h3>{{this.email}}</h3>
            <b-img id="prof" :src="this.photoURL" rounded="circle" alt="prof"></b-img>
            <br>
            <router-link to="/editprof"><button id="editprofbtn">Edit Profile</button></router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'Profile',
        created() {
            this.setProf();
        },
        data () {
            return {
                email: '',
                name: '',
                photoURL: ''
            };
        },
        methods: {
            //set values for current profile from firebase
            setProf: function() {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    this.name = user.displayName;
                    this.email = user.email;
                    this.photoURL = user.photoURL;
                }
            },
            //log user out
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin');
                });
            }

        }
    }
</script>

<style scoped>
    #inner {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 0 auto 30px;
        box-shadow: 5px 8px lightgray;
    }
    #proftitle {
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
    #prof {
        max-height: 170px;
    }
    #logoutbtn,
    #homebtn {
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
    #homebtn {
        right:100px;
    }
    #logoutbtn:hover,
    #homebtn:hover,
    #editprofbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
    #editprofbtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 15pt;
        color: #2c3e50;
        border: solid #2c3e50 3px;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        margin: 10px;
        /*    font-weight: bold;*/
        border-radius: 8px;
    }
</style>
