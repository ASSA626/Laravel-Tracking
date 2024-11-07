import AdminLayout from "@/Layouts/AdminLayout";
import HeaderBox from "@/Components/Admin/HeaderBox";

const Admin = () => {
    return (
        <AdminLayout>
            <section className="home">
                <div className="home-content">
                    <header className="home-header">
                        <HeaderBox subText=""/>
                    </header>
                </div>
            </section>
        </AdminLayout>
    )
}

export default Admin
