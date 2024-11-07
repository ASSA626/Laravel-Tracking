import {Drawer, DrawerContent} from "@/Components/ui/drawer";
import DatepickerInput from "@/Components/datepicker.component";
import Input from "@/Components/Input.component";
import SelectBox from "@/Components/SelectBox.component";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {useMediaQuery} from "react-responsive";
import {useForm, usePage} from "@inertiajs/react";
import {FormEvent, useEffect} from "react";
import toast from "react-hot-toast";
import Textarea from "@/Components/Textarea.component";
import {Project} from "@/types";

interface CreateUserWorkInterface {
    state: boolean,
    setState: ((open: boolean) => void),
    projects: Project[]
}

const CreateClockWorkModal = ({state, setState, projects}: CreateUserWorkInterface) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })
    const id = window.location.pathname.split('/').pop();

    const {data, setData, post, processing, errors, reset} = useForm({
        project: '',
        time_value: '',
        description: ''
    })

    const handleUserWork = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('userworks.create', id), {
            onSuccess: () => {
                reset()
                toast.success('کارکرد با موفقیت اضافه شد')
                if (setState) setState(false)
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت کارکرد جدید</h1>
                    {id}
                </DrawerContent>
            </Drawer>
        )
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    }, [errors])

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت کارکرد جدید</h1>

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
                                ثبت کارکرد جدید
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateClockWorkModal
