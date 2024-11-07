import {Head, router, usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import UserWorkModal from "@/Components/Modals/UserWorkModal.component";
import {PageProps, HomeTime, Clock, Project, MissionClock, Duty} from "@/types";
import UserSalaryModal from "@/Components/Modals/UserSalaryModal.component";
import UserVacationModal from "@/Components/Modals/UserVacationModal.component";
import UserTaskModal from "@/Components/Modals/UserTaskModal.component";
import UserHomeworkModal from "@/Components/Modals/UserHomeworkModal.component";
import UserInsertClockDuty from "@/Components/Modals/UserInsertClockDuty";

const Dashboard = () => {
    const {auth} = usePage<PageProps>().props;
    const {clock} = usePage<{ clock: Clock }>().props;
    const {home_work} = usePage<{ home_work: HomeTime }>().props
    const {total_time} = usePage<{ total_time: string }>().props
    const {total_time_home} = usePage<{ total_time_home: string }>().props
    const {projects} = usePage<{ projects: Project[] }>().props
    const {mission_time} = usePage<{ mission_time: MissionClock[] }>().props
    const {duties} = usePage<{ duties: Duty[] }>().props
    const {errors} = usePage().props

    const [userWork, setUserWork] = useState(false)
    const [userSalary, setUserSalary] = useState(false)
    const [userVacation, setUserVacation] = useState(false)
    const [userDuty, setUserDuty] = useState(false)
    const [userWorkAtHome, setUserWorkAtHome] = useState(false)
    const [userDutyClock, setUserDutyClock] = useState(false)

    const handleSendTime = () => {
        if (!clock) {
            router.post(route('start.time'), {}, {
                onSuccess: () => toast.success("ساعت ورود شما با موفقیت ثبت شد")
            })
        }
    }

    const logout = () => {
        router.post(route('logout', auth.user.id))
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    }, [errors])

    return (
        <>
            <Head title={` حساب کاربری ${auth.user.fullname}`}/>
            <Toaster/>

            <main className="w-full h-[100vh] flex items-center justify-center bg-[#00CCCC] max-sm:px-4">
                <div
                    className="w-[450px] max-sm:w-full max-sm:overflow-y-auto h-[590px] rounded-2xl border border-black bg-white p-[20px] max-sm:p-3 flex items-center flex-col shadow-2xl shadow-gray-500 relative">
                    <div className="w-32 h-32">
                        <img src={auth.user.image} alt="" className="rounded-full"/>
                    </div>

                    <div className="mt-3">
                        <p className="text-2xl font-bold">{auth.user.fullname}</p>
                    </div>

                    <div className="w-full mt-6 px-3 max-sm:px-0.5">
                        {
                            clock ?
                                (clock.user_work !== 0 ? (
                                    <button
                                        className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center"
                                        onClick={handleSendTime}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                                        </svg>

                                        <p>ثبت ساعت خروج</p>
                                    </button>
                                ) : (
                                    <button
                                        className="bg-[#EF0107] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center"
                                        onClick={() => setUserWork(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                                        </svg>

                                        <p>ثبت ساعت خروج</p>
                                    </button>
                                ))
                                :
                                <button
                                    className="bg-[#00CCCC] py-3 w-full text-white rounded-lg flex items-center gap-2 justify-center"
                                    onClick={handleSendTime}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                                    </svg>

                                    <p>ثبت ساعت شروع</p>
                                </button>
                        }
                    </div>

                    <div className="absolute bottom-2 w-full px-8 max-sm:px-4 py-3">
                        <div className="grid grid-cols-2 items-center gap-3">
                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-slate-100 gap-3"
                                onClick={() => setUserDuty(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                                </svg>

                                <p>ماموریت</p>
                            </button>

                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-slate-100 gap-3"
                                onClick={() => setUserWorkAtHome(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                                </svg>

                                <p>کار در منزل</p>
                            </button>

                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-slate-100 gap-3"
                                onClick={() => setUserSalary(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                                </svg>

                                <p>تنخواه</p>
                            </button>

                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-slate-100 gap-3"
                                onClick={() => setUserVacation(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"/>
                                </svg>

                                <p>مرخصی</p>
                            </button>

                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-slate-100 gap-3"
                                onClick={() => setUserDutyClock(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"/>
                                </svg>

                                <p>ساعت ماموریت</p>
                            </button>

                            <button
                                className="flex items-center justify-center w-full h-[90px] flex-col rounded-md bg-red-50 gap-3 border-2 border-dashed border-red-500 text-red-500"
                                onClick={logout}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                                </svg>

                                <p className="font-bold">خروج از حساب</p>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <UserWorkModal setState={setUserWork} state={userWork} total_time={total_time} projects={projects}/>
            <UserSalaryModal setState={setUserSalary} state={userSalary}/>
            <UserVacationModal setState={setUserVacation} state={userVacation}/>
            <UserTaskModal setState={setUserDuty} state={userDuty} projects={projects}/>
            <UserHomeworkModal setState={setUserWorkAtHome} state={userWorkAtHome} home_time={home_work} total_time_home={total_time_home}/>
            <UserInsertClockDuty setState={setUserDutyClock} state={userDutyClock} mission_time={mission_time} duties={duties}/>
        </>
    )
}

export default Dashboard
