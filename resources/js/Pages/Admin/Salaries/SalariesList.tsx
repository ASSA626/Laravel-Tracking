import AdminLayout from "@/Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { AdminSalaries, User } from "@/types";
import TableInfo from "@/Components/Admin/TableInfo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ActiveStatus, InactiveStatus, WaitingStatus } from "@/Components/Admin/TableStatuses";
import moment from "moment-jalaali";
import NoDataMessage from "@/Components/Admin/NoDataMessage";
import ChangeStatusModal from "@/Components/Admin/ChangeStatusModal";
import { useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Pagination from "@/Common/Pagination";
import FilterReportModal from "@/Components/Modals/Admin/FilterReportsModal";
import ChooseUserModal from "@/Components/Modals/Admin/ChooseUserModal";
import CaptionModal from "@/Components/Modals/Admin/CaptionModal";

const SalariesList = () => {

    const [openStatusModal, setOpenStatusModal] = useState<number | null>(null)
    const [filterSalariesModal, setFilterSalariesModal] = useState<boolean>(false)
    const [chooseUserModal, setChooseUserModal] = useState<boolean>(false)
    const [captionModal, setCaptionModal] = useState<boolean>(false)
    const [captionData, setCaptionData] = useState<string>("")
    const [userId, setUserId] = useState<string | number>("")

    const { users }: any = usePage<{ vacations: User[] }>().props
    const { salaries }: any = usePage<{ salaries: AdminSalaries[] }>().props
    const { salaries_count } = usePage<{ salaries_count: number }>().props

    const handleDelete = (salary_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این تنخواه داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('salaries.destroy', salary_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    const handleToggleModal = (id: number) => {
        setOpenStatusModal(prevState => (prevState === id ? null : id));
    }

    const sendUserId = () => {
        router.get(route('salaries.index', { user_id: userId }))
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
                                <h1 className="recent-transactions-label">تنخواه ها</h1>
                            </header>

                            <TableInfo icon="connect-bank.svg" count={salaries_count} title="تنخواه ثبت شده" linkCreate="salaries.create" linkLabel="افزودن تنخواه" linkStatus={false} className={""} />

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
                                    onClick={() => setFilterSalariesModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>

                                    <p>فیلتر براساس ماه های سال</p>
                                </button>
                            </div>

                            {
                                salaries.data.length > 0 ?
                                    <div className="overflow-x-auto">
                                        <Table className="whitespace-nowrap">
                                            <TableHeader>
                                                <TableRow className="text-[13px]">
                                                    <TableHead className="px-4">درخواست دهنده</TableHead>
                                                    <TableHead className="px-4">عنوان تنخواه</TableHead>
                                                    <TableHead className="px-4">مقدار</TableHead>
                                                    <TableHead className="px-4">تعداد</TableHead>
                                                    <TableHead className="px-4">جمع کل</TableHead>
                                                    <TableHead className="px-4">تاریخ درخواست</TableHead>
                                                    <TableHead className="px-4">وضعیت</TableHead>
                                                    <TableHead className="px-4">توضیحات</TableHead>
                                                    <TableHead className="px-4">حذف</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {
                                                    salaries.data.map((salary: any, i: any) => (
                                                        <TableRow key={i} className="font-bold">
                                                            <TableCell className="p-4">
                                                                {salary.user.fullname}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {salary.title}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {salary.value} تومان
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {salary.count} عدد
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {salary.complete_value} تومان
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {moment(salary.created_at).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="relative p-4">
                                                                <button type="button" onClick={() => handleToggleModal(salary.id)}>
                                                                    {
                                                                        salary.status === "confirming" ?
                                                                            <WaitingStatus label="در انتظار تایید" /> : (salary.status === 'confirmed' ?
                                                                                <ActiveStatus label="تایید شده" /> :
                                                                                <InactiveStatus label="تایید نشده" />)
                                                                    }
                                                                </button>

                                                                {
                                                                    openStatusModal === salary.id ?
                                                                        <ChangeStatusModal
                                                                            id={salary.id}
                                                                            activeStatusLabel="تایید"
                                                                            waitingStatusLabel="در انتظار تایید"
                                                                            inactiveStatusLabel="رد کردن"
                                                                            link="change.salary.status"
                                                                        />
                                                                        : ""
                                                                }
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                <button type="button" className="view-all-btn py-1.5 px-4" onClick={() => handleCaption(salary.description)}>مشاهده توضیحات</button>
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                <button type="button" className="view-all-btn py-1.5 px-4" onClick={() => handleDelete(salary.id)}>حذف</button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>

                                        <Pagination links={salaries.links} />
                                    </div>
                                    :
                                    <NoDataMessage message="هیچ تنخواهی ثبت نشده است" />
                            }
                        </section>
                    </section>
                </section>
            </AdminLayout>

            <FilterReportModal
                state={filterSalariesModal}
                setState={setFilterSalariesModal}
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
                title="توضیحات تنخواه"
                caption={captionData}
            />
        </>
    )
}

export default SalariesList
