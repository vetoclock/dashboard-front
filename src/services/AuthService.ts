import login from '@/views/auth/authService'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
} from '@/@types/auth'

export const apiSignIn = async (
    credentials: SignInCredential,
): Promise<AuthResult> => {
    try {
        const result = await login(credentials.email, credentials.password)

        if (result.status === 'success') {
            return {
                status: 'success',
                message: result.message ?? '',
                token: result.token,
                user: result.user,
            }
        }

        return {
            status: 'failed',
            message: result.message || 'Login fallido',
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
        return {
            status: 'failed',
            message: 'Excepción inesperada',
        }
    }
}

export const apiSignOut = async (): Promise<void> => {
    return Promise.resolve()
}

export const apiSignUp = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _values: SignUpCredential,
): Promise<AuthResult> => {
    return {
        status: 'failed',
        message: 'Sign up no implementado',
    }
}

export const apiForgotPassword = async (
    email: string,
): Promise<{ status: string; message: string }> => {
    // Este es un ejemplo. Adáptalo a tu backend real.
    return {
        status: 'success',
        message: 'Enlace enviado al correo',
    }
}
export const apiResetPassword = async (
    password: string,
): Promise<{ status: string; message: string }> => {
    // Sustituye esto por tu lógica real de llamada al backend
    return {
        status: 'success',
        message: 'Contraseña actualizada con éxito',
    }
}
