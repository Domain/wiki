<template lang='pug'>
  v-container(fluid, grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12, v-if='showTitle')
        .profile-header
          img.animated.fadeInUp(src='/_assets/svg/icon-file.svg', alt='Users', style='width: 80px;')
          .profile-header-title
            .headline.primary--text.animated.fadeInLeft {{defaultTitle}}
            .subheading.grey--text.animated.fadeInLeft {{subtitle}}
      v-flex(xs12)
        v-card.animated.fadeInUp
          v-data-table(
            :items='visitors'
            :headers='headers'
            :page.sync='pagination'
            :items-per-page='15'
            :loading='loading'
            must-sort,
            sort-by='totalTime',
            sort-desc,
            hide-default-footer
          )
            template(slot='item', slot-scope='props')
              tr.is-clickable(:active='props.selected', @click='goToPage(props.item.pageId, props.item.visitorId)')
                td(v-if='historyId == -1 && pageId == 0')
                  .body-2: strong {{ props.item.pageTitle }}
                  .caption {{ props.item.pageDescription }}
                td(v-else)
                  .body-2: strong {{ props.item.visitorName }}
                  .caption {{ props.item.visitorId}}
                td.admin-pages-path
                  span.ml-2.grey--text(:class='$vuetify.theme.dark ? `text--lighten-1` : `text--darken-2`') {{ formatDuration(props.item.totalTime) }}
                td {{ props.item.firstVisitedAt | moment('calendar') }}
                td {{ props.item.lastVisitedAt  | moment('calendar') }}
            template(slot='no-data')
              v-alert.ma-3(icon='mdi-alert', :value='true', outlined, color='grey')
                em.caption {{$t('profile:pages.emptyList')}}
          .text-center.py-2.animated.fadeInDown(v-if='this.pageTotal > 1')
            v-pagination(v-model='pagination', :length='pageTotal')
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

export default {
  props: {
    historyId: {
      type: Number,
      default: -1
    },
    pageId: {
      type: Number,
      default: 0
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: '我浏览过的页面列表'
    }
  },
  data() {
    return {
      selectedpage: {},
      pagination: 1,
      visitors: [],
      loading: false
    }
  },
  computed: {
    defaultTitle () {
      if (this.title != "") {
        return this.title
      }
      return this.$t('profile:pages.title')
    },
    headers () {
      return [
        { text: this.pageId == 0 ? this.$t('profile:pages.headerTitle') : '用户', value: (this.historyId == -1 && this.pageId == 0) ? "pageTitle" : "visitorName" },
        { text: '浏览时长', value: 'totalTime' },
        { text: '首次浏览', value: 'firstVisitedAt', width: 250 },
        { text: '最后浏览', value: 'lastVisitedAt', width: 250 }
      ]
    },
    pageTotal () {
      return Math.ceil(this.visitors.length / 15)
    }
  },
  methods: {
    goToPage (pageId, userId) {
      if (this.pageId == 0)
        window.location.assign(`/i/` + pageId)
      else
        window.location.assign(`/a/users/` + userId)
    },
    formatDuration (duration) {
      return moment.duration(duration, 'seconds').format('d[天]h[小时]mm[分]ss[秒]')
    }
  },
  apollo: {
    visitors: {
      query: gql`
        query($historyId: Int!, $pageId: Int!, $visitorId: Int!) {
          pages {
            allVisitors(historyId: $historyId, pageId: $pageId, visitorId: $visitorId) {
              pageId
              pageTitle
              pageDescription
              visitorId
              visitorName
              firstVisitedAt
              lastVisitedAt
              totalTime
            }
          }
        }
      `,
      variables () {
        return {
          historyId: this.historyId,
          pageId: this.pageId,
          visitorId: this.$store.get('user/id')
        }
      },
      fetchpolicy: 'network-only',
      update: (data) => data.pages.allVisitors,
      watchloading (isloading) {
        this.loading = isloading
        this.$store.commit(`loading${isloading ? 'Start' : 'Stop'}`, 'profile-pages-refresh')
      }
    }
  }
}
</script>

<style lang='scss'>
.profile-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &-title {
    margin-left: 1rem;
  }
}
</style>
