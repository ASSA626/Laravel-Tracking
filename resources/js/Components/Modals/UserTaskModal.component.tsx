import { Dialog, DialogContent } from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import Textarea from "@/Components/Textarea.component";
import { useMediaQuery } from "react-responsive";
import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import SelectBox from "@/Components/SelectBox.component";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import DatepickerInput from "@/Components/datepicker.component";
import {Project} from "@/types";

interface UserHomeworkParams {
    state?: boolean,
    setState?: ((open: boolean) => void),
    projects: Project[]
}

const UserTaskModal = ({ state, setState, projects }: UserHomeworkParams) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const { data, setData, post, errors, processing, reset } = useForm({
        date_of_request: '',
        of_date: '',
        to_date: '',
        project: '',
        place: '',
        transporter: '',
        description: ''
    })

    const handleDateOfReq = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("date_of_request", selectedDate)
    }

    const handleOfDate = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("of_date", selectedDate)
    }

    const handleToDate = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("to_date", selectedDate)
    }

    const handleTask = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('duty.store'), {
            onSuccess: () => {
                reset()
                if (setState) setState(false)
                toast.success("درخواست ماموریت شما با موفقیت ثبت شد")
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold">فرم درخواست ماموریت</h1>

                    <form className="mt-5" onSubmit={handleTask}>
                        <div className="flex flex-col gap-7 w-full">
                            <DatepickerInput id="date_of_request" name="date_of_request" label="تاریخ درخواست" value={data.date_of_request} onChange={handleDateOfReq} />

                            <div className="flex items-center gap-3">
                                <DatepickerInput id="of_date" name="of_date" label="از تاریخ..." value={data.of_date} onChange={handleOfDate} />
                                <DatepickerInput id="to_date" name="to_date" label="تا تاریخ..." value={data.to_date} onChange={handleToDate} />
                            </div>

                            <SelectBox id="project" name="project" label="پروژه مربوط به ماموریت" value={data.project}
                                onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                                <option hidden></option>
                                {
                                    projects.map((project, i) => (
                                        <option value={project.title} key={i}>{project.title}</option>
                                    ))
                                }
                            </SelectBox>

                            <div className="flex items-center gap-3">
                                <Input id="place" type="text" name="place" label="محل ماموریت" value={data.place}
                                    onChange={(e) => setData("place", e.target.value)} error={errors.place} />
                                <Input id="transporter" type="text" name="transporter" label="وسیله رفت و برگشت"
                                    value={data.transporter} onChange={(e) => setData("transporter", e.target.value)}
                                    error={errors.transporter} />
                            </div>

                            <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                value={data.description} onChange={(e) => setData("description", e.target.value)}
                                error={errors.description} />
                        </div>

                        <div className="mt-4">
                            <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-xl text-md w-full"
                                disabled={processing}>ثبت ماموریت جدید
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
                <h1 className="text-2xl mt-5 text-center font-bold">فرم درخواست ماموریت</h1>

                <form className="mt-5" onSubmit={handleTask}>
                    <div className="flex flex-col gap-7 w-full">
                        <DatepickerInput id="date_of_request" name="date_of_request" label="تاریخ درخواست" value={data.date_of_request} onChange={handleDateOfReq} />

                        <div className="flex items-center gap-3">
                            <DatepickerInput id="of_date" name="of_date" label="از تاریخ..." value={data.of_date} onChange={handleOfDate} />
                            <DatepickerInput id="to_date" name="to_date" label="تا تاریخ..." value={data.to_date} onChange={handleToDate} />
                        </div>

                        <SelectBox id="project" name="project" label="پروژه مربوط به ماموریت" value={data.project}
                            onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                            <option hidden></option>
                            {
                                projects.map((project, i) => (
                                    <option value={project.title} key={i}>{project.title}</option>
                                ))
                            }
                        </SelectBox>

                        <div className="flex items-center gap-3">
                            <Input id="place" type="text" name="place" label="محل ماموریت" value={data.place}
                                onChange={(e) => setData("place", e.target.value)} error={errors.place} />
                            <Input id="transporter" type="text" name="transporter" label="وسیله رفت و برگشت"
                                value={data.transporter} onChange={(e) => setData("transporter", e.target.value)}
                                error={errors.transporter} />
                        </div>

                        <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                            value={data.description} onChange={(e) => setData("description", e.target.value)}
                            error={errors.description} />
                    </div>

                    <div className="mt-4">
                        <button type="submit"
                            className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full"
                            disabled={processing}>ثبت ماموریت جدید
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserTaskModal
