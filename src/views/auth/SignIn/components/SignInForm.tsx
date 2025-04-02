import { useState, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PasswordInput from '@/components/shared/PasswordInput'
import { Form, FormItem } from '@/components/ui/Form'
import classNames from '@/utils/classNames'
import AuthContext from '@/auth/AuthContext'
import type { SignInCredential } from '@/@types/auth'

type SignInFormSchema = SignInCredential

const validationSchema = z.object({
    email: z.string().min(1, { message: 'Introduce tu email' }),
    password: z.string().min(1, { message: 'Introduce tu contraseña' }),
})

type Props = {
    setMessage?: (msg: string) => void
    disableSubmit?: boolean
    passwordHint?: React.ReactNode
    className?: string
}

const SignInForm = ({
    setMessage,
    disableSubmit,
    passwordHint,
    className,
}: Props) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const { signIn } = useContext(AuthContext)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSignIn = async (values: SignInFormSchema) => {
        setSubmitting(true)

        const result = await signIn(values)

        if (result.status === 'success') {
            // redirección automática la hace AuthProvider
        } else {
            if (setMessage) setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label="Email"
                    invalid={!!errors.email}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Contraseña"
                    invalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                type="password"
                                placeholder="Contraseña"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {passwordHint}

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    disabled={disableSubmit}
                >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
