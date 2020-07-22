import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getConfig = () => ({
  headers: { Authorization: token }
})

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async newObject => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, getConfig())
  return response.data
}

const deleteObject =  object => {
  const config = {
    headers : { Authorization: token },
  }
  const response =  axios.delete(`${baseUrl}/${object.id}`, config)
  return response.data
}

export default { getAll, create, update, deleteObject, setToken }