import axios from 'axios'

const endpoint = 'http://localhost:3001/persons'
const getDataFromResponse = (response) => response.data

const getAll = () => {
  return axios
    .get(endpoint)
    .then(getDataFromResponse)
}

const getOne = (id) => {
  return axios
    .get(endpoint + '/' + id)
    .then(getDataFromResponse)
}

const create = (contact) => {
  return axios
    .post(endpoint, contact)
    .then(getDataFromResponse)
}

const update = (contact) => {
  return axios
    .put(endpoint + '/' + contact.id, contact)
    .then(getDataFromResponse)
}

const deleteOne = (id) => {
  return axios
    .delete(endpoint + '/' + id)
    .then(getDataFromResponse)
}

export default {
  getAll,
  getOne,
  update,
  deleteOne,
  create
}