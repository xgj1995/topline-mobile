<template>
    <div>
        <form action="/">
        <van-search
            v-model="searchValue"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @search="handleSearch(searchValue)"
            >
            <div
            slot="action"
            @click="$router.back()"
            >
                返回
            </div>
        </van-search>
        </form>
        <!-- 联想建议表 -->
        <van-cell-group v-if=' searchValue.length && suggestions.length'>
            <van-cell
            v-for='item in suggestions'
            :key='item'
            icon="search"
            @click="handleSearch(item)"
            >
                <div slot="title" v-html="heightLight(item)"></div>
            </van-cell>
         </van-cell-group>
        <!-- 联想建议表 -->
        <!-- 历史纪录 -->
        <van-cell-group v-else>
            <van-cell  title="历史记录">
                <van-icon
                    v-show="!isDelete"
                    slot="right-icon"
                    name="delete"
                    style="line-height: inherit;"
                    @click=" isDelete = true"
                />
                <div v-show="isDelete">
                    <span
                    style="margin-right:10px;"
                    @click='searchHistories = []'
                    >全部删除</span>
                    <span @click="isDelete = false">完成</span>
                </div>
            </van-cell>
            <van-cell
                v-for="(item,index) in searchHistories"
                :key='item'
                :title="item"
                @click="handleSearch(item)"
            >
                <van-icon
                    v-show="isDelete"
                    slot="right-icon"
                    name="close"
                    style="line-height: inherit;"
                    @click="searchHistories.splice(index,1)"
                ></van-icon>
            </van-cell>
        </van-cell-group>
        <!-- 历史纪录 -->
        <!-- 导航栏 -->
        <app-tabbar></app-tabbar>
    </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'search',
  data () {
    return {
      searchValue: '',
      suggestions: [],
      searchHistories: null,
      isDelete: false
    }
  },
  watch: {
    // 搜索防抖
    searchValue: debounce(async function (val) {
      val = val.trim()
      if (val) {
        const data = await getSuggestion(val)
        this.suggestions = data.options
      } else {
        // this.suggestions = ''//清除联想建议
        // return
      }
    }, 500),
    // 添加到本地存储
    searchHistories: {
      handler () {
        console.log(this.searchHistories)
        window.localStorage.setItem('search-histories',
          JSON.stringify(this.searchHistories))
      },
      deep: true
    }
  },
  created () {
    // 如果本地有数据
    if (JSON.parse(window.localStorage.getItem('search-histories'))) {
      this.searchHistories = JSON.parse(window.localStorage.getItem('search-histories'))
    } else {
      // 无数据
      this.searchHistories = []
    }
  },
  deactivated () {
    // console.log('des')
    // this.$destroy()
    this.searchValue = ''// 跳转后清除输入框数据
  },
  methods: {
    onCancel () {
    },
    // 联想关键字高亮
    heightLight (item) {
      return item.toLowerCase().split(this.searchValue).join(`<span style="color:red;">${this.searchValue}</span>`)
    },
    // 点击联想搜索
    handleSearch (item) {
      item = item.trim()
      // 判断是否为编辑状态
      if (this.isDelete) {
        return
      }
      // 跳转到搜索页面
      if (item.length) {
        // 数据去重
        this.searchHistories.unshift(item)
        this.searchHistories = [...new Set(this.searchHistories)]
        console.log(this.searchHistories, '我是下面')
        //  跳转搜索结果页
        this.$router.push({
          name: 'search-result',
          params: {
            q: item
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
