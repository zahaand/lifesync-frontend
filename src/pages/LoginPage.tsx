import {useState, useEffect} from 'react'
import {useSearchParams, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Loader2} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {registerSchema, loginSchema} from '@/types/auth'
import {useRegister, useLogin} from '@/hooks/useAuth'
import {useAuthStore, selectIsAuthenticated} from '@/stores/authStore'
import type {RegisterRequest, LoginRequest} from '@/types/auth'

function RegisterForm({onSuccess}: { onSuccess: () => void }) {
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
                <Label htmlFor="register-email" className="mb-1 block text-[12px] font-medium text-[#666360]">
                    Email
                </Label>
                <Input
                    id="register-email"
                    type="email"
                    placeholder="alice@example.com"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] px-3 text-[13px] text-[#2C2C2A] placeholder:text-[#9E9B94] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.email ? 'bg-[#F5F4F0]' : 'bg-white'}`}
                    {...register('email')}
                />
                {errors.email && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="register-username" className="mb-1 block text-[12px] font-medium text-[#666360]">
                    Username
                </Label>
                <Input
                    id="register-username"
                    type="text"
                    placeholder="alice-dev"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] px-3 text-[13px] text-[#2C2C2A] placeholder:text-[#9E9B94] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.username ? 'bg-[#F5F4F0]' : 'bg-white'}`}
                    {...register('username')}
                />
                {errors.username ? (
                    <p className="mt-1 text-[12px] text-red-600">{errors.username.message}</p>
                ) : (
                    <p className="mt-1 text-[11px] text-[#9E9B94]">3–32 characters: letters, digits, _ and -</p>
                )}
            </div>

            <div>
                <Label htmlFor="register-password" className="mb-1 block text-[12px] font-medium text-[#666360]">
                    Password
                </Label>
                <Input
                    id="register-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] px-3 text-[13px] text-[#2C2C2A] placeholder:text-[#9E9B94] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.password ? 'bg-[#F5F4F0]' : 'bg-white'}`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 h-[38px] w-full rounded-lg bg-[#534AB7] text-[13px] font-medium text-[#EEEDFE] hover:bg-[#3C3489]"
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                        Creating account...
                    </>
                ) : (
                    'Create account'
                )}
            </Button>
        </form>
    )
}

function LoginForm() {
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
                <Label htmlFor="login-email" className="mb-1 block text-[12px] font-medium text-[#666360]">
                    Email or username
                </Label>
                <Input
                    id="login-email"
                    type="email"
                    placeholder="alice@example.com"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] px-3 text-[13px] text-[#2C2C2A] placeholder:text-[#9E9B94] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.email ? 'bg-[#F5F4F0]' : 'bg-white'}`}
                    {...register('email')}
                />
                {errors.email ? (
                    <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
                ) : (
                    <p className="mt-1 text-[11px] text-[#9E9B94]">You can sign in with either email or username</p>
                )}
            </div>

            <div>
                <Label htmlFor="login-password" className="mb-1 block text-[12px] font-medium text-[#666360]">
                    Password
                </Label>
                <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-[36px] rounded-lg border-[#C7C4BB] px-3 text-[13px] text-[#2C2C2A] placeholder:text-[#9E9B94] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7] ${values.password ? 'bg-[#F5F4F0]' : 'bg-white'}`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
                )}
                <div className="mt-[-4px] mb-3 text-right">
                    <Button type="button" variant="link" className="h-auto p-0 text-[12px] text-[#534AB7] hover:underline">
                        Forgot password?
                    </Button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 h-[38px] w-full rounded-lg bg-[#534AB7] text-[13px] font-medium text-[#EEEDFE] hover:bg-[#3C3489]"
            >
                {mutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>
        </form>
    )
}

export default function LoginPage() {
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
        setSuccessMessage('Account created successfully. Please sign in.')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F1EFE8]">
            <div className="w-full max-w-[380px] rounded-xl border border-[#C7C4BB] bg-white p-8">
                {/* Logo */}
                <div className="mb-5 text-center">
                    <span className="text-[22px] font-semibold tracking-tight text-[#534AB7]">
                        LifeSync
                    </span>
                </div>

                {/* Title + Subtitle */}
                <div className="mb-5 text-center">
                    <h1 className="text-[18px] font-semibold text-[#2C2C2A]">
                        {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p className="text-[13px] text-[#9E9B94]">
                        {activeTab === 'signin'
                            ? 'Sign in to continue'
                            : 'Start tracking habits and goals'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-5 grid h-[34px] grid-cols-2 overflow-hidden rounded-lg border border-[#C7C4BB]">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleTabChange('signin')}
                        className={`h-full rounded-none border-0 text-[13px] font-medium transition-colors ${
                            activeTab === 'signin'
                                ? 'bg-[#534AB7] text-[#EEEDFE] hover:bg-[#534AB7] hover:text-[#EEEDFE]'
                                : 'bg-white text-[#666360] hover:bg-[#F5F4F0]'
                        }`}
                    >
                        Sign in
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleTabChange('signup')}
                        className={`h-full rounded-none border-0 text-[13px] font-medium transition-colors ${
                            activeTab === 'signup'
                                ? 'bg-[#534AB7] text-[#EEEDFE] hover:bg-[#534AB7] hover:text-[#EEEDFE]'
                                : 'bg-white text-[#666360] hover:bg-[#F5F4F0]'
                        }`}
                    >
                        Sign up
                    </Button>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="mb-3 rounded-lg border border-[#9FE1CB] bg-[#E1F5EE] p-3 text-[13px] text-[#085041]">
                        {successMessage}
                    </div>
                )}

                {/* Forms */}
                {activeTab === 'signin' ? <LoginForm/> : <RegisterForm onSuccess={handleRegisterSuccess}/>}
            </div>
        </div>
    )
}
