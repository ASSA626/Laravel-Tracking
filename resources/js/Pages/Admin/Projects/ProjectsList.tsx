import TableInfo from "@/Components/Admin/TableInfo";
import AdminLayout from "@/Layouts/AdminLayout";
import {Link, router, usePage} from "@inertiajs/react";
import {AdminProjects} from "@/types";
import moment from "moment-jalaali";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table";
import NoDataMessage from "@/Components/Admin/NoDataMessage";
import toast from "react-hot-toast";
import Swal from "sweetalert2"
import Pagination from "@/Common/Pagination";

const ProjectsList = () => {

    const {projects}: any = usePage<{ projects: AdminProjects[] }>().props
    const {projects_count} = usePage<{ projects_count: number }>().props

    const handleDelete = (project_id: number) => {
        Swal.fire({
            title: "آیا اطمینان دارید؟",
            text: "با حذف این پروژه داده های آن قابل بازگردانی نخواهند بود!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "حذف کن",
            cancelButtonText: "انصراف"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('projects.destroy', project_id), {
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
                            <h1 className="recent-transactions-label">پروژه های ثبت شده</h1>
                        </header>

                        <TableInfo icon="connect-bank.svg" count={projects_count} title="پروژه های ثبت شده" linkCreate="projects.create" linkLabel="افزودن پروژه" linkStatus={true}/>

                        <div className="flex items-center justify-between md:justify-start md:hidden">
                            <Link href={route('projects.create')} className="px-4 py-2.5 bg-blue-500 rounded-full text-white w-full text-center">
                                افزودن پروژه جدید
                            </Link>
                        </div>

                        {
                            projects.data.length > 0  ?
                                <div className="overflow-x-auto">
                                    <Table className="whitespace-nowrap">
                                        <TableHeader>
                                            <TableRow className="text-[13px]">
                                                <TableHead className="px-4">عنوان پروژه</TableHead>
                                                <TableHead className="px-4">نام شرکت (شعبه)</TableHead>
                                                <TableHead className="px-4">ایجاد شده در تاریخ</TableHead>
                                                <TableHead className="px-4">ویرایش</TableHead>
                                                <TableHead className="px-4">حذف</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {
                                                projects.data.map((project: any, i: any) => (
                                                    <TableRow key={i} className="font-bold">
                                                        <TableCell className="p-4">
                                                            {project.title}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {project.company_name}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            {moment(project.created_at).format("jYYYY/jMM/jDD")}
                                                        </TableCell>

                                                        <TableCell className="p-4">
                                                            <Link href={route('projects.edit', project.id)} className="view-all-btn py-1.5 px-4">ویرایش</Link>
                                                        </TableCell>

                                                        <TableCell className="p-4" onClick={() => handleDelete(project.id)}>
                                                            <button type="button" className="view-all-btn py-1.5 px-4">حذف</button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                    <Pagination links={projects.links} />
                                </div>
                            :
                                <NoDataMessage message="هیچ پروژه ای ثبت نشده است"/>
                        }
                    </section>
                </section>
            </section>
        </AdminLayout>
    )
}

export default ProjectsList
