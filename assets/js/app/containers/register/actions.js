export const registerRequest = formData => {
  return fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    if(response.ok) {
      return response.json()
    }
    throw response
  })
}
