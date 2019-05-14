import {
  login,
  getUserInfo,
  getRoleInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '' || localStorage.getItem('user_id'),
    token: getToken(),
    access: ''

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
    access: state => state.access

  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
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
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
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
