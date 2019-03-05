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

export const statusTag = (data, mode) => {
  return axios.request({
    url: 'tag/status',
    method: 'put',
    data: data,
    params: {
      mode: mode
    }
  })
}

export const bindStyle = (tid, sid) => {
  return axios.request({
    url: 'tag/style',
    method: 'put',
    params: {
      tagId: tid,
      styleId: sid
    }
  })
}
export const bindGood = (q1, qs1, q2, qs2) => {
  return axios.request({
    url: 'tag/bind',
    method: 'put',
    params: {
      sourceArgs1: q1,
      ArgsString1: qs1,
      sourceArgs2: q2,
      ArgsString2: qs2,
      mode: '1'
    }
  })
}

export const unBindGood = (q1, qs1, q2, qs2) => {
  return axios.request({
    url: 'tag/bind',
    method: 'put',
    params: {
      sourceArgs1: q1,
      ArgsString1: qs1,
      sourceArgs2: q2,
      ArgsString2: qs2,
      mode: '0'
    }
  })
}
export const deleteTag = (id) => {
  return axios.request({
    url: 'tag/' + id,
    method: 'delete'
  })
}
