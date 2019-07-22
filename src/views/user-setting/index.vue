<template>
    <div class="user-seeting">
       <van-nav-bar
        title="个人设置"
        right-text="保存"
        left-text='返回'
        left-arrow
        @click-left="$router.back()"
        @click-right="handleSave"
        />
        <div>
            <van-cell title="头像" is-link  :center='true' @click="handleEditImg">
                <div slot="default" class="img">
                    <img :src="userProfile.photo" alt="">
                </div>
                <input ref="file" type="file" style="display:none">
            </van-cell>
            <van-cell
            title="昵称"
            :value="userProfile.name"
            is-link
            @click="isEditShow(userProfile.name)"
            >
            </van-cell>
            <van-cell
            title="手机号"
            :value="userProfile.mobile"
            is-link
            @click=" isShow = true"
            />
            <van-cell
            title="性别"
            :value="userProfile.gender === 0 ? '男':'女'"
            is-link
            @click="isEditShow(userProfile.gender)"
            />
            <van-cell
            title="生日"
            :value="userProfile.birthday"
            is-link
             @click="isEditShow(userProfile.birthday)"
            />
            <edit-info
            v-model="isShow"
            :content="editValue"
            :editType='editType'
            @update='edit($event)'
            />
        </div>
    </div>
</template>

<script>
import { getUserProfile, editUserProfile, editUserPhoto } from '@/api/user'
import EditInfo from './components/edit-info'
export default {
  name: 'UserSetting',
  components: {
    EditInfo
  },
  data () {
    return {
      userProfile: {},
      isShow: false,
      editValue: '', // 输入框原本的值
      editType: null// 判断修改的类型
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
  created () {
    this.loadUserPrifile()
  },
  mounted () {
    this.$refs['file'].addEventListener('change', this.handleFileChange)
  },
  methods: {
    async  loadUserPrifile () {
      const data = await getUserProfile()
      this.userProfile = data
      console.log(data)
    },
    // base64处理图片
    async  handleFileChange () {
      //   编辑图片，预览图片
      const file = this.file.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.userProfile.photo = reader.result
      })
    },
    handleEditImg () {
      this.$refs['file'].click()
    },
    //  保存
    async handleSave () {
      try {
        let r1 = Promise.resolve()
        r1 = this.uploadPhoto()
        const r2 = editUserProfile({
          name: this.userProfile.name,
          gender: this.userProfile.gender,
          birthday: this.userProfile.birthday
        })
        await Promise.all([r1, r2])
        this.$toast('更新成功')
        //     await editUserProfile({
        //     name: this.userProfile.name,
        //     gender: this.userProfile.gender,
        //     birthday: this.userProfile.birthday,
        //     photo:this.userProfile.photo//照片处理为64位上传
        // })
      } catch (err) {
        // console.log(this.userProfile.photo)
        console.log(err)
      }
    },
    // 上传用户头像
    uploadPhoto () {
      const formData = new FormData()
      formData.append('photo', this.file.files[0])
      return editUserPhoto(formData)
    },
    // 修改框显示
    isEditShow (content) {
      this.isShow = true
      if (content === this.userProfile.name) {
        this.editType = 0
      }
      if (content === this.userProfile.gender) {
        if (content === 0) {
          content = '男'
        } else {
          content = '女'
        }
        this.editType = 1
      }
      if (content === this.userProfile.birthday) {
        this.editType = 2
      }
      this.editValue = content
    },
    edit (e) {
      console.log(e)
      if (this.editType === 0) {
        this.userProfile.name = e
      }
      if (this.editType === 1) {
        if (e === '男') {
          e = 0
        } else {
          e = 1
        }
        console.log(e)
        this.userProfile.gender = e
        console.log(this.userProfile.gender)
      }
      if (this.editType === 2) {
        this.userProfile.birthday = e
      }
    }
  }
}
</script>

<style lang='less' scoped>
    .user-seeting{
        // .user{
        //     height: 100px;
        //     line-height: 100px;
        //     text-align: center;
        //     color: #fff;
        //     background-color: #3296fa;
        // }
            img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
</style>
