import {useMediaQuery} from "react-responsive";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {useForm} from "@inertiajs/react";
import Textarea from "@/Components/Textarea.component";
import toast from "react-hot-toast";
import {FormEvent} from "react";

interface InactiveVacationProps {
    state: boolean,
    setState: ((vacationList: boolean) => void),
    link: string,
    vacation_id: number
    statusState: ((vacationList: boolean) => void),
}

const InactiveVacationModal = ({state, setState, link, vacation_id, statusState}: InactiveVacationProps) => {

    const mobile = useMediaQuery({maxWidth: "546px"})

    const {data, setData, post, processing, errors} = useForm({
        status: 'unconfirmed',
        report_caption: '',
    })

    const handleCreateCap = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route(link, vacation_id), {
            onSuccess: () => {
                toast.success("دلیل رد شدن مرخصی ثبت شد")
                if (setState) setState(false)
                if (statusState) statusState(false)
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white">
                    <h1 className="text-2xl mt-5 text-center font-bold">دلیل رد شدن</h1>

                    <form onSubmit={handleCreateCap}>
                        <div>
                            <Textarea id="report_caption" name="report_caption" label="توضیحات مربوطه..."
                                      value={data.report_caption} onChange={(e) => setData("report_caption", e.target.value)}
                                      error={errors.report_caption}/>
                        </div>

                        <button type="submit"
                                className="py-2.5 px-8 text-white bg-[#242424] rounded-md text-md w-full"
                                disabled={processing}>
                            ثبت دلیل
                        </button>
                    </form>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl text-center font-bold">دلیل رد شدن</h1>

                <form onSubmit={handleCreateCap}>
                    <div >
                        <Textarea id="report_caption" name="report_caption" label="توضیحات مربوطه..."
                                  value={data.report_caption} onChange={(e) => setData("report_caption", e.target.value)}
                                  error={errors.report_caption}/>
                    </div>

                    <button type="submit"
                            className="py-3 px-8 text-white bg-bank-gradient rounded-md text-md w-full mt-2"
                            disabled={processing}>
                        ثبت علت رد شدن مرخصی
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default InactiveVacationModal
