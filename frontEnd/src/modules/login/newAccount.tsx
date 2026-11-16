import bgLogin from '@src/assets/bg-login.jpg'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'

// config
const TABS = [
    { text: 'Login', state: false, path: '/login' },
    { text: 'Registrarse', state: true, path: '/register' },
]
import { authGoogle, handleSubmit } from './utils/controlsRegister.tsx'

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

// ---- Components
import Input from './components/inputs.tsx'
import TextArea from './components/textArea.tsx'
import TabLoginButton from './components/TabButton.tsx';
import Map from './components/Map.tsx'
import HomeLink from './components/homeLink.tsx'
import NewAPassword from './components/newAPassword.tsx'

import { GoogleLogin } from '@react-oauth/google'
import dataProcessG from '@src/context/login/proccessGoogleAc.tsx';

export default function NewAccount() {
    const navigate = useNavigate();
    const setProcessGoogleAc = dataProcessG((state) => state.setData);
    return (
        <>
            <AnimatePresence mode="wait">
                <motion.main
                    key="register"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="min-h-screen h-auto bg-cover bg-center flex flex-col items-center justify-center px-3 py-6 sm:p-5 relative overflow-x-hidden"
                    style={{ backgroundImage: `url(${bgLogin})` }}
                >
                    {/* Formulario y Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={spring}
                        className="rounded-2xl sm:rounded-[28px] border-2 sm:border-4 border-[#c27d38] bg-white p-4 sm:p-6 text-center shadow-2xl w-full max-w-md md:max-w-3xl"
                    >
                        <header>
                            <img src="/mandao-logo.svg" className='mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover' />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                MiMandado
                            </h1>
                            <p className="mb-5 sm:mb-6 text-sm sm:text-base text-gray-700">
                                Crea tu cuenta y descubre tu nueva app preferida
                            </p>
                        </header>

                        <form
                            onSubmit={(e) => { handleSubmit(e, navigate) }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                            method="POST"
                            encType="multipart/form-data"
                        >
                            <section className="w-full flex flex-col gap-4 sm:gap-6 md:mb-3">
                                <Input
                                    title="Nombre"
                                    placeholder="Nombre de usuario"
                                    type={'text'}
                                    name="nombre"
                                    icon={faUser}
                                />
                                <Input
                                    title="Telefono"
                                    placeholder="+1 (829)-xxx-xxxx"
                                    type={'text'}
                                    name="phone"
                                    icon={faUser}
                                />

                                <Input
                                    title="Correo"
                                    placeholder="abc@gmail.com"
                                    type={'email'}
                                    name="email"
                                    icon={faUser}
                                    test={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
                                    warningMessage="El email debe ser de la forma xxxxx@xxx.com"
                                />

                                {/* Contraseña separada y aislada de conflictos de render */}
                                <NewAPassword></NewAPassword>
                            </section>

                            <section className="w-full flex flex-col gap-4 sm:gap-6 md:gap-7 md:mb-3">
                                <Map />

                                <TextArea
                                    title="Dirección"
                                    holder="Av. 27 de febrero, al lado de xxxxx"
                                    name="detail_address"
                                    icon={faLock}
                                ></TextArea>
                            </section>

                            <section className="md:col-span-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 justify-between w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    className="w-full rounded-md bg-indigo-600 py-2.5 sm:py-2 text-lg sm:text-xl font-medium text-white transition-colors hover:bg-indigo-700"
                                >
                                    Registrarse
                                </motion.button>

                                <p className="text-xs sm:text-sm font-medium text-gray-500">O</p>

                                <GoogleLogin
                                    onSuccess={(e) => { authGoogle(e, navigate, setProcessGoogleAc) }}
                                    onError={() => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al iniciar con google, compruebe su conexion a internet o intente de nuevo.'
                                        });
                                    }}
                                />
                            </section>
                        </form>
                    </motion.div>

                    {/* Tabs / Conectores */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.3 }}
                        className="flex justify-center gap-3 sm:gap-6 mt-0"
                    >
                        {TABS.map((tab) => (
                            <TabLoginButton path={tab.path} key={tab.text} text={tab.text} state={tab.state} />
                        ))}
                    </motion.div>
                </motion.main>
            </AnimatePresence>
            <HomeLink></HomeLink>
        </>
    )
}