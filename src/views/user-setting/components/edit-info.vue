<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      title="提示"
      @confirm="handleEdit"
      show-cancel-button
    >
        <van-datetime-picker
        v-if='editType === 2'
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        />
        <van-field
        v-else
        :value="content"
        @change="change"
        ref="input"
        />
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditInfo',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: [String, Number]
    },
    editType: {
      type: Number
    }
  },
  data () {
    return {
      abc: '',
      currentDate: new Date(),
      minDate: new Date('1900/01/01')
    }
  },
  // 法三也可采用watch监听content变化后赋值abc
  // watch: {
  //     content:function(val){
  //         this.abc = val
  //     }
  // },
  deactivated () {
    this.$destroy()
  },
  methods: {
    //   法一
    //   input(e){
    //     // this.abc = e.target.value
    //   }，

    //   法二，优点不用实时获取
    change (e) {
      this.abc = e.target.value
    },
    handleEdit () {
      if (this.editType === 2) {
        const data = this.$Format(this.currentDate, 'yyyy-MM-dd')
        this.$emit('update', data)
      } else {
        this.$emit('update', this.abc)
      }
    }
  }
}
</script>

<style>
</style>
