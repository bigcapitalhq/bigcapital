<template>
  <div class="page-auth page-auth--login">
    <div class="page-auth__content-side">
      <div class="page-auth__content-header">

      </div>

      <div class="page-auth__content-form">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>

      <AuthFooter></AuthFooter>
    </div>

    <AuthMedia></AuthMedia>
  </div>
</template>

<script>
import AuthMedia from '@/pages/Auth/AuthMedia.vue';
import AuthFooter from '@/pages/Auth/AuthFooter.vue';

export default {
  name: 'auth-container',
  components: {
    AuthMedia,
    AuthFooter,
  },
};
</script>

<style lang="scss">
.page-auth{
  display: flex;
  min-height: 100vh;

  &__content-side{
    background: #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;

    // @include media-breakpoint-up('lg'){
      width: 62%;
    // }

    .remember-forget-wrapper{
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      padding-top: 5px;
    }

    .form-note{
      margin-top: 25px;
    }

    .btn-primary{
      padding-top: 7px;
      padding-bottom: 7px;
      font-weight: 600;
      font-size: 15px;
    }
  }

  &__content{

    &-header{
      max-width: 440px;
      width: 100%;
      padding: 0 30px;
      margin: 0 auto;
      padding-top: 40px;
      padding-bottom: 10px;

      // @include media-breakpoint-down('xs'){
      //   padding-top: 25px;
      //   padding-left: 25px;
      //   padding-right: 25px;
      // }

      .icon-logo{
        // @include media-breakpoint-down('xs'){
        //     width: 140px;
        // }
      }
    }

    &-title{
      font-size: 42px;
      font-weight: 300;
      letter-spacing: -0.025em;
      color: #253992;
      line-height: 1.2;
      padding-bottom: 23px;
      font-size: 2.4em;

      // @include media-breakpoint-down('xs'){
      //   font-size: 2.2rem;
      // }

      small{
        font-size: 0.46em;
        display: block;
        font-weight: 400;
        color: #495463;
        letter-spacing: normal;
        margin-top: 10px;
        line-height: 1.6;
      }

      .text-success{
        color: #00d285;
        font-size: 0.41em;
        font-weight: 400;
      }
    }


    &-form{
      width: 440px;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding: 40px 30px 50px;

      // @include media-breakpoint-down('xs'){
      //   padding-left: 25px;
      //   padding-right: 25px;
      // }
    }

    &-footer{
      margin: 0 auto;
      width: 440px;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding: 0 30px;
      padding-bottom: 25px;

      .footer-links{
        margin: 0;
        padding: 0;
        list-style: none;

        li{
          padding: 2px 15px;
          font-size: 13px;
          color: #758698;
          display: inline-block;

          &:first-child{
            padding-left: 0;
          }

          &:last-child{
            padding-right: 0;
          }
        }

        a{
          text-decoration: none;
          color: inherit;

          &:hover{
            color: #2c80ff;
          }
        }
      }
    }
  }

    /** Media Side **/
    &__media-side{
      display: flex;
      width: 38%;
      background-image: url('/images/cover.png');
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      background-position: 50% 0;

      // @include media-breakpoint-down('md'){
      //   width: 38%;
      // }

      // @include media-breakpoint-down('xs'){
      //   display: none;
      // }
    }

  &__media-overlay{
    position: absolute;
    background: #202141;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.65;
  }
}
</style>
