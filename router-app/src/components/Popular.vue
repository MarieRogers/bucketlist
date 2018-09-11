<template>
    <div class="popular">
        <br><br>
        <div>
            <b-card-group deck
                          class="mb-3">
                <b-card class="card mx-auto"
                        :title="name"
                        :img-src="image"
                        :img-alt="name"
                        sub-title="Recently added by another user!"
                        :border-variant="this.border"
                        >
                    <h6>{{location}}</h6>
                    <h6>{{description}}</h6>
                    <b-btn class="btn" @click="AddItem(name, location, image, description, lat, lng)" variant="success">Add to Bucket List</b-btn>
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
        name: 'Popular',
        props: ['name', 'location', 'image', 'description', 'id', 'lat', 'lng'],
        data() {
            return{
                users: {},
                img: '',
                border: ''
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
            //add item from popular suggestions to personal bucket list
            AddItem (name, location, image, description, lat, lng) {
                var enter = this.$firebaseRefs.users;
                var user = firebase.auth().currentUser;

                if (user != null) {
                    enter.child(user.uid).child('items').push({
                        category: 'Popular',
                        name: name,
                        location: location,
                        lat: lat,
                        lng: lng,
                        description: description,
                        date: '',
                        photoURL: image,
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
    }
    .btn {
        font-weight: bold;
        background: green;
    }
</style>
