export async function callApi(endpoint, data) {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let detail = `The post office returned an error (${res.status}).`
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      /* response had no JSON body — keep the generic message */
    }
    throw new Error(detail)
  }

  return res.json()
}
