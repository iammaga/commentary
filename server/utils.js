export const getResponse = (data, status = 'success', errors = []) => {
  return JSON.stringify({
    status,
    errors,
    data,
  })
}
