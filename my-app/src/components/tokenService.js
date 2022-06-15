// Short duration JWT token (5-10 min)
export function getJwtToken() {
    return localStorage.getItem("access_token")
}

export function setJwtToken(token) {
    localStorage.setItem("access_token", token)
}

// Longer duration refresh token (30-60 min)
export function getRefreshToken() {
    return localStorage.getItem("refresh_token")
}

export function setRefreshToken(token) {
    localStorage.setItem("refresh_token", token)
}

export async function getNewAccessToken() {
    const refresh_token = await getRefreshToken()
    const res = await fetch('users/token/refresh', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${refresh_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    });
    if (res.status === 200) {
        const jsonBody = await res.json()
        setJwtToken(jsonBody.access_token)
        setRefreshToken(jsonBody.refresh_token)
    }
}