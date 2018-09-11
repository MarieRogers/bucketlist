<template>
    <div id="suggestions">
        <h1 id="sugtitle">SUGGESTIONS</h1>
        <router-link to="/home"><button id="homebtn">Home</button></router-link>
        <router-link to="/profile"><button id="profilebtn">Profile</button></router-link>
        <button id="logoutbtn" v-on:click="logout">Logout</button>
        <button id="databtn" v-on:click="exportData">Export Data</button>
        <router-link to="/bucketlist"><button id="bucketlistbtn">Bucket List</button></router-link>
        <br><br>
        <div id="tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="POPULAR" active>
                        <Popular
                                 v-for="(pop, index) in Popular(suggestions)"
                                 :key="index"
                                 :name="pop.name"
                                 :location="pop.location"
                                 :image="pop.photoURL"
                                 :description="pop.description"
                                 :lat="pop.lat"
                                 :lng="pop.lng"
                                 :date="pop.date"
                                 completed=""
                                 :private="pop.private"
                                 :editing="pop.editing">
                        </Popular>
                    </b-tab>
                    <b-tab title="RESTAURANTS">
                        <Element
                                 v-for="(rest, index) in this.restaurants"
                                 :key="rest.id"
                                 :name="rest.name"
                                 :location="rest.vicinity"
                                 :image="rest"
                                 :rating="rest.rating"
                                 :id="rest.id"
                                 :lat="rest.geometry.location.lat"
                                 :lng="rest.geometry.location.lng"
                                 type="Restaurant"
                                 >
                        </Element>
                    </b-tab>
                    <b-tab title="MUSEUMS">
                        <Element
                                 v-for="(mus, index) in this.museums"
                                 :key="mus.id"
                                 :name="mus.name"
                                 :location="mus.vicinity"
                                 :image="mus"
                                 :id="mus.id"
                                 :rating="mus.rating"
                                 :lat="mus.geometry.location.lat"
                                 :lng="mus.geometry.location.lng"
                                 type="Museum"
                                 >
                        </Element>
                    </b-tab>
                    <b-tab title="PARKS">
                        <Element
                                 v-for="(park, index) in this.parks"
                                 :key="park.id"
                                 :name="park.name"
                                 :location="park.vicinity"
                                 :image="park"
                                 :id="park.id"
                                 :rating="park.rating"
                                 :lat="park.geometry.location.lat"
                                 :lng="park.geometry.location.lng"
                                 type="Park"
                                 >
                        </Element>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';
    import Element from './Element';
    import Popular from './Popular';
    import { MAP_KEY } from '../secrets';

    export default {
        name: 'Suggestions',
        components: {
            Popular,
            Element
        },
        data() {
            return {
                restaurants: {},
                museums: {},
                suggestions: {},
                popular: {},
                parks: {},
                popJSON: []
            };
        },
        firebase: {
            suggestions: {
                source: db.ref('suggestions'),
                // Optional, allows you to handle any errors.
                cancelCallback(err) {
                    console.error(err);
                }
            }
        },
        mounted() {
            var key = MAP_KEY;
            const proxyURL = "https://cors-anywhere.herokuapp.com/";
            //Restaurants
            var mainRest = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.7749,-122.4194&radius=1500&type=restaurant&key=';
            var urlRest = mainRest + key;
            fetch(proxyURL + urlRest)
                .then(response => response.json())
                .then(contents => { 
                //                console.log(contents.results) 
                this.restaurants = Object.values(contents.results);
                this.restaurantsJSON = JSON.stringify(this.restaurants);

                //            console.log(this.restaurants[0].photos[0].html_attributions[0])
            })
                .catch(() => console.log("Access to " + urlRest + " is still blocked."));

            //Museums
            var mainMus = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.7749,-122.4194&radius=1500&type=museum&key=';
            var urlMus = mainMus + key;
            fetch(proxyURL + urlMus)
                .then(response => response.json())
                .then(contents => { 
                //                console.log(contents.results) 
                this.museums = Object.values(contents.results);
                this.museumsJSON = JSON.stringify(this.museums);
                //                console.log(museumsJSON);

            })
                .catch(() => console.log("Access to " + urlMus + " is still blocked."));

            //Parks
            var mainPark = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.7749,-122.4194&radius=1500&type=park&key=';
            var urlPark = mainPark + key;
            fetch(proxyURL + urlPark)
                .then(response => response.json())
                .then(contents => { 
                //                console.log(contents.results) 
                this.parks = Object.values(contents.results);
                this.parksJSON = JSON.stringify(this.parks);
                //                console.log(parksJSON);

            })
                .catch(() => console.log("Access to " + urlPark + " is still blocked."));
        },
        methods: {
            //log user out
            logout: function() {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('/signin');
                });
            },
            //provide suggestions to popular items
            Popular: function(suggestions) {
                //                console.log(suggestions.length)
                if(suggestions.length > 10) {
                    var currentdate = new Date();
                    var min = currentdate.getTime();
                    for(var x of suggestions) {
                        //                    console.log(x['.key'])
                        if(x['.key'] < min) {
                            min = x['.key'];
                        }

                    }
                    //                    console.log(min)
                    this.$firebaseRefs.suggestions.child(min).remove();
                }
                else {
                    var array = Object.values(suggestions);
                    this.popJSON = array;
                    //                    console.log(popJSON);
                    return array;
                }
            },
            exportData()  {
                var myWindow = window.open("../data.html", "data");
                myWindow.document.write("RESTAURANTS DATA");
                myWindow.document.write(JSON.stringify(this.restaurants));
                myWindow.document.write("MUSEUMS DATA");
                myWindow.document.write(JSON.stringify(this.museums));
                myWindow.document.write("PARKS DATA");
                myWindow.document.write(JSON.stringify(this.parks));
                myWindow.document.write("POPULAR DATA");
                myWindow.document.write(JSON.stringify(this.popJSON));
            }
        }
    }
</script>

<style scoped>
    #sugtitle {
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
    #bucketlistbtn {
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
        position: absolute;
        top: 0;
        left: 0;
    }
    #logoutbtn,
    #homebtn,
    #profilebtn,
    #databtn {
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
    #profilebtn {
        right:100px;
    }
    #homebtn {
        right:194px;
    }
    #databtn {
        right:285px;
    }
    #logoutbtn:hover,
    #profilebtn:hover,
    #homebtn:hover,
    #bucketlistbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
    #tabs {
        max-width: 50%;
        padding: 20px;
        font-weight: bold;
        background-color: white;
        margin: 0 auto 30px;
        box-shadow: 5px 8px lightgray;
    }
</style>
