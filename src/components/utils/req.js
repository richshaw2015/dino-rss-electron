import { SERVER, getToken } from './config.js'

export async function apiReq(path, data) {
    const token = getToken()
    if (!token) {
        return null
    }

    let formData = new FormData();
    for (let key in data) {
        formData.append(key, data[key])
    }

    const rsp = await fetch((new URL(path, SERVER)).href, { 
            method:'POST', 
            body: formData,
            headers: { 'Token': token }
        }
    )
    return await rsp.json()
}
