import {FormEvent} from "react";
import {useForm} from "@inertiajs/react";
import {AdminDuties} from "@/types";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import DatepickerInput from "@/Components/datepicker.component";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import toast from "react-hot-toast";
import {useMediaQuery} from "react-responsive";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface ReportsAddDutyClockProps {
    state: boolean,
    setState: ((open: boolean) => void),
    duties: AdminDuties[],
    user_id: number
}

const ReportsAddDutyClockModal = ({state, setState, duties, user_id}: ReportsAddDutyClockProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const {data, setData, post, processing, errors, reset} = useForm({
        created_at: '',
        start_time: '',
        left_time: '',
        duty_id: '',
    })

    const handleCreatedAt = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("created_at", selectedDate)
    }

    const handleCreateDutyClock = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('report.crate.dutyclock', user_id), {
            onSuccess: () => {
                toast.success("ساعت ماموریت با موفقیت ثبت شد")
                reset()
                if (setState) setState(false)
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت ساعت ماموریت جدید</h1>

                    <form className="mt-5 flex flex-col gap-6" onSubmit={handleCreateDutyClock}>
                        <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at} onChange={handleCreatedAt}/>

                        <div className="flex items-center gap-3">
                            <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                            <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                        </div>

                        <SelectBox id="duty" name="duty" label="انتخاب ماموریت" value={data.duty_id} onChange={(e) => setData("duty_id", e.target.value)} error={errors.duty_id}>
                            <option hidden></option>

                            {
                                duties.map((duty, i) => (
                                    <option value={duty.id} key={i}>{duty.project} - {duty.place}</option>
                                ))
                            }
                        </SelectBox>

                        <div className="mt-4">
                            <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                                ثبت ساعت ماموریت
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
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت ساعت ماموریت جدید</h1>

                <form className="mt-5 flex flex-col gap-6" onSubmit={handleCreateDutyClock}>
                    <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at} onChange={handleCreatedAt}/>

                    <div className="flex items-center gap-3">
                        <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                        <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                    </div>

                    <SelectBox id="duty" name="duty" label="انتخاب ماموریت" value={data.duty_id} onChange={(e) => setData("duty_id", e.target.value)} error={errors.duty_id}>
                        <option hidden></option>

                        {
                            duties.map((duty, i) => (
                                <option value={duty.id} key={i}>{duty.project} - {duty.place}</option>
                            ))
                        }
                    </SelectBox>

                    <div className="mt-4">
                        <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                            ثبت ساعت ماموریت
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportsAddDutyClockModal
