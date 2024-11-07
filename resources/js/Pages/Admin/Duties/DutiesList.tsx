import AdminLayout from "@/Layouts/AdminLayout";
import TableInfo from "@/Components/Admin/TableInfo";
import { router, usePage } from "@inertiajs/react";
import { AdminDuties, User } from "@/types";
import moment from "moment-jalaali";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ActiveStatus, InactiveStatus, WaitingStatus } from "@/Components/Admin/TableStatuses";
import NoDataMessage from "@/Components/Admin/NoDataMessage";
import { useState } from "react";
import ChangeStatusModal from "@/Components/Admin/ChangeStatusModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Pagination from "@/Common/Pagination";
import FilterReportModal from "@/Components/Modals/Admin/FilterReportsModal";
import ChooseUserModal from "@/Components/Modals/Admin/ChooseUserModal";
import CaptionModal from "@/Components/Modals/Admin/CaptionModal";

const DutiesList = () => {

    const [openStatusModal, setOpenStatusModal] = useState<number | null>(null)
    const [filterDutiesModal, setFilterDutiesModal] = useState<boolean>(false)
    const [chooseUserModal, setChooseUserModal] = useState<boolean>(false)
    const [captionModal, setCaptionModal] = useState<boolean>(false)
    const [captionData, setCaptionData] = useState<string>("")
    const [userId, setUserId] = useState<string | number>("")

    const { users }: any = usePage<{ vacations: User[] }>().props
    const { duties }: any = usePage<{ duties: AdminDuties[] }>().props
    const { duties_count } = usePage<{ duties_count: number }>().props
    console.log(duties)

    const handleDelete = (duties_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این ماموریت داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('duties.destroy', duties_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    const handleToggleModal = (id: number) => {
        setOpenStatusModal(prevState => (prevState === id ? null : id));
    }

    const sendUserId = () => {
        router.get(route('duties.index', { user_id: userId }))
    }

    const handleCaption = (caption: string) => {
        setCaptionData(caption)
        setCaptionModal(true)
    }

    return (
        <>
            <AdminLayout>
                <section className="home">
                    <section className="home-content">
                        <section className="recent-transactions">
                            <header className="flex items-center justify-between">
                                <h1 className="recent-transactions-label">درخواست های ماموریت</h1>
                            </header>

                            <TableInfo icon="connect-bank.svg" count={duties_count} title="ماموریت ثبت شده" linkCreate="duties.create" linkLabel="افزودن ماموریت" linkStatus={false} className={""} />

                            <div
                                className="flex max-md:flex-col items-center pb-3.5 gap-4 border-b border-gray-200">
                                <button
                                    className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                    onClick={() => setChooseUserModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>

                                    <p>فیلتر براساس کاربر</p>
                                </button>

                                <button
                                    className="px-10 py-3 bg-blue-500 rounded-full text-white w-full md:w-fit flex items-center justify-center gap-1.5"
                                    onClick={() => setFilterDutiesModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>

                                    <p>فیلتر براساس ماه های سال</p>
                                </button>
                            </div>

                            {
                                duties.data.length > 0 ?
                                    <div className="overflow-x-auto">
                                        <Table className="whitespace-nowrap">
                                            <TableHeader>
                                                <TableRow className="text-[13px]">
                                                    <TableHead>درخواست دهنده</TableHead>
                                                    <TableHead>تاریخ ثبت</TableHead>
                                                    <TableHead>تاریخ ماموریت</TableHead>
                                                    <TableHead>از تاریخ</TableHead>
                                                    <TableHead>تا تاریخ</TableHead>
                                                    <TableHead>نام پروژه</TableHead>
                                                    <TableHead>محل ماموریت</TableHead>
                                                    <TableHead>وسیله حمل و نقل</TableHead>
                                                    <TableHead>وضعیت</TableHead>
                                                    <TableHead>توضیحات</TableHead>
                                                    <TableHead>حذف</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {
                                                    duties.data.map((duty: any, i: any) => (
                                                        <TableRow key={i} className="font-bold">
                                                            <TableCell className="p-4">
                                                                {duty.user.fullname}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {moment(duty.created_at).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {moment(duty.date_of_request).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {moment(duty.of_date).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {moment(duty.to_date).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {duty.project}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {duty.place}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {duty.transporter}
                                                            </TableCell>

                                                            <TableCell className="relative p-4">
                                                                <button type="button" onClick={() => handleToggleModal(duty.id)}>
                                                                    {
                                                                        duty.status === "confirming" ?
                                                                            <WaitingStatus label="در انتظار تایید" /> : (duty.status === 'confirmed' ?
                                                                                <ActiveStatus label="تایید شده" /> :
                                                                                <InactiveStatus label="تایید نشده" />)
                                                                    }
                                                                </button>

                                                                {
                                                                    openStatusModal === duty.id ?
                                                                        <ChangeStatusModal
                                                                            id={duty.id}
                                                                            activeStatusLabel="تایید"
                                                                            waitingStatusLabel="در انتظار تایید"
                                                                            inactiveStatusLabel="رد کردن"
                                                                            link="change.duty.status"
                                                                        />
                                                                        : ""
                                                                }
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                <button type="button" className="view-all-btn py-1.5 px-4" onClick={() => handleCaption(duty.description)}>مشاهده توضیحات</button>
                                                            </TableCell>

                                                            <TableCell>
                                                                <button type="button" className="view-all-btn py-1.5 px-4" onClick={() => handleDelete(duty.id)}>حذف</button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>

                                        <Pagination links={duties.links} />
                                    </div>
                                    :
                                    <NoDataMessage message="هیچ ماموریتی ثبت نشده است" />
                            }
                        </section>
                    </section>
                </section>
            </AdminLayout>

            <FilterReportModal
                state={filterDutiesModal}
                setState={setFilterDutiesModal}
            />

            <ChooseUserModal
                users={users}
                state={chooseUserModal}
                setState={setChooseUserModal}
                idState={userId}
                setIdState={setUserId}
                sendFun={sendUserId}
            />

            <CaptionModal
                state={captionModal}
                setState={setCaptionModal}
                title="توضیحات ماموریت"
                caption={captionData}
            />
        </>
    )
}

export default DutiesList
