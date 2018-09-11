import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import StartScreen from '@/components/StartScreen'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import Home from '@/components/Home'
import BucketList from '@/components/BucketList'
import Suggestions from '@/components/Suggestions'
import Profile from '@/components/Profile'
import EditProfile from '@/components/EditProfile'
import Map from '@/components/Map'
import AddBL from '@/components/AddBL'
import Dashboard from '@/components/Dashboard'
import Guest from '@/components/Guest'


Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            name: 'StartScreen',
            component: StartScreen,
        },
        {
            path: '/signin',
            name: 'SignIn',
            component: SignIn,
        },
        {
            path: '/guest',
            name: 'Guest',
            component: Guest,
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: SignUp,
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/bucketlist',
            name: 'BucketList',
            component: BucketList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/suggestions',
            name: 'Suggestions',
            component: Suggestions,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/editprof',
            name: 'EditProfile',
            component: EditProfile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/map',
            name: 'Map',
            component: Map,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/addbl',
            name: 'AddBL',
            component: AddBL,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/dash',
            name: 'Dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        }
    ]
})

router.beforeEach((to, from , next) => {
    let currentUser = firebase.auth().currentUser;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(requiresAuth && !currentUser) next('signin');
    else if(!requiresAuth && currentUser) next('home');
    else next();
})

export default router;