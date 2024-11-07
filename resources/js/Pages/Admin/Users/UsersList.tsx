import AdminLayout from "@/Layouts/AdminLayout";
import TableInfo from "@/Components/Admin/TableInfo";
import {Link, router, usePage} from "@inertiajs/react";
import {AdminUsers} from "@/types";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table";
import {ActiveStatus, InactiveStatus} from "@/Components/Admin/TableStatuses";
import NoDataMessage from "@/Components/Admin/NoDataMessage";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Pagination from "@/Common/Pagination";

const UsersList = () => {

    const {users}: any = usePage<{ users: AdminUsers[] }>().props
    const {users_count} = usePage<{ users_count: number }>().props

    const handleDelete = (user_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این کارمند داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', user_id), {
                    onSuccess: () => toast.success("حذف با موفقیت انجام شد")
                })
            }
        });
    }

    return (
        <AdminLayout>
            <section className="home">
                <section className="home-content">
                    <section className="recent-transactions">
                        <header className="flex items-center justify-between">
                            <h1 className="recent-transactions-label">کارکنان شما</h1>
                        </header>

                        <TableInfo icon="connect-bank.svg" count={users_count} title="کاربر ثبت شده" linkCreate="users.create" linkLabel="افزودن کارکنان" linkStatus={true}/>

                        <div className="flex items-center justify-between md:justify-start md:hidden">
                            <Link href={route('users.create')} className="px-4 py-2.5 bg-blue-500 rounded-full text-white w-full text-center">
                                افزودن کارکن جدید
                            </Link>
                        </div>

                        {
                            users.data.length > 0 ?
                                <div className="overflow-x-auto">
                                    <Table className="whitespace-nowrap">
                                        <TableHeader>
                                            <TableRow className="text-[13px]">
                                                <TableHead className="px-4">نام و نام خانوادگی</TableHead>
                                                <TableHead className="px-4">نام کاربری</TableHead>
                                                <TableHead className="px-4">کدملی</TableHead>
                                                <TableHead className="px-4">شماره موبایل</TableHead>
                                                <TableHead className="px-4">شماره پرسنلی</TableHead>
                                                <TableHead className="px-4">شماره بیمه</TableHead>
                                                <TableHead className="px-4">فعالیت</TableHead>
                                                <TableHead className="px-4">بیمه</TableHead>
                                                <TableHead className="px-4">تنخواه</TableHead>
                                                <TableHead className="px-4">ویرایش</TableHead>
                                                <TableHead className="px-4">حذف</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {
                                                users.data.map((user: any, i: any) => (
                                                    <TableRow key={i} className="font-bold">
                                                        <TableCell className="p-4">
                                                            {user.fullname}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {user.username}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {user.national_code}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {user.mobile}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {user.personally_number ? user.personally_number : "ثبت نشده"}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {user.bimeh_number ? user.bimeh_number : "ثبت نشده"}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            <button type="button">
                                                                {
                                                                    user.user_activity === 1 ?
                                                                        <ActiveStatus label="فعال" />
                                                                        :
                                                                        <InactiveStatus label="غیرفعال" />
                                                                }
                                                            </button>
                                                        </TableCell>

                                                        <TableCell className="place-items-center p-4">
                                                            <button type="button">
                                                                {
                                                                    user.bimeh === 1 ?
                                                                        <ActiveStatus label="فعال" />
                                                                        :
                                                                        <InactiveStatus label="غیرفعال" />
                                                                }
                                                            </button>
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            <button type="button">
                                                                {
                                                                    user.days_function === 1 ?
                                                                        <ActiveStatus label="فعال" />
                                                                        :
                                                                        <InactiveStatus label="غیرفعال" />
                                                                }
                                                            </button>
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            <Link href={route('users.edit', user.id)} className="view-all-btn py-1.5 px-4">ویرایش</Link>
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            <button type="button" className="view-all-btn py-1.5 px-4" onClick={() => handleDelete(user.id)}>حذف</button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                    <Pagination links={users.links} />
                                </div>
                            :
                                <NoDataMessage message="هیچ کاربری ثبت نشده است" />
                        }
                    </section>
                </section>
            </section>
        </AdminLayout>
    )
}

export default UsersList
