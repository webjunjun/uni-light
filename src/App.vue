<script>
import { getConfigAll, getCategories } from './api/api';
export default {
	globalData: {
    userInfo: null,
		openid: null,
    config: null,
    statusBarHeight: 0,
    category: {},
    isRefresh: true
	},
	async onLaunch (options) {
    uni.getSystemInfo({
      success: (res) => {
        if (res.system.indexOf('iOS') > -1) {
            this.globalData.statusBarHeight = res.statusBarHeight + 44;
        } else {
            this.globalData.statusBarHeight = res.statusBarHeight + 48;
        }
      }
    })
		if (uni.canIUse('getUpdateManager')) {
      		const updateManager = uni.getUpdateManager();
      		updateManager.onCheckForUpdate((res)=> {
        		// 请求完新版本信息的回调
        		if (res.hasUpdate) {
          			updateManager.onUpdateReady(()=> {
						      updateManager.applyUpdate();
          			});
          			updateManager.onUpdateFailed(()=> {
            			// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						});
					});
        		}
			});
		} else {
			uni.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			});
    }
		// this.initConfig();
	},
	methods: {
		initConfig() {
			return new Promise(async (resolve, reject) => {
        try {
          // 检查配置有效期, 1小时以上则刷新
          const curTime = uni.getStorageSync('timestamp') || 0;
          var timestamp = (new Date()).getTime();
          if (timestamp - parseInt(curTime) >= 3600000) {
            uni.clearStorageSync('config');
            uni.clearStorageSync('category');
            uni.clearStorageSync('timestamp');
          }
          const value = uni.getStorageSync('config') || '';
          const categoryValue = uni.getStorageSync('category') || '';
          this.globalData.isRefresh = true;// 此处必须设置初始化，否则时间判断过期会造成无法reslove
          if (value !== '' && categoryValue !== '') {
            this.globalData.config = value;
            this.globalData.category = categoryValue;
            this.globalData.isRefresh = false;
            resolve();
          }
          if (this.globalData.isRefresh) {
            let res = await getConfigAll();
            let categoryRes = await getCategories();
            this.globalData.config = res.data;
            const json = categoryRes.data.items;
            let tempJson = {};
            for (let i = 0; i < json.length; i++) {
              tempJson[json[i].name] = json[i].id;
            }
            this.globalData.category = {...tempJson};
            uni.setStorageSync('config', res.data);
            uni.setStorageSync('category', this.globalData.category);
            uni.setStorageSync('timestamp', timestamp);
            this.globalData.isRefresh = false;
            resolve();
          }
        } catch (e) {
            // 抛出异常，直接走正常流程
            let res = await getConfigAll();
            let categoryRes = await getCategories();
            this.globalData.config = res.data;
            const json = categoryRes.data.items;
            let tempJson = {};
            for (let i = 0; i < json.length; i++) {
              tempJson[json[i].name] = json[i].id;
            }
            this.globalData.category = {...tempJson};
            uni.setStorageSync('config', res.data);
            uni.setStorageSync('category', this.globalData.category);
            uni.setStorageSync('timestamp', timestamp);
            this.globalData.isRefresh = false;
            resolve();
        }
			})
		}
	}
}
</script>

<style>
@import './wxcomponents/weui-wxss/weui.wxss';
page{
	background-color: #efefef;
}
.parser-wrap{
  margin-top: 20rpx;
}
#myVideo{
  width: 100vw;
  height: 420rpx;
	vertical-align: middle;
}
.space-view{
  width: 100%;
  height: 120rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.list-item-sp{
  width: 265rpx;
  height: 205rpx; /*195*/
  width: 100%;
  border-bottom: 5rpx solid #efefef;
  border-width: 2rpx 0;
  background-color: #efefef;
  border-radius: 10rpx;
}

.list-item-sp-main{
  width: 265rpx;
  height: 205rpx;
  width: 100%;
  border-bottom: 5rpx solid #efefef;
  border-width: 2rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
}
 
.list-item-text{
  min-height: 200rpx;
  width: 93%;
  margin: 20rpx auto;
  padding-left: 2%;
  padding-right: 2%; 
}

.list-item-text-single{
  min-height: 120rpx;
  width: 93%;
  margin: 20rpx auto;
  padding-left: 2%;
  padding-right: 2%; 
}

.list-item-text-primary{
  min-height: 200rpx;
  width: 100%;
  margin-top: 20rpx;
  background-color: #efefef;
}

.list-item-text-title{
  font-weight: bold;
  margin: 20rpx auto auto 180rpx;
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 28rpx;/*自适应字体*/
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;/*设置需要显示的行数*/
}

.list-item-text-title-sp{
  /*font-weight: 550;*/
  font-weight: bold;
  margin: 10rpx auto auto 290rpx;
  /*align-items: center;
  justify-content: center;
  display: flex;*/
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 28rpx;/*自适应字体*/
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;/*设置需要显示的行数*/
}

.list-item-text-title-sp-main{
  /*font-weight: 550;*/
  font-weight: bold;
  margin: 10rpx auto auto 265rpx;
  /*align-items: center;
  justify-content: center;
  display: flex;*/
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 28rpx;/*自适应字体*/
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;/*设置需要显示的行数*/
}

.list-item-text-content{
  font-size: 11px;
  color: #080808;
  margin: 20rpx auto auto 180rpx;
  min-height: 120rpx;
}

.list-item-text-content-sp{
  font-size: 11px;
  color: #080808;
  margin: 20rpx auto auto 290rpx;
}

.list-item-text-content-sp-main{
  font-size: 11px;
  color: #080808;
  margin: 20rpx auto auto 265rpx;
}

.list-item-text-content-single{
  font-size: 28rpx;
  color: #080808;
  margin: 30rpx auto;
  width: 93%;
  min-height: 120rpx;
}

.list-item-text-content-single-sp{
  font-size: 28rpx;
  color: #080808;
  margin: 30rpx auto;
  width: 93%;
  min-height: 120rpx;
}

.list-item-text-content-new{
  color: #080808;
  margin: 20rpx auto auto 290rpx;
  /*min-height: 120rpx;*/
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 28rpx;/*自适应字体*/
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;/*设置需要显示的行数*/
}

.item-text-content-single{
 display: -webkit-box;
 word-break: break-all;
 text-overflow: ellipsis;
 font-size: 28rpx;/*自适应字体*/
 overflow: hidden;
 -webkit-box-orient: vertical;
 -webkit-line-clamp:2;/*设置需要显示的行数*/
}

.item-text-content-single-sp{
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 28rpx;/*自适应字体*/
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:3;/*设置需要显示的行数*/
 }

.list-item-text-content-primary{
  font-size: 11px;
  margin: 20rpx auto;
}

.page-wrapper {
  margin: 0;
  font-size: 28rpx;
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
  min-height:500rpx;
}

.new-img {
  position: absolute;
  left: 5;
  width: 150rpx;
  line-height: 100rpx;
  margin: 20rpx auto auto 15rpx;
  justify-content: center;        
  align-items:center; 
  display: flex; 
  } 
  
  .new-img-sp {
    position: absolute;
    left: 2;
    width: 265rpx;
    height: 195rpx;
    line-height: 100rpx;
    margin: 1rpx;
    justify-content: center;        
    align-items:center; 
    display: flex; 
    border-radius: 5rpx;
    } 

    .new-img-sp-main {
      position: absolute;
      left: 2;
      width: 265rpx;
      height: 195rpx;
      line-height: 100rpx;
      margin: 5rpx auto auto 0rpx;
      justify-content: center;        
      align-items:center; 
      display: flex; 
      border-radius: 5rpx;
      } 

  .image{
    width:150rpx;
    height:150rpx;
  }

  .image-sp{
    width: 265rpx;
    height: 195rpx;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .image-sp-main{
    width: 200rpx;
    height: 165rpx;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .new-img-item{
    /*position: absolute;
    width: 100%;
    height: 300rpx;
    line-height: 100rpx;*/
    margin: 18rpx;
    justify-content: center;        
    align-items:center; 
    display: flex; 
  }

  .new-img-item-single{
    /*position: absolute;
    width: 100%;
    height: 300rpx;
    line-height: 100rpx;
    top:5;*/
    margin: 18rpx;
    justify-content: center;        
    align-items:center; 
    display: flex; 
  }

  
  .new-img-item-sp{
    position: absolute;
    width: 100%;
    height: 200rpx;
    line-height: 100rpx;
    margin: 18rpx;
    justify-content: center;        
    align-items:center; 
    display: flex; 
  }

  .new-img-item-single{
    /*position: absolute;
    width: 100%;
    height: 300rpx;
    line-height: 100rpx;*/
    margin: 18rpx auto 18rpx auto;
    justify-content: center;        
    align-items:center; 
    display: flex; 
  }

  .list-item-text-1{
    min-height: 200rpx;
    width: 93%;
    padding-left: 2%;
    padding-right: 2%; 
  }

  .list-item-1{
    height: 200rpx;
    width: 100%;
    background-color:#ffffff;
  }

  .list-item-box{
    margin: 5rpx auto;
    height: 300rpx;
    width: 90%;
    border-radius: 10rpx;
    background-color: #fff;
  }
  
  .list-item-box-1{
    margin: 5rpx auto;
    width: 96%;
    height: 320rpx;
    text-align: center;
    line-height: 200rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .list-item-box-single{
    margin: 30rpx auto;
    width: 96%;
    height: 380rpx;
    text-align: center;
    /*line-height: 200rpx;*/
    border-radius: 10rpx;
    background-color: #fff;
  }

  .list-item-box-single-sp{
    margin: 30rpx auto;
    width: 96%;
    height: 410rpx;
    text-align: center;
    /*line-height: 200rpx;*/
    border-radius: 10rpx;
    background-color: #fff;
  }

  .list-item-box-single-sp-n{
    margin: 30rpx auto;
    width: 96%;
    height: 420rpx;
    text-align: center;
    /*line-height: 200rpx;*/
    border-radius: 10rpx;
    background-color: #fff;
  }

  .page-wrapper-1 {
    margin: 0;
    font-size: 28rpx;
    line-height: 1.5;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
    height:auto;
    background-color:#efefef;
    min-height:1000rpx;
  }

</style>