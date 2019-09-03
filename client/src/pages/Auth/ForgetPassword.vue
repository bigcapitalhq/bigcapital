<template>
  <div id="reset-password">
    <el-form ref="form" class="form-container">
      <el-form-item :label="$t('username_password')" prop="title">
        <el-input v-model="form.crediential" :maxlength="100" name="name"  required />
      </el-form-item>
    </el-form>

    <el-button type="primary">{{ $t('reset_password') }}</el-button>

    <div class="form-note">
      <router-link :to="{name: 'login'}">{{ $t('return_to_login') }}</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'forget-password',
  data() {
    return {
      form: {
        crediential: '',
      },
    };
  },
  methods: {
    ...mapActions(['login']),

    /**
     * Handle the submitting the reset password form.
     */
    onSubmit() {
      const form = {};

      this.sendResetPassword({ form }).then(() => {
        // console.log(response);
      }).catch(() => {
        // console.log(error);
      });
    },
  },
};
</script>
