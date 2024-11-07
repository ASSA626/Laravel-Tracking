import {ChangeEvent, useState} from "react";

interface TextareaParams {
    id?: string,
    name?: string,
    label?: string,
    classsName?: string,
    value?: string,
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    error?: string
}

const Textarea = ({id, name, label, value, onChange, error, classsName}: TextareaParams) => {

    const [focused, setFocused] = useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    return (
        <div className={"relative " + (classsName ? classsName : "w-full")}>
                <textarea
                    id={id}
                    name={name}
                    className={"w-full p-[10px] border border-gray-400 rounded-md outline-none text-[#000] text-md h-[120px] resize-none " + (error && "border-2 border-red-500")}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={onChange}
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

export default Textarea
