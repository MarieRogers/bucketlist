<template>
    <div id="signin">
        <b-container>
            <b-form @submit.prevent="onSubmit(users)" @reset="onReset" v-if="show">
                <h1>Sign In</h1>
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
                <h5>Not a member? <router-link to="/signup" id="signinlink">Sign Up</router-link><br>or browse suggested bucket list items as a <router-link to="/guest" id="guestlink">Guest</router-link></h5>

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
                    password: '',
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
            //signs in user
            onSubmit (users) {
                var ref = this.$firebaseRefs.users;
                firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then(
                    (user) => {
                        for(var u of users) {
                            if(u['.key']==user.uid) {
                                var num = u.numAccess;
                            }
                        }
                        ref.child(user.uid).update({
                            numAccess: num += 1
                        });
                        this.$router.replace('/home');
                    },
                    (err) => {
                        alert('Oops. '+err.message);
                    })
            },
            //resets inputs to blank
            onReset (evt) {
                evt.preventDefault();
                this.form.email = '';
                this.form.password = '';
                /* Trick to reset/clear native browser form validation state */
                this.show = false;
                this.$nextTick(() => { this.show = true });
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
    #signinlink,
    #guestlink {
        color: blue;
        font-weight: bold;
    }
    #signin {
        max-width: 60%;
        padding: 20px;
        background-color: white;
        margin: 0 auto 30px;
        margin-top: 15%;
        box-shadow: 5px 8px lightgray;
    }

</style>