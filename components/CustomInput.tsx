"use client";

import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

interface CustomInput {
    control: Control<z.infer<ReturnType<typeof authFormSchema>>>,
    name: FieldPath<z.infer<ReturnType<typeof authFormSchema>>>,
    label: string,
    placeholder: string,
    options?: string[],
    icon?: React.ElementType
}

const CustomInput = ({ control, name, label, placeholder, options, icon: Icon }: CustomInput) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className="form-item">
                    <FormLabel className="form-label">
                        {label}
                    </FormLabel>
                    <div className="flex w-full flex-col">
                        <FormControl>
                            {options ? (
                                <select
                                    className="input-class"
                                    {...field}
                                >
                                    <option value="" disabled>{placeholder}</option>
                                    {options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="relative">
                                    {Icon && (
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Icon size={18} />
                                        </div>
                                    )}
                                    <Input
                                        placeholder={placeholder}
                                        className={`input-class ${Icon ? 'pl-10' : ''}`}
                                        type={name === 'password' ? 'password' : 'text'}
                                        {...field}
                                    />
                                </div>
                            )}
                        </FormControl>
                        <FormMessage className="form-message mt-2" />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomInput
