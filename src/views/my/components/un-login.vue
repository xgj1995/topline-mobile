<template>
    <div class="un-login">
        <router-link :to="{name:'login',query:{redirect:'/my'}}">
            <div class="box">
                登录
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'UnLogin'
}
</script>

<style lang="less" scoped>
.un-login {
    display: flex;
    justify-content: center;
    margin-top: 50px;
.box {
        width: 200px;
        height: 200px;
        background-color: red;
        border-radius: 50%;
        line-height: 200px;
        text-align: center;
        color: #fff;
    }
}
</style>
