<style lang="less"></style>
<template>
  <div class="">
    <div class="table-basic-vue frame-page h-panel">
      <div class="h-panel-bar"><span class="h-panel-title">编辑权限</span></div>
      <div class="h-panel-body">

        <Form v-width="400" mode="block" ref="form" :validOnChange="true" :showErrorTip="true" :labelWidth="110" :rules="rules" :model="permission">
          <FormItem label="角色名" prop="display_name">
            <template v-slot:label>角色名</template>
            <input type="text" v-model="permission.display_name" />
          </FormItem>
          <FormItem label="Slug" prop="slug">
            <template v-slot:label>Slug</template>
            <input type="text" v-model="permission.slug" />
          </FormItem>
          <FormItem label="描述" prop="description">
            <template v-slot:label>描述</template>
            <input type="text" v-model="permission.description" />
          </FormItem>
          <FormItem label="Method" prop="method">
            <template v-slot:label>Method</template>
            <Select v-model="permission.method" :datas="methods"></Select>
          </FormItem>
          <FormItem label="URL" prop="url">
            <template v-slot:label>URL</template>
            <input type="text" v-model="permission.url" />
          </FormItem>
          <FormItem>
            <Button color="primary" @click="create">保存</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import Permission from 'model/AdministratorPermission';

export default {
  props: ['id'],
  data() {
    return {
      permission: Permission.parse({}),
      rules: {
        required: ['display_name', 'description','slug', 'url', 'method']
      },
      methods: [
        {
          title: 'GET',
          key: 'GET'
        },
        {
          title: 'POST',
          key: 'POST'
        },
        {
          title: 'PUT',
          key: 'PUT'
        },
        {
          title: 'DELETE',
          key: 'DELETE'
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      R.AdministratorPermission.Edit({ id: this.id }).then(resp => {
        this.permission = resp.data;
        this.permission.method = this.permission.method.split('|');
      });
    },
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.AdministratorPermission.Update(this.permission).then(resp => {
          HeyUI.$Message.success('成功');
          this.$router.push({ name: 'AdministratorPermission' });
        });
      }
    }
  }
};
</script>
