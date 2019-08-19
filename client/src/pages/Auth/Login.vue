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
      <el-link>{{ $t('forget_your_password') }}</el-link>
    </el-form>
  </div>
</template>

<script>
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
  },
};
</script>
