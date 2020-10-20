import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.mixin({
  methods:{
    setTabBarIndex(e){
      const val = e;
      // 设置自定义tabbar哪个选中
      if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
        const tabbar = this.$mp.page.getTabBar();
        const list = tabbar.data.list;
        let idx = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].text == val) {
            idx = i;
            break;
          }
        }
        tabbar.setData({
          selected: idx
        });
      }
    },
    getCurrentUrl() {
      // 获取当前Url，包括options
      const appInit = getApp();
      // 获取当前路径
      let pages = getCurrentPages();
      let curPage = pages[pages.length-1];
      let curRoute = curPage.route;
      // 获取query
      const queryTemp = curPage.options;
      let queryArr = [];
      let queryStr = '';
      // queryArr.push(`scene=${appInit.globalData.sceneInfo.scene}`);
      // queryArr.push(`from_user_id=${appInit.globalData.authInfo.id}`);
      for (const key in queryTemp) {
        if (queryTemp.hasOwnProperty(key)) {
          queryArr.push(`${key}=${queryTemp[key]}`);
        }
      }
      queryStr = queryArr.join("&");
      curRoute = queryStr ? curRoute + '?' + queryStr : curRoute;
      return curRoute;
    }
  }
})


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
