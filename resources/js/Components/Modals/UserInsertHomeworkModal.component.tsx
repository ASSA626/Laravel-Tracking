import {useMediaQuery} from "react-responsive";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import Textarea from "@/Components/Textarea.component";
import {FormEvent} from "react";
import {useForm} from "@inertiajs/react";
import toast from "react-hot-toast";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface UserInsertHomeworkParams {
    state?: boolean,
    setState?: ((open: boolean) => void),
    total_time_home: string
}

const UserInsertHomeworkModal = ({state, setState, total_time_home}: UserInsertHomeworkParams) => {

    const mobile = useMediaQuery({maxWidth: "546px"})

    const {data, setData, post, errors, processing, reset} = useForm({
        'time_value': total_time_home || '',
        'project': '',
        'description': ''
    })

    const handleWorkLogHome = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('user-home-work.store'), {
            onSuccess: () => {
                reset()
                if (setState) setState(false)
                toast.success("کارکرد منزل شما ثبت گردید")
            }
        })
    }

    if (mobile) {
        return  (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت کارکرد در منزل</h1>

                    <form className="mt-5" onSubmit={handleWorkLogHome}>
                        <div className="flex items-center gap-2">
                            <Input id="time_value" type="text" name="time_value" label="میزان کارکرد" value={data.time_value}
                                   onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value} disabled={true}/>

                            <SelectBox id="project" name="project" label="پروژه" value={data.project}
                                       onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                                <option hidden></option>
                                <option value="متفرقه">متفرقه</option>
                            </SelectBox>
                        </div>

                        <div className="mt-8">
                            <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                      value={data.description} onChange={(e) => setData("description", e.target.value)}
                                      error={errors.description}/>
                        </div>

                        <div className="mt-4">
                            <button type="submit"
                                    className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full"
                                    disabled={processing}>ثبت کارکرد جدید
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
                <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت کارکرد در منزل</h1>

                <form className="mt-5" onSubmit={handleWorkLogHome}>
                    <div className="flex items-center gap-2">
                        <Input id="name" type="text" name="name" label="میزان کارکرد" value={data.time_value}
                               onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value} disabled={true}/>

                        <SelectBox id="project" name="project" label="پروژه" value={data.project}
                                   onChange={(e) => setData("project", e.target.value)} error={errors.project}>
                            <option hidden></option>
                            <option value="متفرقه">متفرقه</option>
                        </SelectBox>
                    </div>

                    <div className="mt-8">
                        <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                  value={data.description} onChange={(e) => setData("description", e.target.value)}
                                  error={errors.description}/>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full" disabled={processing}>ثبت کارکرد جدید</button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserInsertHomeworkModal
