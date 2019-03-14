import axios from '@/libs/api.request'

export const getAllShop = ({ page, count, query, queryString }) => {
  return axios.request({
    url: '/shops',
    method: 'get',
    params: {
      query: query,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const updateShop = (data) => {
  return axios.request({
    url: '/shop',
    method: 'post',
    data: data
  })
}

export const deleteShop = (id) => {
  return axios.request({
    url: 'shop/' + id,
    method: 'delete'
  })
}
