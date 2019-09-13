<template>
  <div class="item-form" id="item-form">
    <el-form ref="form" class="form-container">
      <el-form-item :label="$t('item_name')" prop="title">
        <el-input v-model="form.name" :maxlength="100" name="name" required />
      </el-form-item>

      <el-form-item :label="$t('SKU')" prop="title">
        <el-input v-model="form.SKU" :maxlength="100" name="SKU" required />
      </el-form-item>

      <el-button type="primary">{{ $t('login') }}</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'item-form',
  data() {
    return {
      form: {
        name: '',
      },
    };
  },
  methods: {

    onSubmit() {

    },
  },
};
</script>
