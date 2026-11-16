import type { InputHTMLAttributes } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'motion/react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'title'> {
    title: string
    icon: IconDefinition
    name: string,
    test?: RegExp,
    warningMessage?: string
}

import { useState } from 'react'

export default function Input({ title, icon, name, type = 'text', test, warningMessage, ...props }: InputProps) {
    const [currentValue, setCurrentValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrentValue(value);
        if (test) {
            setIsValid(test.test(value));
        }
    };

    const messagesTest = (currentValue != '') ? isValid ?
        'Formato válido' : warningMessage || 'Este campo no tiene un formato válido'
        : '';
    const colorIcon = (currentValue != '') ? isValid ? 'text-green-500' : 'text-red-500' : 'hidden!';

    return (
        <span>
            <div className="relative w-full rounded-lg bg-gray-200 p-3 pt-3.5 text-sm text-gray-800 flex items-center gap-1.5 inset-shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                <FontAwesomeIcon icon={icon} className="text-gray-400 text-xs" />

                <input
                    id={name}
                    name={name}
                    type={type}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none outline-none focus:ring-0"
                    {...props}
                />

                <label
                    htmlFor={name}
                    className="absolute -top-3 rounded-3xl bg-gray-100 p-1 px-3 text-[10px] text-gray-500"
                >
                    {title}
                </label>
            </div>
            <AnimatePresence initial={false}>
                {test && (
                    <motion.div
                        key={messagesTest}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-start mt-2 flex items-center gap-1">
                            <FontAwesomeIcon icon={faCircleInfo} className={colorIcon} />
                            {messagesTest}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    )
}