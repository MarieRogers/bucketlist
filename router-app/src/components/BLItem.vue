<template>
    <div class="blitem">
        <br><br>
        <div>
            <b-card-group deck
                          class="mb-3">
                <b-card class="card mx-auto"
                        v-if="!this.edit"
                        :title="title"
                        :sub-title="description"
                        :img-src="image"
                        :img-alt="title"
                        :border-variant="completed"
                        img-top
                        >
                    <h6>{{location}}</h6>
                    <h6>{{date}}</h6>
                    <h6>{{category}}</h6>
                    <b-btn class="btn" id="completebtn" @click="markCompleted(code, completed, users)" variant="success">Mark as Completed!</b-btn>
                    <b-btn v-b-modal.modal class="btn" variant="warning" @click="Editing">Edit</b-btn>
                    <b-btn class="btn" @click="DeleteItem(code)" variant="danger">Delete</b-btn>
                </b-card>
            </b-card-group>
        </div>
        <div>
            <b-card-group deck
                          class="mb-3">
                <b-card class="card mx-auto" 
                        id="modal1" 
                        @submit="onSubmit" 
                        @reset="Editing" 
                        v-if="this.edit" 
                        title="Edit Bucket List Item"
                        :sub-title="title">

                    <b-form @submit.prevent="onSubmit(code, image)" @reset="onReset" v-if="show"> 
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
                                          :value="title"
                                          required
                                          >
                            </b-form-input>
                        </b-form-group>
                        <b-form-group id="location"
                                      label="Edit Location:"
                                      label-for="autocomplete">
                            <gmap-autocomplete 
                                               class="form-control"
                                               id="autocomplete"
                                               v-model="form.location"
                                               :value="location"
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
                                          :value="description">
                            </b-form-input>
                        </b-form-group>
                        <b-form-group id="date"
                                      label="Date:"
                                      label-for="dateInput">
                            <b-form-input id="dateInput"
                                          type="date"
                                          v-model="form.date"
                                          :value="date">
                            </b-form-input>
                        </b-form-group>
                        <b-form-group id="category"
                                      label="Category:"
                                      label-for="categoryInput">
                            <b-form-select id="categoryInput"
                                           v-model="form.selected" 
                                           :value="category"
                                           :options="options">
                            </b-form-select>
                        </b-form-group>
                        <b-form-radio-group id="radios1" v-model="form.selected2" :options="options2" name="radioOpenions">
                        </b-form-radio-group>
                        <b-form-radio-group id="radios2" v-model="form.private" :options="options3" name="radioOpenions2">
                        </b-form-radio-group>
                        <br>
                        <b-button type="submit" variant="primary">Save Changes</b-button>
                        <b-button type="reset" variant="danger">Cancel</b-button>
                    </b-form>
                </b-card>
            </b-card-group>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'BLItem',
        props: ['title', 'description', 'image', 'date', 'category', 'location', 'completed', 'code', 'edit', 'private'],
        data() {
            return {
                editing: this.edit,
                users: {},
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
                        value: 'Action',
                        text: 'Action'
                    },
                    {
                        value: 'Tourist Destination',
                        text: 'Tourist Destination'
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
                        value: 'Popular',
                        text: 'Popular'
                    },

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
                    selected: this.category,
                    selected2: this.completed,
                    name: this.title,
                    location: this.location,
                    description: this.description,
                    date: this.date,
                    photoURL: this.image,
                    private: this.private
                },
                show: true,
                latLng: {
                    location: '',
                    lat: 1,
                    lng: 1
                }
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
            //editing on
            Editing: function() {
                this.$emit('editing');
            },
            //mark completed with a green border
            markCompleted: function(code, completed, users) {
                //                console.log(completed)
                var user = firebase.auth().currentUser;
                this.$firebaseRefs.users.child(user.uid).child('items').child(code).update({completed: 'success'});
            },
            //delete item from bucket list
            DeleteItem: function(code) {
                var user = firebase.auth().currentUser;

                this.$firebaseRefs.users.child(user.uid).child('items').child(code).remove();
            },
            //submits edits to bucket list item
            onSubmit: function(code, image) {
                //                this.preventDefault();
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
                        //                        console.log('here')
                        //                        console.log(code)
                        enter.child(user.uid).child('items').child(code).update({
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

                    enter.child(user.uid).child('items').child(code).update({
                        category: this.form.selected,
                        name: this.form.name,
                        location: this.latLng.location,
                        lat: this.latLng.lat,
                        lng: this.latLng.lng,
                        description: this.form.description,
                        date: this.form.date,
                        photoURL : image,
                        completed: this.form.selected2,
                        editing: false,
                        private: this.form.private
                    });
                }

                this.$emit('editing');
            },
            //close edit without saving changes
            onReset (evt) {
                this.$emit('editing');
                this.$router.replace('/bucketlist');
            },
            //set lat long from location
            setPlace(place) {
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
    #completebtn {
        background: green;
    }
    .card {
        max-width: 50%;
        border: solid white 5px;
        border-radius: 8px;
    }
    .btn {
        font-weight: bold;
    }

</style>