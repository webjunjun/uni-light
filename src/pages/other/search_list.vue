<template>
    <view>
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="isBack">
        </mp-navigation-bar>
        <view class="list-item-text">
            <view v-for="(newItem, index) in news" :key="index" class="list-item-sp" @tap="handleDetail(newItem)">
                <view class="new-img-sp">
                    <image v-if="newItem.image" :src="newItem.image" class="image-sp" />
                    <image v-else src="/images/nopic.jpg" class="image-sp" />
                </view>
                <view style="position:relative;top:13rpx;margin-right:5rpx;margin-top:5rpx;">
                    <view class="list-item-text-title-sp">
                        <text>{{newItem.title}}</text>
                    </view>
                    <view class="list-item-text-content-new">
                        <text>{{newItem.summary}}</text>
                    </view>
                </view>
            </view>
            <view class="no-content" v-if="news.length <= 0">没找到结果，换个搜索词试试。</view>
        </view>
    </view>
</template>

<script>
import { photoBaseUrl, getArticles } from '../../api/api';
const appInstance = getApp();
export default {
    name: 'search_list',
    data() {
        return {
            photoBaseUrl: photoBaseUrl,
            color: '#333',
            background: '#fff',
            isBack: false,
            title: '搜索列表',
            news: [],
            isMore: true,
            page: 1,
            limit: 10,
            searchTxt: ''
        }
    },
    onLoad(options) {
        // 导航是否显示返回按钮
        const pagesArray = getCurrentPages();
        if (pagesArray.length > 1) {
            this.isBack = true
        }
        appInstance.initConfig().then((res) => {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.cateObj = appInstance.globalData.category;
            this.searchTxt = options.searchTxt;
            this.getList();
        });
    },
    methods: {
        getList() {
            getArticles({
                filter: {"title":{"like": this.searchTxt}},
                expand: 'category',
                sort: "-sortnum,-created_at",
                page: this.page,
                "per-page": this.limit
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.news.push(...json);
                    this.isMore = true;
                    if (this.page === 1) {
                        this.videoObj = json[0];
                    }
                    this.page += 1;
                } else {
                    this.isMore = false;
                }
                uni.hideLoading();
            });
        },
        handleDetail(obj) {
            uni.navigateTo({
                url: `/pages/other/detail?id=${obj.id}`
            });
        }
    },
    onReachBottom() {
        if (this.isMore) {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.getList();
        }
    },
    onShareAppMessage() {
        // 分享好友
        const route = this.getCurrentUrl();
        // 实际转发到微信的内容
        const curTitle = appInstance.globalData.config.app_name;
        return {
            title: curTitle,
            path: route
        }
    },
    onShareTimeline() {
        // 分享朋友圈
        const route = this.getCurrentUrl();
        // 实际转发到微信的内容
        const curTitle = appInstance.globalData.config.app_name;
        return {
            title: curTitle,
            path: route
        }
    }
}
</script>

<style lang="scss">
.no-content{
  font-size: 32rpx;
  color: #999;
  text-align: center;
  margin-top: 100rpx;
}
</style>
