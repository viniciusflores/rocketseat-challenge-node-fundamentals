// ?search=vini&page=2
// search=vini&page=2 => substr
// ['search=vini', 'page=2'] => split &

// ['search','vini'] => split =
// ['page','2']

export function extractQueryParams(query) {
  return query.substr(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=')

    queryParams[key] = value

    return queryParams
  }, {})
}
