
import { buildAPIEndpoint } from '../utils/urlUtils';

export const fetchGet = async (endpoint, queryStrings) => {
  const url = buildAPIEndpoint(endpoint, queryStrings)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return response.json()
  } catch(error) {
    console.log(error)
    return error
  }
}