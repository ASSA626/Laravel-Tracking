import {Dialog, DialogContent} from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import {useForm} from "@inertiajs/react";
import {FormEvent} from "react";
import {Duty, Project} from "@/types";
import toast from "react-hot-toast";
import SelectBox from "@/Components/SelectBox.component";
import {useMediaQuery} from "react-responsive";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface ReportsEditDutyClockProps {
    state: boolean,
    setState: ((open: boolean) => void),
    mission: number,
    duties: Duty[]
}

const ReportsEditDutyClockModal = ({state, setState, mission, duties}: ReportsEditDutyClockProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const {data, setData, put, processing, errors, reset} = useForm({
        start_time: '',
        left_time: '',
        duty: ''
    })

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        put(route('reports.update-duty-clock', mission), {
            onSuccess: () => {
                reset()
                setState(false)
                toast.success("ویرایش انجام شد")
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ویرایش ساعت ماموریت</h1>

                    <form className="mt-5" onSubmit={handleUpdate}>
                        <div className="flex items-center gap-3 mb-5">
                            <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                            <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                        </div>

                        <SelectBox id="duty" name="duty" label="ماموریت های کاربر" value={data.duty} onChange={(e) => setData("duty", e.target.value)} error={errors.duty}>
                            <option hidden></option>

                            {
                                duties.map((duty: any, i: any) => (
                                    <option value={duty.id} key={i}>{duty.project} - {duty.place}</option>
                                ))
                            }
                        </SelectBox>

                        <div className="mt-4">
                            <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                                ویرایش
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
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ویرایش ساعت ماموریت</h1>

                <form className="mt-5" onSubmit={handleUpdate}>
                    <div className="flex items-center gap-3 mb-5">
                        <Input id="start_time" type="text" name="start_time" label="ساعت شروع" value={data.start_time} onChange={(e) => setData("start_time", e.target.value)} error={errors.start_time}/>
                        <Input id="left_time" type="text" name="left_time" label="ساعت خروج" value={data.left_time} onChange={(e) => setData("left_time", e.target.value)} error={errors.left_time}/>
                    </div>

                    <SelectBox id="duty" name="duty" label="ماموریت های کاربر" value={data.duty} onChange={(e) => setData("duty", e.target.value)} error={errors.duty}>
                        <option hidden></option>

                        {
                            duties.map((duty: any, i: any) => (
                                <option value={duty.id} key={i}>{duty.project} - {duty.place}</option>
                            ))
                        }
                    </SelectBox>

                    <div className="mt-4">
                        <button type="submit" className="py-3 px-8 text-white bg-[#242424] rounded-md text-md w-full" disabled={processing}>
                            ویرایش
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportsEditDutyClockModal
