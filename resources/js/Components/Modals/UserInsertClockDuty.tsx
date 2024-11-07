import {useMediaQuery} from "react-responsive";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {Duty, MissionClock} from "@/types";
import SelectBox from "@/Components/SelectBox.component";
import {router, useForm} from "@inertiajs/react";
import toast from "react-hot-toast";

interface UserInMission {
    state?: boolean,
    setState?: ((open: boolean) => void),
    mission_time: MissionClock[],
    duties: Duty[]
}

const UserInsertClockDuty = ({state, setState, mission_time, duties}: UserInMission) => {

    const {data, setData, post, errors, reset} = useForm({
        duty: ''
    })

    const mobile = useMediaQuery({maxWidth: "546px"})

    const handleSendHomeTime = () => {
        post(route('user-clocks-mission.store'), {
            onSuccess: () => {
                if (setState) setState(false)
                toast.success("ساعت ورود ماموریت شما با موفقیت ثبت شد")
            }
        })
    }

    const handleLeftTime = () => {
        router.post(route('user-clocks-mission-left.store'), {}, {
            onSuccess: () => {
                if (setState) setState(false)
                toast.success("ساعت خروج ماموریت با موفقیت ثبت شد")
            }
        })
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold">ثبت ساعت ماموریت</h1>

                {
                    mission_time ?
                        ""
                    :
                        <SelectBox id="duty" name="duty" label="انتخاب ماموریت" value={data.duty} onChange={(e) => setData("duty", e.target.value)}>
                            <option hidden></option>
                            {
                                duties.map((duty: any, i: any) => (
                                    <option value={duty.id} key={i}>{duty.project} - {duty.place}</option>
                                ))
                            }
                        </SelectBox>
                }

                {
                    mission_time ?
                        <button className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleLeftTime}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>

                            <p>ثبت ساعت خروج ماموریت</p>
                        </button>
                        :
                        <button className="bg-[#00CCCC] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleSendHomeTime}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                            </svg>

                            <p>ثبت ساعت شروع ماموریت</p>
                        </button>
                }
            </DialogContent>
        </Dialog>
    )
}

export default UserInsertClockDuty
