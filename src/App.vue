<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #484a4d;
  /* background:  #b6bbbb21; */
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

#app form {
  text-align: left;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-button--primary {
  color: #fff;
  background-color: rgb(20, 136, 154);
  border-color: rgb(20, 136, 154);
}

.el-button--primary:focus,
.el-button--primary:hover {
  color: #fff;
  background-color: rgb(20, 136, 154);
  border-color: rgb(143, 225, 238);
}


.el-tabs__item.is-active {
    color: rgb(20, 136, 154);
}

.el-dialog__footer{
  text-align: center
}

.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgb(20, 136, 154);
    border-color: rgb(20, 136, 154);
}

.el-menu-item.is-active {
    color: #409EFF
}
 

.el-submenu.is-active .el-submenu__title {
     color: #409EFF
}
 
</style>
 

 
