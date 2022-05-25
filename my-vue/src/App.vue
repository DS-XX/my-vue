<template>
  <div id="app">
    <DefaultLayout>
      <template v-slot:main-content>
        <router-view/>
      </template>
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from './components/DefaultLayout'

export default {
  name: 'App',
  components: {
    DefaultLayout
  }
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
</style>
