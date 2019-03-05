import axios from '@/libs/api.request'

export const getAllTag = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'tags/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const flushTag = (data, mode) => {
  return axios.request({
    url: 'tag/flush',
    method: 'put',
    data: data,
    params: {
      mode: mode
    }
  })
}

export const lightTag = (data, mode, typeMode) => {
  return axios.request({
    url: 'tag/light',
    method: 'put',
    data: data,
    params: {
      mode: mode,
      typeMode: typeMode
    }
  })
}

export const removeTag = (data, mode) => {
  return axios.request({
    url: 'tag/remove',
    method: 'put',
    data: data,
    params: {
      mode: mode
    }
  })
}

export const scanTag = (data, mode) => {
  return axios.request({
    url: 'tag/scan',
    method: 'put',
    data: data,
    params: {
      mode: mode
    }
  })
}

export const deleteTag = (id) => {
  return axios.request({
    url: 'tag/' + id,
    method: 'delete'
  })
}
