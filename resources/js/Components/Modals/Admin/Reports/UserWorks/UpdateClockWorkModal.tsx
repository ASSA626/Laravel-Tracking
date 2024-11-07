import {Drawer, DrawerContent} from "@/Components/ui/drawer";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {useMediaQuery} from "react-responsive";
import {useForm, usePage} from "@inertiajs/react";
import {FormEvent, useEffect} from "react";
import toast from "react-hot-toast";
import Textarea from "@/Components/Textarea.component";
import {Project} from "@/types";

interface UpdateUserWorkInterface {
    state: boolean,
    setState: ((open: boolean) => void),
    projects: Project[],
    work_id: number|null
}

const UpdateClockWorkModal = ({state, setState, projects, work_id}: UpdateUserWorkInterface) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })
    const id = window.location.pathname.split('/').pop();

    const {data, setData, put, processing, errors, reset} = useForm({
        project: '',
        time_value: '',
        description: ''
    })

    const handleUserWork = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        put(route('userworks.update', {clock_id: id, id: work_id}), {
            onSuccess: () => {
                reset()
                toast.success('کارکرد با موفقیت ویرایش شد')
                if (setState) setState(false)
            }
        })
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    }, [errors])

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ویرایش کارکرد</h1>
                    {id}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ویرایش کارکرد</h1>

                <form className="mt-5" onSubmit={handleUserWork}>
                    <div className="flex items-center gap-2">
                        <Input id="time_value" type="text" name="time_value" label="میزان کارکرد" value={data.time_value}
                               onChange={(e) => setData("time_value", e.target.value)} error={errors.time_value}/>

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
                                  error={errors.description}/>
                    </div>

                    <div className="mt-4">
                        <div className="mt-4 flex flex-col items-center gap-y-2.5">
                            <button type="submit"
                                    className="py-2.5 px-8 text-white bg-bank-gradient rounded-full text-md w-full"
                                    disabled={processing}>
                                ویرایش کارکرد
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateClockWorkModal
