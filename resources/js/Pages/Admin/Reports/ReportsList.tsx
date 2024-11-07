import {useEffect, useState} from "react";
import TableInfo from "@/Components/Admin/TableInfo";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table";
import moment from "moment-jalaali";
import NoDataMessage from "@/Components/Admin/NoDataMessage";
import AdminLayout from "@/Layouts/AdminLayout";
import {Link, router, usePage} from "@inertiajs/react";
import {AdminClocks, AdminDuties, AdminDutiesClock, AdminHomeworks, Project, User} from "@/types";
import momentZone from "moment-timezone";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import AnimationWrapper from "@/Common/AnimationWrapper";
import ChangeStatusModal from "@/Components/Admin/ChangeStatusModal";
import {ActiveStatus, InactiveStatus, WaitingStatus} from "@/Components/Admin/TableStatuses";
import {cn} from "@/lib/utils";
import ChooseUserModal from "@/Components/Modals/Admin/ChooseUserModal";
import ReportsEditClockModal from "@/Components/Modals/Admin/Reports/ReportsEditClockModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Pagination from "@/Common/Pagination";
import ReportsEditWorkAtHomeModal from "@/Components/Modals/Admin/Reports/ReportsEditWorkAtHomeModal";
import ReportsEditDutyClockModal from "@/Components/Modals/Admin/Reports/ReportsEditDutyClockModal";
import ReportsAddClockModal from "@/Components/Modals/Admin/Reports/ReportsAddClockModal";
import ReportsAddWorkAtHomeModal from "@/Components/Modals/Admin/Reports/ReportsAddWorkAtHomeModal";
import ReportsAddDutyClockModal from "@/Components/Modals/Admin/Reports/ReportsAddDutyClockModal";
import FilterReportModal from "@/Components/Modals/Admin/FilterReportsModal";

interface ReportEntry {
    date: string;
    clocks: string;
    homeworks: string;
    duty_clocks: string;
    total_time: string;
}

const ReportsList = () => {

    const [usersListModal, setUsersListModal] = useState<boolean>(false)
    const [userId, setUserId] = useState<string | number>("")
    const [openStatusModal, setOpenStatusModal] = useState<boolean>(false)
    const [tabActive, setTabActive] = useState<string>("clock")
    const [filterReportModal, setFilterReportModal] = useState<boolean>(false)
    const [editClockModal, setEditClockModal] = useState<boolean>(false)
    const [editClockData, setEditClockData] = useState<number>(0)
    const [editHomeworkClockModal, setEditHomeworkClockModal] = useState<boolean>(false)
    const [editHomeworkClockData, setEditHomeworkClockData] = useState<number>(0)
    const [editDutyClockModal, setEditDutyClockModal] = useState<boolean>(false)
    const [editDutyClockData, setEditDutyClockData] = useState<number>(0)
    const [addClockModal, setAddClockModal] = useState<boolean>(false)
    const [addHomeworkClockModal, setAddHomeworkClockModal] = useState<boolean>(false)
    const [addDutyClockModal, setAddDutyClockModal] = useState<boolean>(false)

    const {errorMessage}: any = usePage<{ errorMessage: string }>().props
    const {users}: any = usePage<{ users: User[] }>().props
    const {projects}: any = usePage<{ projects: Project[] }>().props
    const {clocks}: any = usePage<{ clocks: AdminClocks[] }>().props
    const {clocks_count} = usePage<{ clocks_count: number }>().props
    const {homeworks}: any = usePage<{ homeworks: AdminHomeworks[] }>().props
    const {homeworks_count} = usePage<{ homeworks_count: number }>().props
    const {reports}: any = usePage<{ reports: ReportEntry[] }>().props
    const {username} = usePage<{ username: string }>().props
    const {duties_clocks}: any = usePage<{ duties_clocks: AdminDutiesClock[] }>().props
    const {duties_clocks_count} = usePage<{ duties_clocks_count: number }>().props
    const {duties}: any = usePage<{ duties: AdminDuties[] }>().props
    const {user_id} = usePage<{ user_id: number }>().props

    const queryParams = {
        user_id: user_id,
    }

    const dateConverter = (time: string) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        const timePattern = /^\d{2}:\d{2}$/

        if (timePattern.test(time)) {
            const utcDateTimeString = `1970-01-01T${time}:00Z`
            const iranTime = momentZone.tz(utcDateTimeString, 'Asia/Tehran')

            return iranTime.format('ساعت HH:mm')
        } else if (datePattern.test(time)) {
            return moment(time).format("jYYYY/jMM/jDD")
        }
    }

    const sendUserId = () => {
        router.get(route('reports.index', {user_id: userId}))
    }

    const handleChangeTab = (tabName: string) => {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.delete("page")
        window.history.replaceState(null, '', currentUrl.toString());

        setTabActive(tabName)
    }

    const handleSetEdit = (id: number, type: string = 'clock') => {
        if (type === 'clock') {
            setEditClockData(id)
            setEditClockModal(true)
        } else if (type === 'homework') {
            setEditHomeworkClockData(id)
            setEditHomeworkClockModal(true)
        } else if (type === 'duty') {
            setEditDutyClockData(id)
            setEditDutyClockModal(true)
        }
    }

    const handleDeleteClock = (clock_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این ساعت داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('reports.delete-clock', clock_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    const handleDeleteHomework = (homework_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این کار در منزل داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('reports.delete-homework', homework_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    const handleDeleteDuty = (duty_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این ساعت ماموریت داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('reports.delete-duty', duty_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    useEffect(() => {
        setTabActive("clocks")
    }, []);

    return (
        <AdminLayout>
            <section className="home">
                <section className="home-content">
                    <section className="recent-transactions">
                        <header>
                            <h1 className="recent-transactions-label">گزارش گیری</h1>
                        </header>

                        <Tabs defaultValue="clocks">
                            <TabsList className="mb-1.5 flex items-start justify-start gap-2 overflow-y-scroll">
                                <TabsTrigger value="clocks" onClick={() => handleChangeTab("clocks")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'clocks'
                                        })}>
                                            ساعت ها
                                        </p>
                                    </div>
                                </TabsTrigger>

                                <TabsTrigger value="workathome" onClick={() => handleChangeTab("workathome")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'workathome'
                                        })}>
                                            کار در منزل
                                        </p>
                                    </div>
                                </TabsTrigger>

                                <TabsTrigger value="mission" onClick={() => handleChangeTab("mission")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'mission'
                                        })}>
                                            ساعت ماموریت
                                        </p>
                                    </div>
                                </TabsTrigger>

                                <TabsTrigger value="total_clock" onClick={() => handleChangeTab("total_clock")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'total_clock'
                                        })}>
                                            گزارش گیری
                                        </p>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="clocks">
                                <TableInfo icon="connect-bank.svg" count={clocks_count} title="ساعت ثبت شده در ماه"
                                           linkCreate="reports.create" linkLabel="افزودن ساعت" linkStatus={false}
                                           className="mb-5" anotherButton={true}
                                           anotherButtonFun={() => setUsersListModal(true)}/>

                                {
                                    user_id && (
                                        <div
                                            className="flex max-md:flex-col items-center pb-4 gap-4 border-b border-gray-200">
                                            <button
                                                className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                                onClick={() => setAddClockModal(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>

                                                <p>افزودن ساعت جدید</p>
                                            </button>
                                        </div>
                                    )
                                }

                                <AnimationWrapper>
                                    {
                                        clocks.data.length > 0 ?
                                            <div className="overflow-x-auto">
                                                <Table className="whitespace-nowrap">
                                                    <TableHeader>
                                                        <TableRow className="text-[13px]">
                                                            <TableHead>نام کارمند</TableHead>
                                                            <TableHead>کدملی کارمند</TableHead>
                                                            <TableHead>تاریخ ثبت</TableHead>
                                                            <TableHead>ساعت ورود</TableHead>
                                                            <TableHead>ساعت خروج</TableHead>
                                                            <TableHead>میزان کارکرد</TableHead>
                                                            <TableHead>عنوان کارکرد</TableHead>
                                                            <TableHead>ویرایش</TableHead>
                                                            <TableHead>حذف</TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {
                                                            clocks.data.map((clock: any, i: any) => (
                                                                <TableRow key={i} className="font-bold">
                                                                    <TableCell className="p-4">
                                                                        {clock.user.fullname}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {clock.user.national_code}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {moment(clock.date).format("jYYYY/jMM/jDD")}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {dateConverter(clock.start_time)}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            clock.left_time ? (clock.left_time === 'ساعت خروج ثبت نشده' ? <p className="text-red-500">{clock.left_time}</p> : dateConverter(clock.left_time)) :
                                                                            <p className="text-red-600">ثبت نشده</p>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            clock.left_time ? (clock.daily_time === 'محاسبه نشده است' ? <p className="text-red-500">{clock.daily_time}</p> : `${clock.daily_time} ساعت `) :
                                                                            <p className="text-red-600">محاسبه نشده</p>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <Link href={route('userworks.index', clock.id)}
                                                                                className="view-all-btn py-1.5 px-4">
                                                                            مشاهده
                                                                        </Link>
                                                                    </TableCell>


                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleSetEdit(clock.id)}>
                                                                            ویرایش
                                                                        </button>
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleDeleteClock(clock.id)}>
                                                                            حذف
                                                                        </button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>

                                                <Pagination links={clocks.links} queryParams={queryParams}/>
                                            </div>
                                            :
                                            <NoDataMessage
                                                message={errorMessage ? errorMessage : "هیچ ساعتی ثبت نشده است"}/>
                                    }
                                </AnimationWrapper>
                            </TabsContent>

                            <TabsContent value="workathome">
                                <TableInfo icon="connect-bank.svg" count={homeworks_count}
                                           title="کار در منزل ثبت شده در ماه" linkCreate="reports.create"
                                           linkLabel="افزودن ساعت" linkStatus={false} className="mb-5"
                                           anotherButton={true} anotherButtonFun={() => setUsersListModal(true)}/>

                                {
                                    user_id && (
                                        <div
                                            className="flex max-md:flex-col items-center pb-4 gap-4 border-b border-gray-200">
                                            <button
                                                className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                                onClick={() => setAddHomeworkClockModal(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>

                                                <p>افزودن کار در منزل جدید</p>
                                            </button>
                                        </div>
                                    )
                                }

                                <AnimationWrapper>
                                    {
                                        homeworks.data.length > 0 ?
                                            <div className="overflow-x-auto">
                                                <Table className="whitespace-nowrap">
                                                    <TableHeader>
                                                        <TableRow className="text-[13px]">
                                                            <TableHead>نام کارمند</TableHead>
                                                            <TableHead>کدملی کارمند</TableHead>
                                                            <TableHead>تاریخ ثبت</TableHead>
                                                            <TableHead>ساعت ورود</TableHead>
                                                            <TableHead>ساعت خروج</TableHead>
                                                            <TableHead>میزان کارکرد</TableHead>
                                                            <TableHead>عنوان کارکرد</TableHead>
                                                            <TableHead>وضعیت</TableHead>
                                                            <TableHead>ویرایش</TableHead>
                                                            <TableHead>حذف</TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {
                                                            homeworks.data.map((homework: any, i: any) => (
                                                                <TableRow key={i} className="font-bold">
                                                                    <TableCell className="p-4">
                                                                        {homework.user.fullname}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {homework.user.national_code}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {moment(homework.date).format("jYYYY/jMM/jDD")}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {dateConverter(homework.start_time)}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            homework.left_time ? (homework.left_time === 'ساعت خروج ثبت نشده' ? <p className="text-red-500">{homework.left_time}</p> : dateConverter(homework.left_time)) :
                                                                                <p className="text-red-600">ثبت نشده</p>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            homework.left_time ? (homework.daily_time === 'محاسبه نشده است' ? <p className="text-red-500">{homework.daily_time}</p> : `${homework.daily_time} ساعت `) :
                                                                                <p className="text-red-600">محاسبه نشده</p>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {homework.homework.length > 0 ? homework.homework[0].project : 'ثبت نشده است'}
                                                                    </TableCell>

                                                                    <TableCell className="relative p-4">
                                                                        <button type="button"
                                                                                onClick={() => setOpenStatusModal(preVal => !preVal)}>
                                                                            {
                                                                                homework.status === "confirming" ?
                                                                                    <WaitingStatus
                                                                                        label="در انتظار تایید"/> : (homework.status === 'confirmed' ?
                                                                                        <ActiveStatus label="تایید شده"/> :
                                                                                        <InactiveStatus
                                                                                            label="تایید نشده"/>)
                                                                            }
                                                                        </button>

                                                                        {
                                                                            openStatusModal ?
                                                                                <ChangeStatusModal
                                                                                    id={homework.id}
                                                                                    activeStatusLabel="تایید"
                                                                                    waitingStatusLabel="در انتظار تایید"
                                                                                    inactiveStatusLabel="رد کردن"
                                                                                    link="change.workathome.status"
                                                                                />
                                                                                : ""
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleSetEdit(homework.id, 'homework')}>
                                                                            ویرایش
                                                                        </button>
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleDeleteHomework(homework.id)}>
                                                                            حذف
                                                                        </button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>

                                                <Pagination links={homeworks.links} queryParams={queryParams}/>
                                            </div>
                                            :
                                            <NoDataMessage
                                                message={errorMessage ? errorMessage : "هیچ کار در منزلی ثبت نشده است"}/>
                                    }
                                </AnimationWrapper>
                            </TabsContent>

                            <TabsContent value="mission">
                                <TableInfo icon="connect-bank.svg" count={duties_clocks_count}
                                           title="ساعات ماموریت ثبت شده در ماه" linkCreate="reports.create"
                                           linkLabel="افزودن ساعت" linkStatus={false} className="mb-5"
                                           anotherButton={true} anotherButtonFun={() => setUsersListModal(true)}/>

                                {
                                    user_id && (
                                        <div
                                            className="flex max-md:flex-col items-center pb-4 gap-4 border-b border-gray-200">
                                            <button
                                                className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                                onClick={() => setAddDutyClockModal(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>

                                                <p>افزودن ساعت ماموریت جدید</p>
                                            </button>
                                        </div>
                                    )
                                }


                                <AnimationWrapper>
                                    {
                                        duties_clocks.data.length > 0 ?
                                            <div className="overflow-x-auto">
                                                <Table className="whitespace-nowrap">
                                                    <TableHeader>
                                                        <TableRow className="text-[13px]">
                                                            <TableHead>نام کارمند</TableHead>
                                                            <TableHead>کدملی کارمند</TableHead>
                                                            <TableHead>تاریخ ثبت</TableHead>
                                                            <TableHead>ساعت ورود</TableHead>
                                                            <TableHead>ساعت خروج</TableHead>
                                                            <TableHead>میزان کارکرد</TableHead>
                                                            <TableHead>وضعیت</TableHead>
                                                            <TableHead>ویرایش</TableHead>
                                                            <TableHead>حذف</TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {
                                                            duties_clocks.data.map((duty_clock: any, i: any) => (
                                                                <TableRow key={i} className="font-bold">
                                                                    <TableCell className="p-4">
                                                                        {duty_clock.user.fullname}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {duty_clock.user.national_code}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {moment(duty_clock.date).format("jYYYY/jMM/jDD")}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {dateConverter(duty_clock.start_time)}
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            duty_clock.left_time ? (duty_clock.left_time === 'ساعت خروج ثبت نشده' ? <p className="text-red-500">{duty_clock.left_time}</p> : dateConverter(duty_clock.left_time)) :
                                                                                <p className="text-red-600">ثبت نشده</p>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        {
                                                                            duty_clock.left_time ? (duty_clock.daily_time === 'محاسبه نشده است' ? <p className="text-red-500">{duty_clock.daily_time}</p> : `${duty_clock.daily_time} ساعت `) :
                                                                                <p className="text-red-600">محاسبه نشده</p>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="relative p-4">
                                                                        <button type="button"
                                                                                onClick={() => setOpenStatusModal(preVal => !preVal)}>
                                                                            {
                                                                                duty_clock.status === "confirming" ?
                                                                                    <WaitingStatus
                                                                                        label="در انتظار تایید"/> : (duty_clock.status === 'confirmed' ?
                                                                                        <ActiveStatus label="تایید شده"/> :
                                                                                        <InactiveStatus
                                                                                            label="تایید نشده"/>)
                                                                            }
                                                                        </button>

                                                                        {
                                                                            openStatusModal ?
                                                                                <ChangeStatusModal
                                                                                    id={duty_clock.id}
                                                                                    activeStatusLabel="تایید"
                                                                                    waitingStatusLabel="در انتظار تایید"
                                                                                    inactiveStatusLabel="رد کردن"
                                                                                    link="change.dutyclock.status"
                                                                                    setState={setOpenStatusModal}
                                                                                />
                                                                                : ""
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleSetEdit(duty_clock.id, 'duty')}>
                                                                            ویرایش
                                                                        </button>
                                                                    </TableCell>

                                                                    <TableCell className="p-4">
                                                                        <button type="button"
                                                                                className="view-all-btn py-1.5 px-4"
                                                                                onClick={() => handleDeleteDuty(duty_clock.id)}>
                                                                            حذف
                                                                        </button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>

                                                <Pagination links={homeworks.links} queryParams={queryParams}/>
                                            </div>
                                            :
                                            <NoDataMessage
                                                message={errorMessage ? errorMessage : "هیچ ساعت ماموریتی ثبت نشده است"}/>
                                    }
                                </AnimationWrapper>
                            </TabsContent>

                            <TabsContent value="total_clock">
                                <TableInfo icon="connect-bank.svg" count="" title="مجموع ساعات ماهانه"
                                           linkCreate="reports.create" linkLabel="افزودن ساعت" linkStatus={false}
                                           className="mb-5" anotherButton={true}
                                           anotherButtonFun={() => setUsersListModal(true)}/>

                                {
                                    user_id && (
                                        <div
                                            className="flex max-md:flex-col items-center pb-3.5 gap-4 border-b border-gray-200">
                                            {/* it's must be "a" tag no "Link" tag (component) */}
                                            <a href={route('get.report.pdf', user_id)}
                                               className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"/>
                                                </svg>

                                                <p>دریافت گزارش ماهانه</p>
                                            </a>

                                            <button
                                                className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                                onClick={() => setFilterReportModal(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
                                                </svg>

                                                <p>فیلتر براساس ماه های سال</p>
                                            </button>
                                        </div>
                                    )
                                }

                                <AnimationWrapper>
                                    {
                                        reports && reports.data && reports.data.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table className="whitespace-nowrap">
                                                        <TableHeader>
                                                            <TableRow className="text-[13px]">
                                                                <TableHead>تاریخ</TableHead>
                                                                <TableHead>نام کاربر</TableHead>
                                                                <TableHead>ساعات کارکرد</TableHead>
                                                                <TableHead>ساعات کار در منزل</TableHead>
                                                                <TableHead>ساعات ماموریت</TableHead>
                                                                <TableHead>جمع ساعات</TableHead>
                                                            </TableRow>
                                                        </TableHeader>

                                                        <TableBody>
                                                            {
                                                                reports.data.map((report: any, i: any) => (
                                                                    <TableRow className="font-bold" key={i}>
                                                                        <TableCell className="p-4">
                                                                            {moment(report.date).format("jYYYY/jMM/jDD")}
                                                                        </TableCell>

                                                                        <TableCell className="p-4">
                                                                            {username}
                                                                        </TableCell>

                                                                        <TableCell className="p-4">
                                                                            {report.clocks}
                                                                        </TableCell>

                                                                        <TableCell className="p-4">
                                                                            {report.homeworks}
                                                                        </TableCell>

                                                                        <TableCell className="p-4">
                                                                            {report.duty_clocks}
                                                                        </TableCell>

                                                                        <TableCell className="p-4">
                                                                            {report.total_time}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            }
                                                        </TableBody>
                                                    </Table>

                                                    <Pagination links={reports.links} queryParams={queryParams}/>
                                                </div>
                                            ) :
                                            <NoDataMessage
                                                message={errorMessage ? errorMessage : "هیچ مجموع عملکرد ثبت نشده"}/>
                                    }
                                </AnimationWrapper>
                            </TabsContent>
                        </Tabs>
                    </section>
                </section>
            </section>

            <ChooseUserModal
                state={usersListModal}
                setState={setUsersListModal}
                idState={userId}
                setIdState={setUserId}
                users={users}
                sendFun={sendUserId}
            />

            <ReportsEditClockModal
                state={editClockModal}
                setState={setEditClockModal}
                clock={editClockData}
            />

            <ReportsEditWorkAtHomeModal
                state={editHomeworkClockModal}
                setState={setEditHomeworkClockModal}
                homework={editHomeworkClockData}
                projects={projects}
            />

            <ReportsEditDutyClockModal
                state={editDutyClockModal}
                setState={setEditDutyClockModal}
                duties={duties}
                mission={editDutyClockData}
            />

            <ReportsAddClockModal
                state={addClockModal}
                setState={setAddClockModal}
                projects={projects}
                user_id={user_id}
            />

            <ReportsAddWorkAtHomeModal
                state={addHomeworkClockModal}
                setState={setAddHomeworkClockModal}
                projects={projects}
                user_id={user_id}
            />

            <ReportsAddDutyClockModal
                state={addDutyClockModal}
                setState={setAddDutyClockModal}
                duties={duties}
                user_id={user_id}
            />

            <FilterReportModal
                state={filterReportModal}
                setState={setFilterReportModal}
            />
        </AdminLayout>
    )
}

export default ReportsList
