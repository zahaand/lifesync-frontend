import {useState, useEffect} from 'react'
import {useSearchParams, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslation} from 'react-i18next'
import {Loader2} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {registerSchema, loginSchema} from '@/types/auth'
import {useRegister, useLogin} from '@/hooks/useAuth'
import {useAuthStore, selectIsAuthenticated} from '@/stores/authStore'
import type {RegisterRequest, LoginRequest} from '@/types/auth'

function RegisterForm({onSuccess}: { onSuccess: () => void }) {
    const {t} = useTranslation('auth')
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: {errors},
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
    })

    const mutation = useRegister(setError)
    const values = watch()

    const onSubmit = (data: RegisterRequest) => {
        mutation.mutate(data, {onSuccess})
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {errors.root && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                    {errors.root.message}
                </div>
            )}

            <div>
                <Label htmlFor="register-email" className="mb-1 block text-[12px] font-medium text-[#666360] dark:text-zinc-500">
                    {t('register.email')}
                </Label>
                <Input
                    id="register-email"
                    data-testid="email-input"
                    type="email"
                    placeholder={t('register.emailPlaceholder')}
                    className={`h-[36px] rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-3 text-[13px] text-[#2C2C2A] dark:text-zinc-50 placeholder:text-[#9E9B94] dark:placeholder:text-zinc-600 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.email ? 'bg-[#F5F4F0] dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}`}
                    {...register('email')}
                />
                {errors.email && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="register-username" className="mb-1 block text-[12px] font-medium text-[#666360] dark:text-zinc-500">
                    {t('register.username')}
                </Label>
                <Input
                    id="register-username"
                    data-testid="username-input"
                    type="text"
                    placeholder={t('register.usernamePlaceholder')}
                    className={`h-[36px] rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-3 text-[13px] text-[#2C2C2A] dark:text-zinc-50 placeholder:text-[#9E9B94] dark:placeholder:text-zinc-600 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.username ? 'bg-[#F5F4F0] dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}`}
                    {...register('username')}
                />
                {errors.username ? (
                    <p className="mt-1 text-[12px] text-red-600">{errors.username.message}</p>
                ) : (
                    <p className="mt-1 text-[11px] text-[#9E9B94] dark:text-zinc-600">{t('register.usernameHint')}</p>
                )}
            </div>

            <div>
                <Label htmlFor="register-password" className="mb-1 block text-[12px] font-medium text-[#666360] dark:text-zinc-500">
                    {t('register.password')}
                </Label>
                <Input
                    id="register-password"
                    data-testid="register-password-input"
                    type="password"
                    placeholder={t('register.passwordHint')}
                    className={`h-[36px] rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-3 text-[13px] text-[#2C2C2A] dark:text-zinc-50 placeholder:text-[#9E9B94] dark:placeholder:text-zinc-600 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.password ? 'bg-[#F5F4F0] dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                data-testid="submit-button"
                disabled={mutation.isPending}
                className="mt-2 h-[38px] w-full rounded-lg bg-[#534AB7] text-[13px] font-medium text-[#EEEDFE] hover:bg-[#3C3489]"
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                        {t('register.submitting')}
                    </>
                ) : (
                    t('register.submit')
                )}
            </Button>
        </form>
    )
}

function LoginForm() {
    const {t} = useTranslation('auth')
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: {errors},
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    })

    const mutation = useLogin(setError)
    const values = watch()

    const onSubmit = (data: LoginRequest) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {errors.root && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                    {errors.root.message}
                </div>
            )}

            <div>
                <Label htmlFor="login-identifier" className="mb-1 block text-[12px] font-medium text-[#666360] dark:text-zinc-500">
                    {t('login.emailOrUsername')}
                </Label>
                <Input
                    id="login-identifier"
                    data-testid="identifier-input"
                    type="text"
                    placeholder={t('register.emailPlaceholder')}
                    className={`h-[36px] rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-3 text-[13px] text-[#2C2C2A] dark:text-zinc-50 placeholder:text-[#9E9B94] dark:placeholder:text-zinc-600 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.identifier ? 'bg-[#F5F4F0] dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}`}
                    {...register('identifier')}
                />
                {errors.identifier ? (
                    <p className="mt-1 text-[12px] text-red-600">{errors.identifier.message}</p>
                ) : (
                    <p className="mt-1 text-[11px] text-[#9E9B94] dark:text-zinc-600">{t('login.emailOrUsernameHint')}</p>
                )}
            </div>

            <div>
                <Label htmlFor="login-password" className="mb-1 block text-[12px] font-medium text-[#666360] dark:text-zinc-500">
                    {t('login.password')}
                </Label>
                <Input
                    id="login-password"
                    data-testid="password-input"
                    type="password"
                    placeholder="••••••••"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-3 text-[13px] text-[#2C2C2A] dark:text-zinc-50 placeholder:text-[#9E9B94] dark:placeholder:text-zinc-600 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.password ? 'bg-[#F5F4F0] dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                data-testid="submit-button"
                disabled={mutation.isPending}
                className="mt-2 h-[38px] w-full rounded-lg bg-[#534AB7] text-[13px] font-medium text-[#EEEDFE] hover:bg-[#3C3489]"
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                        {t('login.submitting')}
                    </>
                ) : (
                    t('login.submit')
                )}
            </Button>
        </form>
    )
}

export default function LoginPage() {
    const {t} = useTranslation('auth')
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore(selectIsAuthenticated)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const activeTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin'

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', {replace: true})
        }
    }, [isAuthenticated, navigate])

    const handleTabChange = (tab: string) => {
        setSearchParams({tab}, {replace: true})
        setSuccessMessage(null)
    }

    const handleRegisterSuccess = () => {
        setSearchParams({tab: 'signin'}, {replace: true})
        setSuccessMessage(t('register.success'))
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F1EFE8] dark:bg-background">
            <div className="w-full max-w-[380px] rounded-xl border border-[#C7C4BB] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
                {/* Logo */}
                <div className="mb-5 text-center">
                    <span className="text-[22px] font-semibold tracking-tight text-[#534AB7]">
                        LifeSync
                    </span>
                </div>

                {/* Title + Subtitle */}
                <div className="mb-5 text-center">
                    <h1 className="text-[18px] font-semibold text-[#2C2C2A] dark:text-zinc-50">
                        {activeTab === 'signin' ? t('login.title') : t('register.title')}
                    </h1>
                    <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">
                        {activeTab === 'signin'
                            ? t('login.subtitle')
                            : t('register.subtitle')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-5 grid h-[34px] grid-cols-2 overflow-hidden rounded-lg border border-[#C7C4BB] dark:border-zinc-800">
                    <Button
                        type="button"
                        variant="ghost"
                        data-testid="sign-in-tab"
                        onClick={() => handleTabChange('signin')}
                        className={`h-full rounded-none border-0 text-[13px] font-medium transition-colors ${
                            activeTab === 'signin'
                                ? 'bg-[#534AB7] text-[#EEEDFE] hover:bg-[#534AB7] hover:text-[#EEEDFE]'
                                : 'bg-white dark:bg-zinc-900 text-[#666360] dark:text-zinc-500 hover:bg-[#F5F4F0] dark:hover:bg-zinc-800'
                        }`}
                    >
                        {t('login.submit')}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        data-testid="sign-up-tab"
                        onClick={() => handleTabChange('signup')}
                        className={`h-full rounded-none border-0 text-[13px] font-medium transition-colors ${
                            activeTab === 'signup'
                                ? 'bg-[#534AB7] text-[#EEEDFE] hover:bg-[#534AB7] hover:text-[#EEEDFE]'
                                : 'bg-white dark:bg-zinc-900 text-[#666360] dark:text-zinc-500 hover:bg-[#F5F4F0] dark:hover:bg-zinc-800'
                        }`}
                    >
                        {t('register.submit')}
                    </Button>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="mb-3 rounded-lg border border-[#9FE1CB] dark:border-emerald-800 bg-[#E1F5EE] dark:bg-emerald-900/20 p-3 text-[13px] text-[#085041] dark:text-emerald-300">
                        {successMessage}
                    </div>
                )}

                {/* Forms */}
                {activeTab === 'signin' ? <LoginForm/> : <RegisterForm onSuccess={handleRegisterSuccess}/>}
            </div>
        </div>
    )
}
