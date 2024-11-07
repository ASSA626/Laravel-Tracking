import {Dialog, DialogContent} from "@/Components/ui/dialog";
import Input from "@/Components/Input.component";
import Textarea from "@/Components/Textarea.component";
import {useMediaQuery} from "react-responsive";
import toast from "react-hot-toast";
import {ChangeEvent, FormEvent, FormEventHandler, useState} from "react";
import {useForm} from "@inertiajs/react";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface UserSalaryParams {
    state?: boolean,
    setState?: ((open: boolean) => void)
}

const UserSalaryModal = ({state, setState}: UserSalaryParams) => {

    const mobile = useMediaQuery({maxWidth: "546px"})

    const [formattedValue, setFormattedValue] = useState('')

    const {data, setData, post, errors, processing, reset} = useForm({
        title: '',
        value: '',
        count: 1,
        description: ''
    })

    const formattedResult = (parseFloat(data.value.replace(/,/g, '')) * data.count).toLocaleString();

    const handleSalary = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const rawValue = parseFloat(data.value.replace(/,/g, ''));
        const completeValue = rawValue * data.count;

        post(route('salary.store', {
            complete_value: completeValue,
        }), {
            onSuccess: () => {
                reset("title", "value", "count", "description")
                setFormattedValue('')
                toast.success("تنخواه با موفقیت ثبت شد")
            }
        })
    }

    const handleNumberValue = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/,/g, '');
        const formatted = Number(inputValue).toLocaleString();
        setData('value', inputValue);
        setFormattedValue(formatted);
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت تنخواه</h1>

                    <form className="mt-5" onSubmit={handleSalary}>
                        <div className="flex flex-col w-full gap-8">
                            <Input id="title" type="text" name="title" label="عنوان" value={data.title}
                                   onChange={(e) => setData("title", e.target.value)} error={errors.title}/>

                            <div className="flex items-center gap-2">
                                <Input id="count" type="number" name="count" label="تعداد" value={data.count}
                                       onChange={(e) => setData("count", parseInt(e.target.value, 10))}
                                       error={errors.count}/>
                                <Input id="value" type="text" name="value" label="مقدار" value={formattedValue}
                                       onChange={handleNumberValue} error={errors.value}/>
                            </div>

                            <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                      value={data.description} onChange={(e) => setData("description", e.target.value)}
                                      error={errors.description}/>
                        </div>

                        <p className="my-4 text-center border-2 border-dashed border-gray-400 px-5 py-3 rounded-md w-full">{formattedResult} تومان </p>

                        <div className="mt-4">
                            <button type="submit"
                                    className="py-2.5 px-8 text-white bg-[#242424] rounded-xl text-md w-full"
                                    disabled={processing}>
                                ثبت تنخواه جدید
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
                <h1 className="text-2xl mt-5 text-center font-bold">فرم ثبت تنخواه</h1>

                <form className="mt-5" onSubmit={handleSalary}>
                    <div className="flex flex-col w-full gap-8">
                        <Input id="title" type="text" name="title" label="عنوان" value={data.title}
                               onChange={(e) => setData("title", e.target.value)} error={errors.title}/>

                        <div className="flex items-center gap-2">
                            <Input id="count" type="number" name="count" label="تعداد" value={data.count}
                                   onChange={(e) => setData("count", parseInt(e.target.value, 10))}
                                   error={errors.count}/>
                            <Input id="value" type="text" name="value" label="مقدار" value={formattedValue}
                                   onChange={handleNumberValue} error={errors.value}/>
                        </div>

                        <Textarea id="description" name="description" label="توضیحات (اختیاری)..."
                                  value={data.description} onChange={(e) => setData("description", e.target.value)}
                                  error={errors.description}/>
                    </div>

                    <p className="my-4 text-center border-2 border-dashed border-gray-400 px-5 py-3 rounded-md w-full">{formattedResult} تومان </p>

                    <div className="mt-4">
                        <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-full text-md w-full"
                                disabled={processing}>ثبت تنخواه جدید
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserSalaryModal
