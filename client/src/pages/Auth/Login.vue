<template>
  <div class="login">
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
  methods: {
    ...mapActions(['login']),

    /**
     * Handle the submitting the login form.
     */
    onSubmit() {
      const form = {};

      this.login({ form }).then(() => {

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
