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
