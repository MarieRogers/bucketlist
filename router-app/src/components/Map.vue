<template>
    <div id="map">
        <h1 id="maptitle">MAP</h1>
        <router-link to="/home"><button id="homebtn">Home</button></router-link>
        <router-link to="/profile"><button id="profilebtn">Profile</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <gmap-map
                  id="gmap"
                  :center="center"
                  :zoom="12"
                  >
            <gmap-marker
                         v-for="(m, index) in this.Markers(users)"
                         :key="index"
                         :position="{ lat: m[5], lng: m[6]}"
                         :title="m[8]"
                         :clickable="true"
                         :draggable="false"
                         @click="center = m.position"
                         ></gmap-marker>
        </gmap-map>
        <router-view></router-view>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'Map',
        data () {
            return {
                users: {},
                center: {
                    lat: 37.7749,
                    lng: -122.4194
                },
                markers: [
                    //                {
                    //                    position: { lat: 35.99, lng: -78.89}, // Durham, NC
                    //                },
                ],
            }
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
            //adds a marker to the map
            addMarker (latitude, longitude) {
                this.markers.push({
                    position: { lat: latitude, lng: longitude }
                });
            },
            //log out of user
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin')
                });
            },
            //builds the marker array
            Markers: function(users) {
                var array = [];
                for(var user of users) {
                    if(user['.key']==firebase.auth().currentUser.uid) {
                        for(var key in user) {
                            if(key=='items') {
                                for(var k in user[key]) {
                                    var o = Object.values(user[key][k]);
                                    o.push(k);
                                    array.push(o);
                                    //                                console.log(o)
                                }
                            }
                        }
                    }
                }
                return array;
            },
        }
    }

</script>

<style scoped>
    #gmap {
        max-width: 80%;
        height: 480px;;
        margin: auto;
        border: solid white 10px;
    }
    #maptitle {
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
        /*    font-weight: bold;*/
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
    #homebtn:hover {
        color: lightgray;
        border-color: lightgray;
    }

</style>