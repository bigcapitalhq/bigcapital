<template>
  <div class="login">
    <h2 class="page-auth__content-title">
      {{ $t('sign_in') }}
      <small>{{ $t('with_your_account') }}</small>
    </h2>

    <el-alert :active="isCredentialError" :type="'error'">
      {{ $t('email_password_do_not_match') }}
    </el-alert>

    <el-alert :isActive="isInactiveError" :type="'error'">
      {{ $t('the_account_suspended_please_contact') }}
    </el-alert>

    <el-alert :isActive="isResetPasswordSuccess" type="success">
      {{ $t('your_password_has_been_changed') }}
    </el-alert>

    <el-form ref="form" class="form-container">
      <el-form-item :label="$t('username_password')" prop="title">
        <el-input v-model="form.crediential" :maxlength="100" name="name"  required />
      </el-form-item>

      <el-form-item :label="$t('password')">
        <el-input v-model="form.password" name="password" />
      </el-form-item>

      <el-button type="primary">{{ $t('login') }}</el-button>
    </el-form>

    <div class="form-note">
      <div class="forget-password">
        <router-link :to="{name: 'forgetPassword'}">{{ $t('forget_password') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const STATE = {
  USER_NOT_ACTIVE: 1,
};

export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    isCredentialError() {
      return false;
    },
    isInactiveError() {
      return false;
    },
    isResetPasswordSuccess() {
      return false;
    },
  },
  methods: {
    ...mapActions(['login']),

    /**
     * Handle the submitting the login form.
     */
    onSubmit() {
      const form = {};

      this.login({ form }).then(() => {
        this.$route.push({ name: 'dashboard.home' });
      }).catch((error) => {
        const { response } = error;
        const { data } = response;

        if (data.error.type === 'USER_NOT_ACTIVE') {
          this.current_state = STATE.USER_NOT_ACTIVE;
        }
      });
    },
  },
};
</script>
