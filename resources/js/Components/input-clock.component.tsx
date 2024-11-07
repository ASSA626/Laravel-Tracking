import { ChangeEvent, useState } from "react";

interface InputParams {
    id?: string,
    type?: string,
    name?: string,
    label?: string,
    value?: string | number,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    error?: string,
    disabled?: boolean,
    placeholder?: string
}

const InputClock = ({ id, type, name, label, value, onChange, error, disabled, placeholder }: InputParams) => {

    const [focused, setFocused] = useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    const formatTime = (inputValue: string) => {
        let cleanedValue = inputValue.replace(/\D/g, "")

        if (cleanedValue.length > 4) cleanedValue = cleanedValue.slice(0, 4)
        if (cleanedValue.length >= 3) {
            cleanedValue = `${cleanedValue.slice(0, cleanedValue.length - 2)}:${cleanedValue.slice(-2)}`
        }
        
        return cleanedValue
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatTime(e.target.value)
        onChange({ ...e, target: { ...e.target, value: formattedValue } })
    }

    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                name={name}
                className={"w-full p-[10px] border border-gray-400 rounded-md outline-none text-[#000] text-md " + (error && "border-2 border-red-500")}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
            />
            <label
                htmlFor={id}
                className={`absolute right-0 p-[10px] text-md pointer-events-none text-gray-600 transition-all duration-300 ${
                    focused || value
                        ? `-top-3 text-[0.7rem] bg-white py-[2px] px-[10px] mr-2 rounded-sm ${error && "text-red-500"}`
                        : `top-0 ${error && "text-red-500"}`
                }`}
            >
                {label}
            </label>
            {
                error && <p className="mt-2 text-red-500 text-[15px] font-bold">{error}</p>
            }
        </div>
    )
}

export default InputClock