import {router, usePage} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import toast from "react-hot-toast";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import {cn} from "@/lib/utils";
import {useState} from "react";
import AnimationWrapper from "@/Common/AnimationWrapper";
import MoreNotificationDataModal from "@/Components/Modals/Admin/MoreNotificationDataModal";

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
    };
    created_at: string;
    notifiable_id: string;
}

const NotificationList = () => {

    const [tabActive, setTabActive] = useState<string>("readed")
    const [storeNotifData, setStoreNotifData] = useState<[]>([])
    const [storeNotifType, setStoreNotifType] = useState<string>("")
    const [moreNotifModal, setMoreNotifModal] = useState<boolean>(false)

    const {notifications}: any = usePage<{ notifications: Notification[] }>().props

    const handleReadNotification = (id: string) => {
        router.post(route('notification.read', id), {}, {
            onSuccess: () => toast.success("اعلان خوانده شد.")
        })
    }

    const reloadPage = () => {
        let currentUrl = window.location.href
        router.visit(currentUrl)
    }

    const handleSeeMoreData = (data: [], type: string) => {
        setStoreNotifData(data)
        setMoreNotifModal(true)
        setStoreNotifType(type)
    }

    return (
        <AdminLayout>
            <section className="home">
                <section className="home-content">
                    <section className="recent-transactions">
                        <header className="flex max-sm:flex-col items-center justify-between w-full">
                            <h1 className="recent-transactions-label">اعلان های ثبت شده</h1>

                            <button className="px-6 py-2.5 bg-bank-gradient active:bg-black-1 rounded-full text-white max-sm:mt-3 max-sm:w-full" onClick={reloadPage}>
                                بروزرسانی اعلان ها
                            </button>
                        </header>

                        <Tabs defaultValue="readed">
                            <TabsList>
                                <TabsTrigger value="readed" onClick={() => setTabActive("readed")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'readed'
                                        })}>
                                            اعلان های خوانده نشده
                                        </p>
                                    </div>
                                </TabsTrigger>

                                <TabsTrigger value="unreaded" onClick={() => setTabActive("unreaded")}>
                                    <div className="banktab-item">
                                        <p className={cn("line-clamp-1 flex-1 text-gray-500 font-bold", {
                                            "text-blue-500": tabActive === 'unreaded'
                                        })}>
                                            اعلان های خوانده شده
                                        </p>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="readed">
                                <AnimationWrapper>
                                    <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center gap-4">
                                        {
                                            notifications.map((notification: any, i: any) => (
                                                notification.read_at === null ? (
                                                    <div className="w-full p-4 border-dashed border border-gray-400 rounded-lg" key={i}>
                                                        <h1 className="text-lg font-bold">{notification.data.title}</h1>
                                                        <p className="mt-2 text-md max-sm:leading-7">{notification.data.notif}</p>

                                                        <div className="mt-4 flex items-center gap-x-2">
                                                            <button
                                                                className="px-4 py-2 bg-green-500 text-white rounded-full text-sm"
                                                                onClick={() => handleReadNotification(notification.id)}>
                                                                اعلان را خواندم
                                                            </button>

                                                            <button
                                                                className="px-4 py-2 bg-green-500 text-white rounded-full text-sm"
                                                                onClick={() => handleSeeMoreData(notification.data.more_data, notification.data.type)}>
                                                                مشاهده اطلاعات بیشتر
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            ))
                                        }
                                    </div>
                                </AnimationWrapper>
                            </TabsContent>

                            <TabsContent value="unreaded">
                            <AnimationWrapper>
                                    <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center gap-4">
                                        {
                                            notifications.map((notification: any, i: any) => (
                                                notification.read_at !== null ? (
                                                    <div className="w-full p-4 border-dashed border border-gray-400 rounded-lg" key={i}>
                                                        <h1 className="text-lg font-bold">{notification.data.title}</h1>
                                                        <p className="mt-2 text-md max-sm:leading-7">{notification.data.notif}</p>

                                                        <div className="mt-4 mb-1">
                                                            <span
                                                                className="px-4 py-2 bg-bank-gradient text-white rounded-full text-sm">
                                                                اعلان خوانده شده است
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            ))
                                        }
                                    </div>
                                </AnimationWrapper>
                            </TabsContent>
                        </Tabs>
                    </section>
                </section>
            </section>

            <MoreNotificationDataModal state={moreNotifModal} setState={setMoreNotifModal} data={storeNotifData} type={storeNotifType}/>
        </AdminLayout>
    )
}

export default NotificationList
