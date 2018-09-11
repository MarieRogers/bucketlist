<template>
    <div id="editprof">
        <b-container>
            <b-form @submit.prevent="onSubmit(users)" @reset="onReset" v-if="show"> 
                <h1 id="edittitle">Edit Profile</h1>
                <b-img id="prof" :src="this.form.photoURL" rounded="circle" alt="profile picture"></b-img>
                <br><br>
                <b-form-group id="img" 
                              label="Upload a different photo..."
                              label-for="files">
                    <b-form-file id="files" type="file" name="files[]" placeholder="Choose a file..."></b-form-file>
                </b-form-group>
                <b-form-group id="name"
                              label="Edit Name:"
                              label-for="nameInput">
                    <b-form-input id="nameInput"
                                  type="text"
                                  v-model="form.name"
                                  :value="form.name">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="email"
                              label="Edit Email address:"
                              label-for="emailInput">
                    <b-form-input id="emailInput"
                                  type="email"
                                  v-model="form.newEmail"
                                  :value="form.email">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="password"
                              label="New Password:"
                              label-for="passwordInput">
                    <b-form-input id="passwordInput"
                                  type="password"
                                  v-model="form.newPassword"
                                  :value="form.password">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="passwordc"
                              label="Confirm New Password:"
                              label-for="passwordInputC">
                    <b-form-input id="passwordInputC"
                                  type="password"
                                  :state="form.newPassword == form.newPasswordConfirm"
                                  v-model="form.newPasswordConfirm">
                    </b-form-input>
                </b-form-group>
                <b-button id="btn1" type="submit" variant="primary">Save Changes</b-button>
                <b-button type="reset" variant="danger">Cancel</b-button>
            </b-form>
        </b-container>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        name: 'EditProfile',
        created() {
            this.setProf();

        },
        data () {
            return {
                users: {},
                form: {
                    email: '',
                    name: '',
                    password: '',
                    newName: '',
                    newEmail: '',
                    newPassword: '',
                    newPasswordConfirm: '',
                    photoURL: ''
                },
                show: true
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
            //sets the local variables to whats the current user in order to prefil form
            setProf: function() {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    this.form.name = user.displayName;
                    this.form.email = user.email;
                    this.form.password = user.password;
                    this.form.photoURL = user.photoURL;
                }
            },
            //updates data in firebase based on changes from form
            onSubmit (users) {
                var user = firebase.auth().currentUser;
                //            var enter = this.$firebaseRefs.users;
                // get input element user used to select local image
                var input = document.getElementById('files');
                // have all fields in the form been completed
                if (input.files.length > 0) {
                    var file = input.files[0];
                    // get reference to a storage location and
                    firebase.storage().ref().child('userimages/' + file.name)
                        .put(file)
                        .then((snapshot) => {
                        user.updateProfile({
                            photoURL: snapshot.downloadURL
                        });
                        this.form.photoURL = snapshot.downloadURL;
                    });
                }
                if(this.form.email != this.form.newEmail) {
                    this.form.email = this.form.newEmail;
                    user.updateEmail(this.form.newEmail.trim()).then(function() {
                    }).catch(function(error) {
                        console.log(error.message);
                    });
                }
                user.updateProfile({displayName:this.form.name.trim()}).then(function() {
                }).catch(function(error) {
                    console.log(error.message);
                });
                var ref = this.$firebaseRefs.users;
                ref.child(user.uid).update({displayName: this.form.name});
                if(this.form.newPassword == this.form.newPasswordConfirm && this.form.newPassword != '') {
                    user.updatePassword(this.form.newPassword).then(function() {
                        // Update successful.
                    }).catch(function(error) {
                        alert(error.message);
                    });
                }
                this.$router.replace('/home');
            },
            //goes back to profile page without updating 
            onReset (evt) {
                this.$router.replace('/profile');
            }
        }
    }
</script>

<style scoped>
    #edittitle {
        font-size: 40pt;
        color: #2c3e50;
    }
    #editprof {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 0 auto 30px;
        box-shadow: 5px 8px lightgray;
    }
    #prof {
        max-height: 170px;
    }
    #btn1 {
        background: blue;
    }

</style>