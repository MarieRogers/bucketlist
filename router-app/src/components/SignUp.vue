<template>
    <div id="signup">
        <b-container>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <h1>Sign Up</h1>
                <b-form-group id="name"
                              label="Your Name:"
                              label-for="nameInput">
                    <b-form-input id="nameInput"
                                  type="text"
                                  v-model="form.name"
                                  required
                                  placeholder="Enter name">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="email"
                              label="Email address:"
                              label-for="emailInput"
                              description="We'll never share your email with anyone else.">
                    <b-form-input id="emailInput"
                                  type="email"
                                  v-model="form.email"
                                  required
                                  placeholder="Enter email">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="password"
                              label="Your Password:"
                              label-for="passwordInput">
                    <b-form-input id="passwordInput"
                                  type="password"
                                  v-model="form.password"
                                  required
                                  placeholder="Enter password">
                    </b-form-input>
                </b-form-group>
                <h5>Already a member? <router-link to="/signin" id="signuplink">Sign In</router-link><br>or browse suggested bucket list items as a <router-link to="/guest" id="guestlink">Guest</router-link></h5>
                <b-button id="btn1" type="submit" variant="primary">Submit</b-button>
                <b-button id="btn2" type="reset" variant="danger">Reset</b-button>
            </b-form>
        </b-container>
    </div>
</template>

<script scoped>
    import firebase from 'firebase';
    import {db} from '../firebase';

    export default {
        data () {
            return {
                users: {},
                form: {
                    email: '',
                    name: '',
                    password: '',
                    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
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
            }
        },
        methods: {
            //signs up a new user!
            onSubmit (evt) {
                evt.preventDefault();
                firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password).then(
                    (user) => {
                        this.$firebaseRefs.users.child(user.uid).set({
                            displayName: this.form.name,
                            role: 'user',
                            numAccess: 1
                        });
                        this.$router.replace('/home');
                        return user.updateProfile({
                            displayName: this.form.name,
                            photoURL: this.form.photoURL,
                        });
                    },
                    (err) => {
                        alert('Oops. ' +err.message);
                    });
            },
            //resets form to blank
            onReset (evt) {
                evt.preventDefault();
                /* Reset our form values */
                this.form.email = '';
                this.form.name = '';
                this.form.password = '';
                /* Trick to reset/clear native browser form validation state */
                this.show = false;
                this.$nextTick(() => { this.show = true; });
            }
        }
    }
</script>

<style scoped>
    #btn1, 
    #btn2 {
        font-weight: 800;
    }
    #btn1 {
        background-color: blue;
    }
    #signuplink,
    #guestlink {
        color: blue;
        font-weight: bold;
    }
    #signup {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 0 auto 30px;
        margin-top: 10%;
        box-shadow: 5px 8px lightgray;
    }

</style>