import { Dialog, DialogContent } from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Project, User } from "@/types";
import DatepickerInput from "@/Components/datepicker.component";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import { getTimeDifference, timeToMinutes } from "@/lib/getTimeDifference";

interface ReportsAddClockProps {
    state: boolean,
    setState: ((open: boolean) => void),
    projects: Project[],
    user_id: number
}

interface UserWork {
    project: string,
    time_value: string
}

const ReportsAddClockModal = ({ state, setState, projects, user_id }: ReportsAddClockProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const [currentTimeValue, setCurrentTimeValue] = useState<string>('')
    const [currentProject, setCurrentProject] = useState<string>('')

    const { data, setData, post, processing, errors, reset } = useForm<{
        created_at: string;
        start_time: string;
        left_time: string;
        time_entries: UserWork[];
    }>({
        created_at: '',
        start_time: '',
        left_time: '',
        time_entries: []
    })

    const handleCreatedAt = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setData("created_at", selectedDate)
    }

    const handleCreateClock = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('report.crate.clock', user_id), {
            onSuccess: () => {
                toast.success("ساعت با موفقیت ثبت شد.")
                reset()
                if (setState) setState(false)
            }
        })
    }

    const handleAddTimeEntry = () => {
        const currentDifference = getTimeDifference(data.start_time, data.left_time);
        const currentDifferenceInMinutes = timeToMinutes(currentDifference);

        const totalTimeEntriesInMinutes = data.time_entries.reduce((acc, entry) => {
            return acc + timeToMinutes(entry.time_value);
        }, 0);

        if (!currentProject) {
            toast.error('پروژه را وارد کنید')
            return;
        }

        const timeValueInMinutes = timeToMinutes(currentTimeValue);
        if (totalTimeEntriesInMinutes + timeValueInMinutes > currentDifferenceInMinutes) {
            toast.error('مجموع زمان وارد شده بیشتر از زمان باقی مانده است.');
            return;
        }

        const updatedRemainingMinutes = currentDifferenceInMinutes - (totalTimeEntriesInMinutes + timeValueInMinutes);

        const newEntry: UserWork = {
            project: currentProject,
            time_value: currentTimeValue,
        };

        const updatedTimeEntries = [...data.time_entries, newEntry];
        setData('time_entries', updatedTimeEntries);

        const updatedRemainingTime = `${Math.floor(updatedRemainingMinutes / 60).toString().padStart(2, '0')}:${(updatedRemainingMinutes % 60).toString().padStart(2, '0')}`;

        setCurrentTimeValue(updatedRemainingTime);
        setCurrentProject('');
    }

    useEffect(() => {
        const timeDifference = getTimeDifference(data.start_time, data.left_time)
        setCurrentTimeValue(timeDifference)
    }, [data.start_time, data.left_time])

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت ساعت جدید</h1>

                    <form className="mt-5 flex flex-col gap-4" onSubmit={handleCreateClock}>
                        <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at}
                            onChange={handleCreatedAt} />

                        <div className="flex items-center gap-2">
                            <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time}
                                onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time} />
                            <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time}
                                onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time} />
                        </div>

                        <hr className="border border-dashed border-gray-400" />

                        <Input id="time_value" type="text" name="time_value" label="میزان کار بروی پروژه"
                            value={currentTimeValue} onChange={(e) => setCurrentTimeValue(e.target.value)} />

                        <div className="flex flex-col items-center gap-y-3">
                            <SelectBox id="project" name="project" label="انتخاب پروژه" value={currentProject}
                                onChange={(e) => setCurrentProject(e.target.value)}>
                                <option hidden></option>

                                {
                                    projects.map((project, i) => (
                                        <option value={project.title} key={i}>{project.title}</option>
                                    ))
                                }
                            </SelectBox>

                            <button type="button" className="py-3 px-3.5 text-white bg-emerald-900 rounded-md text-md w-full"
                                disabled={processing}
                                onClick={handleAddTimeEntry}>
                                ثبت کارکرد
                            </button>
                        </div>


                        <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full"
                            disabled={processing}>
                            ثبت ساعت
                        </button>
                    </form>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت ساعت جدید</h1>

                <form className="mt-5 flex flex-col gap-6" onSubmit={handleCreateClock}>
                    <DatepickerInput id="created_at" name="created_at" label="تاریخ ساعت" value={data.created_at}
                        onChange={handleCreatedAt} />

                    <div className="flex items-center gap-2">
                        <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time}
                            onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time} />
                        <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time}
                            onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time} />
                    </div>

                    <hr className="border border-dashed border-gray-400" />

                    <Input id="time_value" type="text" name="time_value" label="میزان کار بروی پروژه"
                        value={currentTimeValue} onChange={(e) => setCurrentTimeValue(e.target.value)} />

                    <div className="flex items-center justify-between gap-x-2">
                        <SelectBox id="project" name="project" label="انتخاب پروژه" value={currentProject}
                            onChange={(e) => setCurrentProject(e.target.value)}>
                            <option hidden></option>

                            {
                                projects.map((project, i) => (
                                    <option value={project.title} key={i}>{project.title}</option>
                                ))
                            }
                        </SelectBox>

                        <button type="button" className="py-3 px-3.5 text-white bg-emerald-900 rounded-md text-md w-1/3"
                            disabled={processing}
                            onClick={handleAddTimeEntry}>
                            ثبت کارکرد
                        </button>
                    </div>


                    <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full"
                        disabled={processing}>
                        ثبت ساعت
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportsAddClockModal
