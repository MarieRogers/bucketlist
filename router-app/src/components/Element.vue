<template>
    <div class="element">
        <br><br>
        <div>
            <b-card-group deck
                          class="mb-3">
                <b-card class="card mx-auto"
                        :title="name"
                        :img-src="img"
                        :img-alt="name"
                        :sub-title="type"
                        :border-variant="this.border"
                        >
                    <h6>{{location}}</h6>
                    <h6>Rating: {{rating}}</h6>
                    <b-btn class="btn" @click="AddItem(name, location, image, rating, lat, lng, type)" variant="success">Add to Bucket List</b-btn>
                </b-card>
            </b-card-group>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';
    import { MAP_KEY } from '../secrets';

    export default {
        name: 'Element',
        props: ['name', 'location', 'image', 'rating', 'id', 'lat', 'lng', 'type'],
        data() {
            return{
                users: {},
                img: '',
                border: '',
                descrip: ''
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
        mounted() {
            const key = MAP_KEY;
            //Element's photos from Google Photos API
            if(this.image.photos) {
                var first = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=';
                var imgid = this.image.photos[0].photo_reference;
                var url = first + imgid + '&key=' + key;        
                const proxyURL = 'https://cors-anywhere.herokuapp.com/'
                fetch(proxyURL + url)
                    .then(response => response.blob())
                    .then(blob => URL.createObjectURL(blob))
                    .then(url => {
                    //                console.log(`Image src is ${url}`)
                    this.img = url;
                })
                    .catch(err => console.error(err));
            }
        },
        methods: {
            //add item from suggestions to personal bucket list
            AddItem (name, location, image, rating, lat, lng, type) {
                var enter = this.$firebaseRefs.users;
                var user = firebase.auth().currentUser;

                if (user != null) {
                    enter.child(user.uid).child('items').push({
                        category: type,
                        name: name,
                        location: location,
                        lat: lat,
                        lng: lng,
                        description: 'Rating: '+rating,
                        date: '',
                        photoURL: '',
                        completed: '',
                        editing: false,
                        private: false
                    });
                    this.border = 'success';
                }
            }
        }
    }

</script>

<style scoped>
    .card {
        border-radius: 8px;
        max-width: 30em;
    }
    .btn {
        font-weight: bold;
        background: green;
    }

</style>