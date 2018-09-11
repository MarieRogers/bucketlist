<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'App',
    }
</script>

<style>

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    body {
        background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(./assets/images/DavidYu3.jpg);

        /*      background-image: url(./assets/images/DavidYu3.jpg);*/
        /*      background-color: black;*/
        /*    background: linear-gradient(to right, #0000ff, darkblue);*/
    }
</style>

