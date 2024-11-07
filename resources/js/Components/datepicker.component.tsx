import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { useState } from "react";

interface DatepickerParams {
    id?: string,
    name?: string,
    label?: string,
    value?: string | number | null,
    onChange: any
    error?: string,
}

interface RenderDatePicker {
    openCalendar: () => void;
    value: string | number | null | DateObject;
    handleValueChange: (value: string | number | DateObject) => void;
}

const DatepickerInput = ({ value, id, error, onChange, label }: DatepickerParams) => {

    const [focused, setFocused] = useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = () => setFocused(false)

    return (
        <div className="relative w-full">
            <DatePicker
                inputClass={"w-full p-[10px] border border-gray-400 rounded-md outline-none text-[#000] text-md " + (error && "border-2 border-red-500")}
                containerClassName="w-full"
                value={value}
                onChange={onChange}
                calendar={persian}
                locale={persian_fa}
                render={
                    (value, openCalendar, handleValueChange) => (
                      <input
                        type="text"
                        className={"w-full p-[10px] border border-gray-400 rounded-md outline-none text-[#000] text-md " + (error && "border-2 border-red-500")}
                        value={value}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleValueChange}
                        onClick={openCalendar}
                      />
                    )
                }
            />
            <label
                htmlFor={id}
                className={`absolute right-0 p-[10px] text-md pointer-events-none text-gray-600 transition-all duration-300 ${focused || value
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

export default DatepickerInput
