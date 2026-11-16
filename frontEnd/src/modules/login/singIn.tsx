import { useState } from 'react'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import bgLogin from '@src/assets/bg-login.jpg'
import shop from '@src/assets/ilustration_shop.png'

// Components
import Input from './components/inputs.tsx'
import TabLoginButton from './components/TabButton.tsx'
import { GoogleLogin } from '@react-oauth/google'
import Swal from 'sweetalert2'
import HomeLink from './components/homeLink.tsx'

// utils
import { handleSubmit, authSubmit } from './utils/singFetch.tsx';
import getCredentials from '@src/shared/tools/getCrendentials.ts'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'

// config
const TABS = [
    { text: 'Login', state: true, path: '/login' },
    { text: 'Registrarse', state: false, path: '/register' },
]

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

const card = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { ...spring, staggerChildren: 0.07, delayChildren: 0.2 },
    },
}

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: spring },
}

export default function SingIn() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    getCredentials();

    return (
        <AnimatePresence mode="wait">
            <motion.main
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-x-hidden bg-cover bg-center p-8 sm:gap-6 lg:flex-row lg:gap-8"
                style={{ backgroundImage: `url(${bgLogin})` }}
            >
                <motion.section
                    initial={{ opacity: 0, x: -48 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 }}
                    className="flex w-full max-w-[700px] items-center justify-center max-xl:max-w-[480px] max-lg:max-w-md max-sm:max-w-xs"
                >
                    <motion.img
                        src={shop}
                        alt="Ilustración Tienda"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-auto w-full object-contain max-lg:max-h-[40vh] max-sm:max-h-[32vh]"
                    />
                </motion.section>

                <div className="w-full max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md">
                    <motion.form
                        variants={card}
                        initial="hidden"
                        animate="show"
                        onSubmit={(e) => { handleSubmit(e, navigate) }}
                        className="rounded-2xl border-2 border-[#c27d38] bg-white p-4 text-center shadow-2xl sm:rounded-[28px] sm:border-4 sm:p-6"
                    >
                        <motion.img variants={item} src={'/mandao-logo.svg'} className='mx-auto mb-3 h-10 w-10 rounded-full bg-gray-500 sm:mb-4 sm:h-12 sm:w-12' />
                        <motion.h1 variants={item} className="text-xl font-bold text-gray-900 sm:text-2xl">MiMandado</motion.h1>
                        <motion.p variants={item} className="mb-4 text-sm text-gray-700 sm:mb-6 sm:text-base">
                            Bienvenido de vuelta a tu app preferida
                        </motion.p>

                        <motion.section variants={item} className="mb-3 flex w-full flex-col gap-4 sm:gap-6">
                            <Input
                                title="Correo Electrónico"
                                name="email"
                                icon={faUser}
                                type="email"
                                placeholder="xxxxx@gmail.com"
                                autoComplete="email"
                                required
                            />
                            <Input
                                title="Contraseña"
                                name="password"
                                icon={faLock}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </motion.section>

                        <motion.label variants={item} className="mb-4 flex cursor-pointer select-none items-center gap-1.5 text-xs text-gray-800">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="rounded accent-indigo-600"
                            />
                            Mostrar contraseña
                        </motion.label>

                        <motion.button
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 py-2.5 text-lg font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 sm:text-xl"
                        >
                            Entrar
                        </motion.button>

                        <motion.p variants={item} className="my-2 text-xs font-medium text-gray-500 sm:text-sm">O</motion.p>

                        <motion.div variants={item} className="flex justify-center">
                            <GoogleLogin
                                onSuccess={(e) => { authSubmit(e, navigate) }}
                                onError={() => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Error al iniciar con google, compruebe su conexion a internet.'
                                    });
                                }}
                            />
                        </motion.div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.8 }}
                        className="mt-0 flex justify-center gap-3 sm:gap-6"
                    >
                        {TABS.map((tab) => (
                            <TabLoginButton path={tab.path} key={tab.text} text={tab.text} state={tab.state} />
                        ))}
                    </motion.div>
                </div>
            </motion.main>
            <HomeLink></HomeLink>
        </AnimatePresence>
    )
}