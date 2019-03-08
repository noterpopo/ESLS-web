import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: 'user/login',
    data: {
      username: userName,
      password: password
    },
    method: 'post'
  })
}

export const getUserInfo = (id) => {
  return axios.request({
    url: '/users/' + id,
    method: 'get'
  })
}

export const getAllUser = ({ page, count, query, queryString }) => {
  return axios.request({
    url: '/users',
    method: 'get',
    params: {
      query: query,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}
