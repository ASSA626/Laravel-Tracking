import {Dialog, DialogContent} from "@/Components/ui/dialog";
import DatepickerInput from "@/Components/datepicker.component";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import {Project} from "@/types";
import {FormEvent} from "react";
import {useForm} from "@inertiajs/react";
import toast from "react-hot-toast";
import {useMediaQuery} from "react-responsive";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface ReportsAddClockProps {
    state: boolean,
    setState: ((open: boolean) => void),
    projects: Project[],
    user_id: number
}

const ReportsAddWorkAtHomeModal = ({state, setState, projects, user_id}: ReportsAddClockProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const {data, setData, post, processing, errors, reset} = useForm({
        created_at: '',
        start_time: '',
        left_time: '',
        project: '',
        time_value: ''
    })

    const handleCreatedAt = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("created_at", selectedDate)
    }

    const handleCreateHomework = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('report.crate.workathome', user_id), {
            onSuccess: () => {
                toast.success("کار در منزل با موفقیت ثبت شد.")
                reset()
                if (setState) setState(false)
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت کار در منزل جدید</h1>

                    <form className="mt-5 flex flex-col gap-6" onSubmit={handleCreateHomework}>
                        <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at} onChange={handleCreatedAt}/>

                        <div className="flex items-center gap-3">
                            <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                            <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                        </div>

                        <SelectBox id="project" name="project" label="انتخاب پروژه" value={data.project} onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                            <option hidden></option>

                            {
                                projects.map((project, i) => (
                                    <option value={project.title} key={i}>{project.title}</option>
                                ))
                            }
                        </SelectBox>

                        <Input id="time_value" type="text" name="time_value" label="میزان کار بروی پروژه" value={data.time_value} onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value}/>

                        <div className="mt-4">
                            <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                                ثبت کار در منزل
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
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت کار در منزل جدید</h1>

                <form className="mt-5 flex flex-col gap-6" onSubmit={handleCreateHomework}>
                    <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at} onChange={handleCreatedAt}/>

                    <div className="flex items-center gap-3">
                        <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                        <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                    </div>

                    <SelectBox id="project" name="project" label="انتخاب پروژه" value={data.project} onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                        <option hidden></option>

                        {
                            projects.map((project, i) => (
                                <option value={project.title} key={i}>{project.title}</option>
                            ))
                        }
                    </SelectBox>

                    <Input id="time_value" type="text" name="time_value" label="میزان کار بروی پروژه" value={data.time_value} onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value}/>

                    <div className="mt-4">
                        <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                            ثبت کار در منزل
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportsAddWorkAtHomeModal
