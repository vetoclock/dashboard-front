import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/@types/auth'

/* ----------- Sesión + Usuario ----------- */
type Session = { signedIn: boolean }
type AuthState = {
    session: Session
    user: User
}
type AuthAction = {
    setSessionSignedIn: (value: boolean) => void
    setUser: (user: User) => void
}

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            session: { signedIn: false },
            user: {
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            },
            setSessionSignedIn: (signedIn) =>
                set((s) => ({
                    session: { ...s.session, signedIn },
                })),
            setUser: (user) => set(() => ({ user })),
        }),
        {
            name: 'sessionUser',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

/* ------------- Token ------------- */
type TokenStore = {
    token: string
    setToken: (token: string) => void
}

export const useToken = create<TokenStore>()(
    persist(
        (set) => ({
            token: '',
            setToken: (token) => {
                set({ token })
            },
        }),
        {
            name: 'auth-token',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
