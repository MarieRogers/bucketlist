// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import App from './App';
import router from './router';
import { MAP_KEY } from './secrets';
import * as VueGoogleMaps from 'vue2-google-maps';
import firebase from 'firebase';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './firebase';

Vue.use(BootstrapVue);
Vue.use(VueFire);
Vue.use(VueGoogleMaps, {
    load: {
        key: MAP_KEY,
        libraries: 'places'
    }
});


Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
    if(!app) {
        app = new Vue({
            el: '#app',
            router,
            components: { App },
            template: '<App/>'
        });
    }
});

