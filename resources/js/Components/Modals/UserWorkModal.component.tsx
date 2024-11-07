import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import toast from "react-hot-toast";
import { FormEvent, useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import Textarea from "@/Components/Textarea.component";
import SelectBox from "@/Components/SelectBox.component";
import { Project } from "@/types";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import { minutesToHours, timeToMinutes } from "@/lib/getTimeDifference";
import Swal from "sweetalert2";
import InputClock from "../input-clock.component";

interface UserWorkParams {
    state?: boolean,
    setState?: ((open: boolean) => void),
    total_time: string,
    projects: Project[],
}

const UserWorkModal = ({ state, setState, total_time, projects }: UserWorkParams) => {

    const [totalTime, setTotalTime] = useState<string>(total_time)

    useEffect(() => {
        setData("time_value", totalTime);
    }, [total_time])

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const { data, setData, post, errors, processing, reset } = useForm({
        'time_value': totalTime,
        'project': '',
        'description': ''
    })

    const subtractTime = (total: string, timeValue: string): string => {
        const totalMinutes = timeToMinutes(total);
        const timeValueMinutes = timeToMinutes(timeValue);
        const resultMinutes = totalMinutes - timeValueMinutes;

        return minutesToHours(resultMinutes);
    }

    const handleWorkLog = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('user-work.store'), {
            onSuccess: () => {
                reset("project", "description")
                toast.success("کارکرد شما ثبت شد")

                const newTotalTime = subtractTime(totalTime, data.time_value);
                setTotalTime(newTotalTime)
            },
        })
    }

    const handleLeftTime = () => {
        if (totalTime !== "0:00") {
            toast.error(`شما هنوز ${totalTime} ساعت دارید!`)
        } else {
            router.post(route('left.time'), {}, {
                onSuccess: () => {
                    toast.success("ساعت خروج شما ثبت گردید")
                    if (setState) setState(false)
                }
            })
        }
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت کارکرد</h1>

                    <form className="mt-5" onSubmit={handleWorkLog}>
                        <div className="flex items-center gap-2">
                            <InputClock id="time_value" type="text" name="time_value" label="میزان کارکرد" value={data.time_value}
                                onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value} />

                            <SelectBox id="project" name="project" label="پروژه" value={data.project}
                                onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                                <option hidden></option>
                                {
                                    projects.map((project, i) => (
                                        <option value={project.title} key={i}>{project.title}</option>
                                    ))
                                }
                            </SelectBox>
                        </div>

                        <div className="mt-5">
                            <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                value={data.description} onChange={(e) => setData("description", e.target.value)}
                                error={errors.description} />
                        </div>

                        <div className="mt-4 flex flex-col items-center gap-y-2">
                            <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-md text-md w-full"
                                disabled={processing}>
                                ثبت کارکرد جدید
                            </button>

                            <button type="button"
                                onClick={handleLeftTime}
                                className="py-2.5 px-8 text-white bg-red-600 rounded-md text-md w-full"
                                disabled={processing}>ثبت ساعت خروج
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
                <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت کارکرد</h1>

                <form className="mt-5" onSubmit={handleWorkLog}>
                    <div className="flex items-center gap-2">
                        <InputClock id="time_value" type="text" name="time_value" label="میزان کارکرد" value={data.time_value}
                            onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value} />

                        <SelectBox id="project" name="project" label="پروژه" value={data.project}
                            onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                            <option hidden></option>
                            {
                                projects.map((project, i) => (
                                    <option value={project.title} key={i}>{project.title}</option>
                                ))
                            }
                        </SelectBox>
                    </div>

                    <div className="mt-8">
                        <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                            value={data.description} onChange={(e) => setData("description", e.target.value)}
                            error={errors.description} />
                    </div>

                    <div className="mt-4">
                        <div className="mt-4 flex flex-col items-center gap-y-2.5">
                            <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full"
                                disabled={processing}>
                                ثبت کارکرد جدید
                            </button>

                            <button type="button"
                                onClick={handleLeftTime}
                                className="py-2.5 px-8 text-white bg-red-600 rounded-full text-md w-full"
                                disabled={processing}>ثبت ساعت خروج
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserWorkModal
