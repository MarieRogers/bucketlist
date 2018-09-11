<template>
    <div id="start">
        <h1 id="title">EXPLORE SAN FRANCISCO</h1>
        <h2 id="subtitle">BUCKET LIST</h2>
        <router-link to="/signup"><button id="signupbtn">Sign Up</button></router-link>
        <router-link to="/signin"><button id="signinbtn">Sign In</button></router-link>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'Start',
    }
</script>

<style scoped>
    #title {
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        font-weight: bold;
        font-size: 90pt; 
        color: white;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    #signupbtn,
    #signinbtn {
        background-color: Transparent;
        background-repeat:no-repeat;
        font-size: 30pt;
        color: white;
        border: solid white 3px;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        margin: 70px;
        margin-top: 10px;
        font-weight: bold;
        border-radius: 8px;
    }
    #signupbtn:hover,
    #signinbtn:hover {
        color: lightgray;
        border-color: lightgray;
    }
    #subtitle {
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        margin-top: 0;
        padding-top: 0;
        font-weight: bold;
        font-size: 50pt; 
        color: white;
    }


</style>
