import {ChangeEvent, ReactNode, useState} from "react";

interface InputParams {
    id?: string,
    type?: string,
    name?: string,
    label?: string,
    value?: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    error?: string,
    icon?: ReactNode
}

const Input = ({id, type, name, label, value, onChange, error, icon}: InputParams) => {

    const [focused, setFocused] = useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    return (
        <div className="relative flex flex-col my-[20px]">
            <input
                id={id}
                type={type}
                name={name}
                className="w-full h-[55px] text-[16px] bg-transparent text-white px-[20px] border-2 border-[#c6c3c3] rounded-full outline-none"
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={onChange}
            />

            <label
                htmlFor={id}
                className={`absolute transition-all duration-300 pointer-events-none ${
                    focused || value ?
                        'top-[-10px] right-[20px] text-[14px] bg-[#c6c3c3] rounded-full text-black px-[10px]'
                        : 'top-[15px] right-[20px]'
                }`}
            >
                {label}
            </label>

            {icon}
        </div>
    )
}

export default Input
