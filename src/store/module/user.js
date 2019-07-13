import {
  login,
  getUserInfo,
  getRoleInfo,
  SMSlogin
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '' || localStorage.getItem('user_id'),
    token: getToken(),
    access: '',
    shopId: -1,
    isWar: true

  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setShopId (state, shopId) {
      state.shopId = shopId
    },
    setIsWar (state, isWar) {
      state.isWar = isWar
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length,
    token: state => state.token,
    userName: state => state.userName,
    access: state => state.access,
    shopId: state => state.shopId,
    isWar: state => state.isWar

  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, type }) {
      if (type === 1) {
        userName = userName.trim()
        return new Promise((resolve, reject) => {
          login({
            userName,
            password
          }).then(res => {
            let per = new Set()
            getRoleInfo(res.data.data.id).then(pers => {
              const data = pers.data.data
              for (let i = 0; i < data.length; ++i) {
                data[i].permissions.map((item) => {
                  per.add(item.id)
                })
              }
              commit('setAccess', Array.from(per))
            })
            // 获取TOKEN
            commit('setToken', res.headers.esls)
            commit('setUserId', res.data.data.id)
            localStorage.setItem('user_id', res.data.data.id)
            commit('setUserName', res.data.data.name)
            commit('setShopId', res.data.data.shopId)
            commit('setIsWar', !(res.data.data.systemVersion.replenishNumber === 0))
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      } else if (type === 2) {
        return new Promise((resolve, reject) => {
          let data = { phoneNumber: userName, userCode: password, smsType: 'AUTH' }
          console.log(data)
          SMSlogin(data).then(res => {
            console.log(res)
            let per = new Set()
            getRoleInfo(res.data.data.id).then(pers => {
              const data = pers.data.data
              for (let i = 0; i < data.length; ++i) {
                data[i].permissions.map((item) => {
                  per.add(item.id)
                })
              }
              commit('setAccess', Array.from(per))
            })
            // 获取TOKEN
            commit('setToken', res.headers.esls)
            commit('setUserId', res.data.data.id)
            localStorage.setItem('user_id', res.data.data.id)
            commit('setUserName', res.data.data.name)
            commit('setShopId', res.data.data.shopId)
            commit('setIsWar', !(res.data.data.systemVersion.replenishNumber === 0))
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      } else {

      }
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        localStorage.setItem('user_id', 0)
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      console.log('gUI')
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.userId).then(res => {
            const data = res.data.data
            commit('setUserName', data.name)
            commit('setShopId', data.shopId)
            commit('setIsWar', !(data.systemVersion.replenishNumber === 0))
            let per = new Set()
            getRoleInfo(state.userId).then(pers => {
              const data = pers.data.data
              for (let i = 0; i < data.length; ++i) {
                data[i].permissions.map((item) => {
                  per.add(item.id)
                })
              }
              commit('setAccess', Array.from(per))
              console.log(state.access)
            })
            // commit('setUserId', data.user_id)
            // TODO 设置权限
            // commit('setAccess', data.access)
            resolve(res.data)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
