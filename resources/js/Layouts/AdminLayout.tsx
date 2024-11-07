import {ReactNode} from "react";
import Sidebar from "@/Components/Admin/Sidebar";
import MobileNavbar from "@/Components/Admin/MobileNavbar";
import Header from "@/Components/Admin/Header";
import AnimationWrapper from "@/Common/AnimationWrapper";
import {Toaster} from "react-hot-toast";

interface AdminLayParams {
    children: ReactNode
}

const AdminLayout = ({children}: AdminLayParams) => {
    return (
        <main className="flex w-full h-screen">
            <Toaster />
            <Sidebar />

            <div className="flex size-full flex-col">
                <Header />
                <div className="root-layout">
                    <img src="/static/icons/logo.svg" alt="ساعتینو" width={30} height={30}/>

                    <div>
                        <MobileNavbar />
                    </div>
                </div>

                <AnimationWrapper>
                    {children}
                </AnimationWrapper>
            </div>
        </main>
    )
}

export default AdminLayout
