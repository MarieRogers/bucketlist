<template>
    <div id="addbl">
        <b-container>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show"> 
                <h1>New Bucket List Item</h1>
                <br>
                <b-form-group id="img" 
                              label="Upload a photo:"
                              label-for="files">
                    <b-form-file id="files" type="file" name="files[]" placeholder="Choose a file..."></b-form-file>
                    <!--          <div class="mt-3">Selected file: {{file && file.name}}</div>-->
                </b-form-group>
                <b-form-group id="name"
                              label="Name of Bucket List Item:"
                              label-for="nameInput">
                    <b-form-input id="nameInput"
                                  type="text"
                                  v-model="form.name"
                                  placeholder="Enter a title">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="location"
                              label="Location:"
                              label-for="autocomplete">
                    <gmap-autocomplete 
                                       class="form-control"
                                       id="autocomplete"
                                       v-model="form.location"
                                       @place_changed="setPlace"
                                       :options="{
                                                 bounds: {north: 38, south: 37, east: -121, west: -123},
                                                 strictBounds: true
                                                 }">
                    </gmap-autocomplete>
                </b-form-group>
                <b-form-group id="description"
                              label="Description:"
                              label-for="descriptionInput">
                    <b-form-input id="descriptionInput"
                                  type="text"
                                  v-model="form.description"
                                  placeholder="Enter a description">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="date"
                              label="Date:"
                              label-for="dateInput">
                    <b-form-input id="dateInput"
                                  type="date"
                                  v-model="form.date">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="category"
                              label="Category:"
                              label-for="categoryInput">
                    <b-form-select id="categoryInput"
                                   v-model="form.selected" 
                                   :options="options">
                    </b-form-select>
                </b-form-group>
                <b-form-radio-group id="radios1" v-model="form.selected2" :options="options2" name="radioOpenions">
                </b-form-radio-group>
                <b-form-radio-group id="radios2" v-model="form.private" :options="options3" name="radioOpenions2">
                </b-form-radio-group>
                <br>
                <b-button class="btn" type="submit" variant="primary">Add Item</b-button>
                <b-button class="btn" type="reset" variant="danger">Cancel</b-button>
            </b-form>
        </b-container>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'AddBL',
        data () {
            return {
                users: {},
                suggestions: {},
                options: [
                    {
                        value: null,
                        text: 'Please select an option..'
                    },
                    {
                        value: 'Event',
                        text: 'Event'
                    },
                    {
                        value: 'Restaurant',
                        text: 'Restaurant'
                    },
                    {
                        value: 'Museum',
                        text: 'Museum'
                    },
                    {
                        value: 'Park',
                        text: 'Park'
                    },
                    {
                        value: 'Action',
                        text: 'Action'
                    },
                    {
                        value: 'Tourist Destination',
                        text: 'Tourist Destination'
                    }
                ],
                options2: [
                    { text: 'Not Completed', value: '' },
                    { text: 'Completed', value: 'success' }
                ],
                options3: [
                    { text: 'Public', value: false },
                    { text: 'Private', value: true }
                ],
                form: {
                    selected: '',
                    selected2: '',
                    private: false,
                    name: '',
                    location: '',
                    description: '',
                    date: '',
                    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                },
                latLng: {
                    location: '',
                    lat: 0,
                    lng: 0
                },
                show: true
            };
        },
        firebase: {
            users: {
                source: db.ref('users'),
                // Optional, allows you to handle any errors.
                cancelCallback(err) {
                    console.error(err);
                }
            },
            suggestions: {
                source: db.ref('suggestions'),
                // Optional, allows you to handle any errors.
                cancelCallback(err) {
                    console.error(err);
                }
            }
        },
        methods: {
            //adds a bucket list item to the bucket list
            onSubmit (evt) {
                evt.preventDefault();
                var enter = this.$firebaseRefs.users;
                // get input element user used to select local image
                var input = document.getElementById('files');
                // have all fields in the form been completed
                if (input.files.length > 0) {
                    var file = input.files[0];
                    // get reference to a storage location and
                    firebase.storage().ref().child('blimages/' + file.name)
                        .put(file)
                        .then((snapshot) => {
                        var user = firebase.auth().currentUser;
                        enter.child(user.uid).child('items').push({
                            name: this.form.name,
                            description: this.form.description,
                            category: this.form.selected,
                            location: this.latLng.location,
                            date: this.form.date,
                            photoURL : snapshot.downloadURL,
                            completed: this.form.selected2,
                            lat: this.latLng.lat,
                            lng: this.latLng.lng,
                            editing: false,
                            private: this.form.private
                        });
                    });
                }
                else{
                    var user = firebase.auth().currentUser;
                    enter.child(user.uid).child('items').push({
                        category: this.form.selected,
                        name: this.form.name,
                        location: this.latLng.location,
                        lat: this.latLng.lat,
                        lng: this.latLng.lng,
                        description: this.form.description,
                        date: this.form.date,
                        photoURL : '',
                        completed: this.form.selected2,
                        editing: false,
                        private: this.form.private
                    });
                }
                //if the form is market private then it doesnt put it in the popular suggestions page
                if(this.form.private == false) {
                    var sugRef = this.$firebaseRefs.suggestions;
                    var currentdate = new Date();
                    if (input.files.length > 0) {
                        var file = input.files[0];
                        // get reference to a storage location and
                        firebase.storage().ref().child('blimages/' + file.name)
                            .put(file)
                            .then((snapshot) => {
                            sugRef.child(currentdate.getTime()).set({
                                category: this.form.selected,
                                name: this.form.name,
                                location: this.latLng.location,
                                lat: this.latLng.lat,
                                lng: this.latLng.lng,
                                description: this.form.description,
                                date: this.form.date,
                                photoURL : snapshot.downloadURL,
                                completed: this.form.selected2,
                                editing: false,
                                private: this.form.private
                            });

                        });
                    }
                    else{
                        sugRef.child(currentdate.getTime()).set({
                            category: this.form.selected,
                            name: this.form.name,
                            location: this.latLng.location,
                            lat: this.latLng.lat,
                            lng: this.latLng.lng,
                            description: this.form.description,
                            date: this.form.date,
                            photoURL : '',
                            completed: this.form.selected2,
                            editing: false,
                            private: this.form.private
                        });
                    }
                }
                this.$router.replace('/bucketlist');
            },
            //goes back to bucket list page without saving changes
            onReset(evt) {
                this.$router.replace('/bucketlist');
            },
            //sets the lat long from the location
            setPlace: function(place) {
                //                console.log(place)
                if(place.geometry) {
                    this.latLng = {
                        location: place.formatted_address,
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    };
                }
            }
        }
    }
</script>

<style scoped>

    #addbl {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 40px auto 20px;
        box-shadow: 5px 8px lightgray;
    }
    #blimg {
        height: 150px;
    }
    .btn {
        font-weight: bold;
    }
</style>