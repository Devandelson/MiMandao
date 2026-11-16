import bgLogin from '@src/assets/bg-login.jpg'

import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import shop from '@src/assets/ilustration_shop.png'

// ---- Components
import Input from './components/inputs.tsx'
import TextArea from './components/textArea.tsx'
import swal from 'sweetalert2'
import Map from './components/Map.tsx'

import dataProcessG from '@src/context/login/proccessGoogleAc.tsx';
import { useEffect, useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { motion, AnimatePresence } from 'motion/react'

const urlHost = import.meta.env.VITE_API_URL;

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

export default function NewAccountGoogle() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const setDataGoogle = dataProcessG((state) => state.setData);

    const getCredentials = () => {
        try {
            const item = sessionStorage.getItem('credentialsGoogle');
            return item ? JSON.parse(item).state.data : null;
        } catch {
            return null;
        }
    };
    const dataGoogle = getCredentials();
    useEffect(() => {
        if (!dataGoogle) {
            Swal.fire({
                icon: 'error',
                text: 'Sesión acabada reintente de nuevo.'
            });
            navigate('/login');
        }
    }, [dataGoogle, navigate]);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!file) {
            return Swal.fire({
                'icon': 'error',
                title: 'No se ha proporcionado una imagen.'
            })
        } else {
            formData.append('map', file);
        };

        formData.append('email', dataGoogle.email);
        formData.append('name', dataGoogle.name);
        formData.append('password', dataGoogle.password);
        formData.append('type_check', 'google');

        const response = await fetch(`${urlHost}/login`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        const result = await response.json();
        if (!result.success) {
            return swal.fire({
                title: 'Error al crear la cuenta',
                text: result.error,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }

        setDataGoogle({
            email: '',
            name: '',
            password: '',
        })
        swal.fire({
            title: 'Cuenta creada correctamente',
            text: result.data,
            icon: 'success',
        });
        navigate('/login');
    }

    return (
        <AnimatePresence mode="wait">
            <motion.main
                key="new-account-google"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="min-h-screen bg-cover bg-center flex flex-col lg:flex-row items-center justify-center p-8 gap-4 sm:gap-6 lg:gap-8 relative overflow-x-hidden"
                style={{ backgroundImage: `url(${bgLogin})` }}
            >
                {/* Ilustración Shop */}
                <motion.section
                    initial={{ opacity: 0, x: -48 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 }}
                    className="w-full max-w-175 max-xl:max-w-120 max-lg:max-w-md max-sm:max-w-xs flex justify-center items-center"
                >
                    <motion.img
                        src={shop}
                        alt="Ilustración Tienda"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full h-auto object-contain max-lg:max-h-[40vh] max-sm:max-h-[32vh]"
                    />
                </motion.section>

                {/* Formulario y Tabs */}
                <div className="w-full max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md">
                    <motion.form
                        variants={card}
                        initial="hidden"
                        animate="show"
                        onSubmit={handleSubmit}
                        className="rounded-2xl sm:rounded-[28px] border-2 sm:border-4 border-[#c27d38] bg-white p-4 sm:p-6 text-center shadow-2xl"
                    >
                        <motion.img src="/mandao-logo.svg" variants={item}  className='mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-500' />
                        <motion.h1 variants={item} className="text-xl sm:text-2xl font-bold text-gray-900">
                            MiMandao
                        </motion.h1>
                        <motion.p variants={item} className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                            Completa los datos para poder realizar tus compras
                        </motion.p>

                        <motion.section variants={item} className="w-full flex flex-col gap-4 sm:gap-6 mb-3">
                            <Input
                                title="Telefono"
                                placeholder="+1 (829)-xxx-xxxx"
                                type='text'
                                name="phone"
                                icon={faUser}
                            />

                            <TextArea
                                title="Dirección"
                                holder="Av. 27 de febrero, al lado de xxxxx"
                                name="detail_address"
                                icon={faLock}
                            ></TextArea>

                            <Map onChange={setFile} />
                        </motion.section>

                        <motion.button
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 py-2.5 sm:py-2 text-lg sm:text-xl font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                            Completar los datos
                        </motion.button>
                    </motion.form>
                </div>
            </motion.main>
        </AnimatePresence>
    )
}