<template>
  <div class="auth-page">
    <div class="auth-page__logo">

    </div>

    <div class="auth-page__card">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth-warpper',
  beforeRouteEnter(to, from, next) {
    document.body.classList.add('page-auth');
    next();
  },
  beforeRouteLeave(to, from, next) {
    document.body.classList.remove('page-auth');
    next();
  },
};
</script>

<style>
body.page-auth{
  background: red;
}

.auth-page{
  width: 600px;

  &__logo{

  }

  &__card{
    background: #fff;
    padding: 10px;
  }
}
</style>
