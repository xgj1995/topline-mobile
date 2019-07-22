<template>
    <div>
        <van-nav-bar
        title="搜索结果"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
        />
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell
                v-for="item in list"
                :key="item.art_id.toString()"
                :title="item.title"
            />
        </van-list>
    </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'search-result',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      searchData: {
        page: 1,
        perPage: 10,
        q: null
      }
      // page:1,
      // perPage:10,
      // q:null
    }
  },
  activated () {
    this.loading = true
    this.onLoad()
  },
  deactivated () {
    this.list = []
    this.searchData.page = 1
    // this.$destroy() 直接摧毁声明周期
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(async () => {
        const data = await this.loadSearchResult()
        if (!data.length) {
          this.loading = false
          this.finshed = true
          return
        }
        this.list.push(...data)
        // 更新下一页
        this.page += 1
        // 加载状态结束
        this.loading = false
      }, 500)
    },
    // 加载文章
    async loadSearchResult () {
      // 回退太快，数据还没获取就返回上个页面。
      const q = this.$route.params.q
      this.searchData.q = q
      const data = await getSearchResult(this.searchData)
      return data.results
    }
  }
}

</script>

<style scoped>

</style>
