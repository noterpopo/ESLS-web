export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '益亿-ESLS管理系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://47.107.139.6:8086', // 'http://172.26.225.158:8086', 'http://39.108.106.167:8086' 'https://www.easy-mock.com/mock/5c6a58f27a34d233546dea97/',
    pro: 'http://47.107.139.6:8086'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
  }
}
