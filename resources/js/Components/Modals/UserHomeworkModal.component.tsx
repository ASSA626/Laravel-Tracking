import {useMediaQuery} from "react-responsive";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {router} from "@inertiajs/react";
import toast from "react-hot-toast";
import {useState} from "react";
import UserInsertHomeworkModal from "@/Components/Modals/UserInsertHomeworkModal.component";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface HomeTime {
    id?: number
    user_id?: number
    user_work_home?: number
    daily_time?: string
    left_time?: number
}

interface UserHomeworkParams {
    state?: boolean,
    setState?: ((open: boolean) => void),
    home_time: HomeTime,
    total_time_home: string
}

const UserHomeworkModal = ({state, setState, home_time, total_time_home}: UserHomeworkParams) => {

    const mobile = useMediaQuery({maxWidth: "546px"})

    const [userWorkHome, setUserWorkHome] = useState(false)

    const handleSendHomeTime = () => {
        router.post(route('start-home.time'), {}, {
            onSuccess: () => {
                if (setState) setState(false)
                toast.success("ساعت ورود کار در منزل با موفقیت ثبت شد")
            }
        })
    }

    if (mobile) {
        return  (
            <>
                <Drawer open={state} onOpenChange={setState}>
                    <DrawerContent className="bg-white px-4 py-4">
                        <h1 className="text-2xl mt-5 text-center font-bold mb-5">ثبت کار در منزل</h1>

                        {
                            home_time ?
                                (home_time.user_work_home !== 0 ? (
                                    <button className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleSendHomeTime}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>

                                        <p>ثبت ساعت خروج کار در منزل</p>
                                    </button>
                                ) : (
                                    <button className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={() => setUserWorkHome(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>

                                        <p>ثبت ساعت خروج کار در منزل</p>
                                    </button>
                                ))
                                :
                                <button className="bg-[#00CCCC] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleSendHomeTime}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                                    </svg>

                                    <p>ثبت ساعت شروع کار در منزل</p>
                                </button>
                        }
                    </DrawerContent>
                </Drawer>

                <UserInsertHomeworkModal setState={setUserWorkHome} state={userWorkHome}  total_time_home={total_time_home}/>
            </>
        )
    }
    return (
        <>
            <Dialog open={state} onOpenChange={setState}>
                <DialogContent className="bg-white">
                    <h1 className="text-2xl mt-5 text-center font-bold">ثبت کار در منزل</h1>

                    {
                        home_time ?
                            (home_time.user_work_home !== 0 ? (
                                <button className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleSendHomeTime}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    <p>ثبت ساعت خروج کار در منزل</p>
                                </button>
                            ) : (
                                <button className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={() => setUserWorkHome(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    <p>ثبت ساعت خروج کار در منزل</p>
                                </button>
                            ))
                            :
                            <button className="bg-[#00CCCC] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center" onClick={handleSendHomeTime}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                                </svg>

                                <p>ثبت ساعت شروع کار در منزل</p>
                            </button>
                    }
                </DialogContent>
            </Dialog>

            <UserInsertHomeworkModal setState={setUserWorkHome} state={userWorkHome}  total_time_home={total_time_home}/>
        </>
    )
}

export default UserHomeworkModal
