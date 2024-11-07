import { Dialog, DialogContent } from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import Textarea from "@/Components/Textarea.component";
import { useMediaQuery } from "react-responsive";
import toast from "react-hot-toast";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import SelectBox from "@/Components/SelectBox.component";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import DatepickerInput from "@/Components/datepicker.component";

interface UserVacationParams {
    state?: boolean,
    setState?: ((open: boolean) => void)
}

const UserVacationModal = ({ state, setState }: UserVacationParams) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const { data, setData, post, errors, processing, reset } = useForm({
        date_of_request: '',
        of_time: '',
        to_time: '',
        type: '',
        caption: ''
    })

    const handleDateOfReq = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("date_of_request", selectedDate)
    }

    const handleOfTime = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("of_time", selectedDate)
    }

    const handleToTime = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("to_time", selectedDate)
    }

    const handleVacation = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('vacation.store'), {
            onSuccess: () => {
                reset()
                if (setState) setState(false)
                toast.success("درخواست مرخصی شما ثبت شد")
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold">فرم درخواست مرخصی</h1>

                    <form className="mt-5" onSubmit={handleVacation}>
                        <div className="flex flex-col gap-7 w-full">
                            <DatepickerInput id="date_of_request" name="date_of_request" label="تاریخ درخواست" value={data.date_of_request} onChange={handleDateOfReq} />

                            <SelectBox id="type" name="type" label="نوع مرخصی" value={data.type} onChange={(e) => setData("type", e.target.value)} error={errors.type}>
                                <option hidden></option>
                                <option value="استقفاقی">استقفاقی</option>
                                <option value="استحلاقی">استحلاقی</option>
                                <option value="بدون حقوق">بدون حقوق</option>
                                <option value="ساعتی">ساعتی</option>
                            </SelectBox>

                            {
                                data.type === 'ساعتی' ?
                                    <div className="flex items-center gap-2">
                                        <Input id="of_time" type="text" name="to_time" label="از ساعت..."
                                            value={data.of_time} onChange={(e) => setData("of_time", e.target.value)}
                                            error={errors.of_time} />
                                        <Input id="of_time" type="text" name="to_time" label="تا ساعت..."
                                            value={data.to_time} onChange={(e) => setData("to_time", e.target.value)}
                                            error={errors.to_time} />
                                    </div>
                                    :
                                    <div className="flex items-center gap-2">
                                        <DatepickerInput id="of_time" name="of_time" label="از تاریخ..." value={data.of_time} onChange={handleOfTime} />
                                        <DatepickerInput id="to_time" name="to_time" label="تا تاریخ..." value={data.to_time} onChange={handleToTime} />
                                    </div>
                            }
                            <Textarea id="caption" name="caption" label="توضیحات (اختیاری)..." value={data.caption}
                                onChange={(e) => setData("caption", e.target.value)} error={errors.caption} />
                        </div>

                        <div className="mt-4">
                            <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-xl text-md w-full"
                                disabled={processing}>
                                ثبت درخواست مرخصی
                            </button>
                        </div>
                    </form>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold">فرم درخواست مرخصی</h1>

                <form className="mt-5" onSubmit={handleVacation}>
                    <div className="flex flex-col gap-7 w-full">
                        <DatepickerInput id="date_of_request" name="date_of_request" label="تاریخ درخواست" value={data.date_of_request} onChange={handleDateOfReq} />

                        <SelectBox id="type" name="type" label="نوع مرخصی" value={data.type} onChange={(e) => setData("type", e.target.value)} error={errors.type}>
                            <option hidden></option>
                            <option value="استقفاقی">استقفاقی</option>
                            <option value="استحلاقی">استحلاقی</option>
                            <option value="بدون حقوق">بدون حقوق</option>
                            <option value="ساعتی">ساعتی</option>
                        </SelectBox>

                        {
                            data.type === 'ساعتی' ?
                                <div className="flex items-center gap-2">
                                    <Input id="of_time" type="text" name="to_time" label="از ساعت..."
                                        value={data.of_time} onChange={(e) => setData("of_time", e.target.value)}
                                        error={errors.of_time} />
                                    <Input id="of_time" type="text" name="to_time" label="تا ساعت..."
                                        value={data.to_time} onChange={(e) => setData("to_time", e.target.value)}
                                        error={errors.to_time} />
                                </div>
                                :
                                <div className="flex items-center gap-2">
                                    <DatepickerInput id="of_time" name="of_time" label="از تاریخ..." value={data.of_time} onChange={handleOfTime} />
                                    <DatepickerInput id="to_time" name="to_time" label="تا تاریخ..." value={data.to_time} onChange={handleToTime} />
                                </div>
                        }

                        <Textarea id="caption" name="caption" label="توضیحات (اختیاری)..." value={data.caption}
                            onChange={(e) => setData("caption", e.target.value)} error={errors.caption} />
                    </div>

                    <div className="mt-4">
                        <button type="submit"
                            className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full"
                            disabled={processing}>ثبت درخواست مرخصی
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserVacationModal
