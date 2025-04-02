const login = async (username: string, password: string) => {
    const url = 'https://ws.vetoclock.com/oauth/token'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'password',
                client_id: '4',
                client_secret: 'MiiAiwgYnrk17hWRh1c0OsT4Yi63Rs5IX7uTV3t8',
                username,
                password,
                scope: '*',
            }),
        })

        const data = await response.json()

        if (response.ok && data.access_token) {
            return {
                status: 'success',
                token: data.access_token,
                user: data.user ?? {},
            }
        }

        return {
            status: 'failed',
            message: data.message || 'Credenciales incorrectas',
        }
    } catch (error) {
        console.error('❌ Error login:', error)
        return {
            status: 'failed',
            message: 'Error desconocido al iniciar sesión',
        }
    }
}

export default login
