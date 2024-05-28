<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1 style="text-align: center">Norwegian Garbage Data Visualization System</h1>
      </el-header>
      <el-main>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <h2 style="text-align: center; margin-bottom: 10px">Login</h2>
          <div style="margin: 20px">
            <el-form-item label="username">
              <el-input style="width: 350px" maxlength="20" v-model="form.username" />
            </el-form-item>
            <el-form-item label="password">
              <el-input
                style="width: 350px"
                maxlength="20"
                show-password="true"
                v-model="form.password"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">login</el-button>
              <el-button>Cancel</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// do not use same name with ref
const form = reactive({
  username: '',
  password: ''
})
const router = useRouter()
const onSubmit = () => {
  console.log('submit!')
  router.push('/dataVis')
}
</script>
<style scoped>
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
}
.el-header {
  background-color: aqua;
  padding-top: 10px;
}
.el-main {
  background-image: url(../assets/background.jpg);
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  height: 70%;
}
.el-form {
  position: relative;
  margin: auto;
  margin-top: 10%;
  left: 0%;
  padding: 20px;
  width: 800px;
  height: 250px;
  background-color: white;
  border-radius: 10px;
  border: groove;
  border-color: gray;
}
.el-form-item {
  position: relative;
  display: flex;
  margin: 5px, 0, 0, 0;
  left: 20%;
  width: 400px;
}
.el-button {
  align-items: center;
  flex: 1;
}
.el-footer {
  background-color: slategray;
}
</style>
