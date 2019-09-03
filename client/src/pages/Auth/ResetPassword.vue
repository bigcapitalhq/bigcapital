
<template>
  <div class="reset-password" id="reset-password">
    <el-form ref="form" class="form-container">
      <el-form-item :label="$t('password')" prop="title">
        <el-input v-model="form.password" :maxlength="100" name="password" required />
      </el-form-item>

      <el-form-item :label="$t('confirm_password')">
        <el-input v-model="form.confirm_password" name="confirm_password" />
      </el-form-item>

      <el-button @click.prevent="onSubmit" type="primary">
        {{ $t('reset_the_password') }}
      </el-button>
      <el-link>{{ $t('forget_your_password') }}</el-link>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const STATE = {
  SUCCESS: 1,
  TOKEN_INVALID: 2,
};

export default {
  name: 'reset-password',
  data() {
    return {
      form: {
        password: '',
        confirm_password: '',
      },
    };
  },
  props: {
    token: {
      required: true,
      type: String,
    },
  },
  computed: {

    isSuccess() {
      return this.current_state === STATE.SUCCESS;
    },
    isTokenInvalid() {
      return this.current_state === STATE.TOKEN_INVALID;
    },
  },
  methods: {
    ...mapActions(['newPassword']),

    /**
     * Handle the submitting the reset password form.
     */
    onSubmit() {
      const form = {
        ...this.form,
        token: this.token,
      };

      this.newPassword({ form }).then(() => {
        this.$router.push({ name: 'login' });
      }).catch((error) => {
        const { response } = error;
        const { data } = response;

        if (data.error.type === 'token.invalid') {
          this.current_status = STATE.TOKEN_INVALID;
        }
      });
    },
  },
};
</script>
