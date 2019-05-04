import axios from '@/libs/api.request'

export const getDispms = (id) => {
  return axios.request({
    url: 'dispm/' + id,
    method: 'get'
  })
}

export const getStyleDisp = (id) => {
  return axios.request({
    url: '/style/dispms/' + id,
    method: 'get'
  })
}

export const getStyle = (styleNumber, isPromote) => {
  return axios.request({
    url: '/style/promote',
    method: 'get',
    params: {
      styleNumber: styleNumber,
      isPromote: isPromote
    }
  })
}

export const delDispm = (id) => {
  return axios.request({
    url: '/dispm/' + id,
    method: 'delete'
  })
}

export const getAllStyle = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'styles/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}
export const updateStyle = (sid, data, mode, update) => {
  return axios.request({
    url: 'style/new',
    method: 'post',
    params: {
      styleId: sid,
      mode: mode,
      update: update
    },
    data: data
  })
}
export const deleteStyle = (id) => {
  return axios.request({
    url: '/style/' + id,
    method: 'delete'
  })
}

export const deleteDispm = (id) => {
  return axios.request({
    url: '/dispm/' + id,
    method: 'delete'
  })
}

export const changeStyle = (data) => {
  return axios.request({
    url: '/style',
    method: 'post',
    data: data
  })
}

export const newStyle = (styleType) => {
  return axios.request({
    url: '/style',
    method: 'get',
    params: {
      styleType: styleType
    }
  })
}
