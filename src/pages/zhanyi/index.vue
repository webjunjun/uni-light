<template>
    <view class="zhanyi-index">
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="false">
        </mp-navigation-bar>
        <mp-sticky :offset-top="offset_top" v-if="videoObj.video_src">
            <video id="myVideo" :src="videoObj.video_src" :controls="true" :show-center-play-btn="false" :autoplay="autoplay" object-fit="contain" :title="videoObj.title" :custom-cache="false">
            </video>
        </mp-sticky>
        <view class="page-wrapper">
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
                            <view>
                                <text>{{newItem.summary}}</text>
                            </view>
                            <view style="position: absolute;top:148rpx;">
                                <view style="width:240rpx;float:left;color:#999;font-size:24rpx">
                                    {{newItem.created_at.substring(0, 10)}}
                                </view>
                                <view style="float:right;color:#999;font-size:24rpx;">
                                    {{newItem.views}}人观看过
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="space-view"></view>
    </view>
</template>

<script>
import { photoBaseUrl, getArticles, getCategories } from '../../api/api';
const appInstance = getApp();
export default {
    name: 'ZhanyiIndex',
    data() {
        return {
            photoBaseUrl: photoBaseUrl,
            color: '#333',
            background: '#fff',
            title: '科技战疫',
            offset_top: 0,
            news: [],
            videoObj: {},
            isMore: true,
            page: 1,
            limit: 10,
            refresh: false,
            videoContext: null,
            autoplay: true
        }
    },
    onShow() {
        this.setTabBarIndex('科技战疫');
        if (this.videoContext && !this.autoplay) {
            this.videoContext.play();
        }
    },
    onLoad(options) {
        appInstance.initConfig().then(async (res) => {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.offset_top = appInstance.globalData.statusBarHeight;
            this.cateObj = appInstance.globalData.category;
            // 获取栏目分类视频
            await getCategories({
                filter:{"name":"科技战疫"}
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.videoObj = json[0];
                    this.videoContext = uni.createVideoContext('myVideo');
                }
            });
            // 获取第一次分页列表
            await getArticles({
                filter: {"category_id":this.cateObj['科技战疫']},
                expand: 'category',
                sort: "-sortnum,-created_at",
                page: this.page,
                "per-page": this.limit
            })
            .then((res) => {
                const json = res.data.items;
                if (this.refresh) {
                    this.news = [];
                    this.refresh = false;
                    uni.stopPullDownRefresh();
                }
                if (json.length > 0) {
                    this.news = json;
                    this.isMore = true;
                    this.page += 1;
                } else {
                    this.isMore = false;
                }
                uni.hideLoading();
            });
        });
    },
    methods: {
        getList() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            getArticles({
                filter: {"category_id":this.cateObj['科技战疫']},
                expand: 'category',
                sort: "-sortnum,-created_at",
                page: this.page,
                "per-page": this.limit
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.news.push(json);
                    this.isMore = true;
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
    onHide() {
        if (this.videoContext) {
            this.videoContext.stop();
        }
    },
    onUnload() {
        if (this.videoContext) {
            this.videoContext.stop();
        }
    },
    onPullDownRefresh() {
        let pages = getCurrentPages();
        let curPage = pages[pages.length-1];
        this.page = 1;
        this.isMore = true;
        this.refresh = true;
        curPage.onLoad();
    },
    onReachBottom() {
        if (this.isMore) {
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

</style>
