import NoDataMessage from "@/Components/Admin/NoDataMessage"
import TableInfo from "@/Components/Admin/TableInfo"
import CaptionModal from "@/Components/Modals/Admin/CaptionModal"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table"
import AdminLayout from "@/Layouts/AdminLayout"
import {Clock, Project} from "@/types"
import {Link, router, usePage} from "@inertiajs/react"
import moment from "moment-jalaali";
import {useState} from "react"
import CreateClockWorkModal from "@/Components/Modals/Admin/Reports/UserWorks/CreateClockWorkModal";
import UpdateClockWorkModal from "@/Components/Modals/Admin/Reports/UserWorks/UpdateClockWorkModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserWorksList = () => {

    const goBack = () => {
        window.history.back();
    };

    const [captionModal, setCaptionModal] = useState<boolean>(false)
    const [captionData, setCaptionData] = useState<string>("")
    const [addUserWorkModal, setAddUserWorkModal] = useState<boolean>(false)
    const [updateUserWorkModal, setUpdateUserWorkModal] = useState<boolean>(false)
    const [updateUserWorkId, setUpdateUserWorkId] = useState<number|null>(null)

    const {clock}: any = usePage<{ clock: Clock[] }>().props
    const {user_works}: any = usePage<{ user_works: any }>().props
    const {userworks_count}: any = usePage<{ userworks_count: number }>().props
    const {projects}: any = usePage<{ projects: Project[] }>().props

    const handleCaptionModal = (caption: string) => {
        setCaptionData(caption)
        setCaptionModal(true)
    }

    const handleUpdateModal = (id: number) => {
        setUpdateUserWorkId(id)
        setUpdateUserWorkModal(true)
    }

    const handleDeleteWork = (work_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این کارکرد داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('userworks.delete', work_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    return (
        <>
            <AdminLayout>
                <section className="home">
                    <section className="home-content">
                        <section className="recent-transactions">
                            <header>
                                <h1 className="recent-transactions-label">مشاهده کارکرد</h1>
                                <p className="font-bold text-md text-slate-600 mt-4">برای ساعت ثبت شده در
                                    تاریخ {moment(clock.date).format("jYYYY/jMM/jDD")}</p>
                            </header>

                            <TableInfo icon="connect-bank.svg" count={userworks_count} title="کارکرد های ثبت شده"
                                       linkLabel="افزودن کارکرد" linkCreate="" linkStatus={false} anotherButton={true}
                                       anotherButtonLabel="افزودن کارکرد"
                                       anotherButtonFun={() => setAddUserWorkModal(true)}/>

                            {
                                user_works.length > 0 ?
                                    <div className="overflow-x-auto">
                                        <Table className="whitespace-nowrap">
                                            <TableHeader>
                                                <TableRow className="text-[13px]">
                                                    <TableHead className="px-4">تاریخ ثبت</TableHead>
                                                    <TableHead className="px-4">نام پروژه</TableHead>
                                                    <TableHead className="px-4">مقدار زمان</TableHead>
                                                    <TableHead className="px-4">توضیحات</TableHead>
                                                    <TableHead className="px-4">ویرایش</TableHead>
                                                    <TableHead className="px-4">حذف</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {
                                                    user_works.map((user_work: any, i: any) => (
                                                        <TableRow key={i} className="font-bold">
                                                            <TableCell className="p-4">
                                                                {moment(user_work.created_at).format("jYYYY/jMM/jDD")}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {user_work.project}
                                                            </TableCell>

                                                            <TableCell className="p-4">
                                                                {user_work.time_value}
                                                            </TableCell>

                                                            <TableCell>
                                                                <button type="button"
                                                                        className="view-all-btn py-1.5 px-4"
                                                                        onClick={() => handleCaptionModal(user_work.description)}>مشاهده
                                                                    توضیحات
                                                                </button>
                                                            </TableCell>

                                                            <TableCell>
                                                                <button type="button"
                                                                        className="view-all-btn py-1.5 px-4"
                                                                        onClick={() => handleUpdateModal(user_work.id)}>
                                                                    ویرایش
                                                                </button>
                                                            </TableCell>

                                                            <TableCell>
                                                                <button type="button"
                                                                        className="view-all-btn py-1.5 px-4"
                                                                        onClick={() => handleDeleteWork(user_works.id)}>
                                                                    حذف
                                                                </button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                    :
                                    <NoDataMessage message="هیچ کارکردی ثبت نشده"/>
                            }
                            <div className="flex w-full justify-end mt-3">
                                <button onClick={goBack}
                                      className="text-bankGradient font-bold text-sm py-2 px-5 border-2 border-dashed border-bankGradient rounded-full hover:border-1 hover:bg-bankGradient hover:text-white transition-colors">برگشت
                                    به صفحه قبل</button>
                            </div>
                        </section>
                    </section>
                </section>
            </AdminLayout>

            <CaptionModal
                state={captionModal}
                setState={setCaptionModal}
                title="توضیحات کارکرد"
                caption={captionData}
            />

            <CreateClockWorkModal
                state={addUserWorkModal}
                setState={setAddUserWorkModal}
                projects={projects}
            />

            <UpdateClockWorkModal
                state={updateUserWorkModal}
                setState={setUpdateUserWorkModal}
                projects={projects}
                work_id={updateUserWorkId}
            />
        </>
    )
}

export default UserWorksList
