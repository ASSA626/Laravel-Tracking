import { Dialog, DialogContent } from "@/Components/ui/dialog";
import React, { Dispatch } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";

interface UsersModalProps {
    state: boolean,
    setState: ((usersList: boolean) => void),
    idState: string | number,
    setIdState: Dispatch<React.SetStateAction<string | number>>
    users: any,
    sendFun: () => void
}

const ChooseUserModal = ({ state, setState, idState, setIdState, users, sendFun }: UsersModalProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white">
                    <section className="mt-8 px-4 py-3">
                        <h1 className="font-bold text-24 text-center">لیست کاربران</h1>

                        <div className="mt-6 grid grid-cols-2 max-md:grid-cols-1 gap-3 overflow-y-scroll h-[270px] with-scrollbar pl-1.5">
                            {
                                users.map((user: any, i: any) => (
                                    <div
                                        key={i}
                                        className={cn("flex items-center gap-2 w-full py-1.5 px-3.5 border-2 border-gray-400 rounded-lg cursor-pointer", {
                                            "border-green-500": idState === user.id
                                        })}
                                        onClick={() => setIdState(user.id)}
                                    >
                                        <img src={user.image} alt={user.image} className="w-[65px] h-[65px] rounded-full" />

                                        <div>
                                            <h1 className="text-md">{user.fullname}</h1>
                                            <span className="text-sm">{user.mobile}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <button onClick={sendFun} className="mt-5 w-full py-3 bg-blue-500 text-white rounded-md">
                            ارسال اطلاعات
                        </button>
                    </section>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <section className="mt-8">
                    <h1 className="font-bold text-24 text-center">لیست کاربران</h1>

                    <div className="mt-6 grid grid-cols-2 max-md:grid-cols-1 gap-3 overflow-y-scroll h-[270px] with-scrollbar pl-1.5">
                        {
                            users.map((user: any, i: any) => (
                                <div
                                    key={i}
                                    className={cn("flex items-center gap-2 w-full py-1.5 px-3.5 border-2 border-gray-400 rounded-lg cursor-pointer", {
                                        "border-green-500": idState === user.id
                                    })}
                                    onClick={() => setIdState(user.id)}
                                >
                                    <img src={user.image} alt={user.image} className="w-[65px] h-[65px] rounded-full" />

                                    <div>
                                        <h1 className="text-md line-clamp-1">{user.fullname}</h1>
                                        <span className="text-sm">{user.mobile}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <button onClick={sendFun} className="mt-5 w-full py-3 bg-blue-500 text-white rounded-md">
                        ارسال اطلاعات
                    </button>
                </section>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseUserModal
