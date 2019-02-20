import axios from '@/libs/api.request'

export const getDispms = (id) => {
  return axios.request({
    url: 'dispm/' + id,
    method: 'get'
  })
}

export const getStyle = (id) => {
  return axios.request({
    url: 'style/' + id,
    method: 'get'
  })
}

export const getAllStyle = () => {
  return axios.request({
    url: 'styles/',
    method: 'get'
  })
}
