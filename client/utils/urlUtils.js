const baseURL = 'http://localhost:8081'

export const buildAPIEndpoint = (route, queryStrings) => {
  const apiRoute = `${baseURL}/api/${route}`
  const queryStringified = queryStrings.map(queryString => {
    return `${queryString.key}=${queryString.value}`
  })

  return `${apiRoute}?${queryStringified.join('&')}`
}