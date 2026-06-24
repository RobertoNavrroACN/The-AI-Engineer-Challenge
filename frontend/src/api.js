export async function callApi(endpoint, data){
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if(!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
