import axios from '@/libs/api.request'

export const getAllGood = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'goods/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const downloadGoodsCsv = () => {
  return axios.request({
    url: '/common/database/exportCsvDataFile?tableName=goods',
    method: 'get'
  })
}

export const cronUpdate = (cron, filepath, mode) => {
  return axios.request({
    url: 'good/schedule',
    method: 'get',
    params: {
      cron: cron,
      rootFilePath: filepath,
      mode: mode
    }
  })
}

export const getBindedTags = ({ queryId, queryString }) => {
  return axios.request({
    url: 'good/binded',
    method: 'get',
    params: {
      query: queryId,
      connection: '=',
      queryString: queryString
    }
  })
}

export const getGood = (id) => {
  return axios.request({
    url: 'goods/' + id,
    method: 'get'
  })
}

export const updateGood = (data) => {
  return axios.request({
    url: 'good/',
    method: 'post',
    data: data
  })
}

export const submitUpdate = (data) => {
  return axios.request({
    url: '/good/update',
    method: 'put',
    data: {
      item: data
    }
  })
}
export const deleteGood = (id) => {
  return axios.request({
    url: '/good/' + id,
    method: 'delete'
  })
}
