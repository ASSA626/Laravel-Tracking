import { useMediaQuery } from "react-responsive"
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import { router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface AdminProfileInterace {
    state: boolean,
    setState: ((usersList: boolean) => void),
}

const AdminProfileModal = ({ state, setState }: AdminProfileInterace) => {
    const { auth } = usePage<PageProps>().props

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const logout = () => {
        router.post(route('logout', auth.user.id))
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white">
                    <section className="mt-4 px-4 py-3 flex flex-col items-center justify-center">
                        <img src={auth.user.image} alt={auth.user.fullname} className="w-[150px]" />

                        <h1 className="text-2xl font-bold mb-1">{auth.user.fullname}</h1>
                        <p className="text-lg mb-2">شماره موبایل: {auth.user.mobile}</p>

                        <button className="w-full bg-[#ff2727] rounded-md text-white py-2.5 mt-4" onClick={logout}>خروج از حساب کاربری</button>
                    </section>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <section className="mt-4 flex flex-col items-center justify-center">
                    <img src={auth.user.image} alt={auth.user.fullname} className="w-[150px]" />

                    <h1 className="text-2xl font-bold mb-1">{auth.user.fullname}</h1>
                    <p className="text-lg mb-2">شماره موبایل: {auth.user.mobile}</p>

                    <button className="w-full bg-[#ff2727] rounded-md text-white py-2.5 mt-4" onClick={logout}>خروج از حساب کاربری</button>
                </section>
            </DialogContent>
        </Dialog>
    )
}

export default AdminProfileModal