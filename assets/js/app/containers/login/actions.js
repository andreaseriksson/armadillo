export const loginRequest = formData => {
  return fetch('/api/signin', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    return response.json()
  })
}
