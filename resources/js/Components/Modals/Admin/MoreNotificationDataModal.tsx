import { Drawer, DrawerContent } from "@/Components/ui/drawer"
import { Dialog, DialogContent } from "@/Components/ui/dialog"
import { useMediaQuery } from "react-responsive"
import moment from "moment-jalaali"
import momentZone from "moment-timezone"

interface NotificationDataProps {
    state: boolean,
    setState: ((dataList: boolean) => void),
    data: any,
    type: string
}

const MoreNotificationDataModal = ({ state, setState, data, type }: NotificationDataProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const dateConverter = (time: string) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        const timePattern = /^\d{2}:\d{2}$/

        if (timePattern.test(time)) {
            const utcDateTimeString = `1970-01-01T${time}:00Z`
            const iranTime = momentZone.tz(utcDateTimeString, 'Asia/Tehran')

            return iranTime.format('ساعت HH:mm')
        } else if (datePattern.test(time)) {
            return moment(time).format("jYYYY/jMM/jDD")
        }
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white">
                    {
                        type === 'duty' && (
                            <div className="flex flex-col items-center px-6 py-3 gap-3">
                                <h1 className="text-xl font-bold mb-2">{type === 'duty' && "اطلاعات ماموریت"}</h1>

                                <div className="w-full flex items-center justify-between">
                                    <p>مکان:</p>
                                    <p>{data.place}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>پروژه:</p>
                                    <p>{data.project}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>از تاریخ:</p>
                                    <p>{moment(data.of_date).format("jYYYY/jMM/jDD")}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>تا تاریخ:</p>
                                    <p>{moment(data.to_date).format("jYYYY/jMM/jDD")}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>وسیله نقلیه</p>
                                    <p>{data.transporter}</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        type === 'salary' && (
                            <div className="flex flex-col items-center px-6 py-3 gap-3">
                                <h1 className="text-xl font-bold mb-2">{type === 'salary' && "اطلاعات تنخواه"}</h1>

                                <div className="w-full flex items-center justify-between">
                                    <p>عنوان تنخواه:</p>
                                    <p>{data.title}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>تعداد:</p>
                                    <p>{data.count} عدد </p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>مبلغ هر یک:</p>
                                    <p>{data.value} تومان </p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>مبلغ کل:</p>
                                    <p>{data.complete_value} تومان</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        type === 'vacation' && (
                            <div className="flex flex-col items-center px-6 py-3 gap-3">
                                <h1 className="text-xl font-bold mb-2">{type === 'vacation' && "اطلاعات مرخصی کاربر"}</h1>

                                <div className="w-full flex items-center justify-between">
                                    <p>تاریخ درخواست:</p>
                                    <p>{data.date_of_request}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>از زمان:</p>
                                    <p>{dateConverter(data.of_time)}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>تا زمان:</p>
                                    <p>{dateConverter(data.to_time)}</p>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <p>نوع مرخصی:</p>
                                    <p>{data.type}</p>
                                </div>
                            </div>
                        )
                    }
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                {
                    type === 'duty' && (
                        <div className="flex flex-col items-center py-3 gap-3">
                            <h1 className="text-xl font-bold mb-2">{type === 'duty' && "اطلاعات ماموریت"}</h1>

                            <div className="w-full flex items-center justify-between">
                                <p>مکان:</p>
                                <p>{data.place}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>پروژه:</p>
                                <p>{data.project}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>از تاریخ:</p>
                                <p>{moment(data.of_date).format("jYYYY/jMM/jDD")}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>تا تاریخ:</p>
                                <p>{moment(data.to_date).format("jYYYY/jMM/jDD")}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>وسیله نقلیه</p>
                                <p>{data.transporter}</p>
                            </div>
                        </div>
                    )
                }
                {
                    type === 'salary' && (
                        <div className="flex flex-col items-center py-3 gap-3">
                            <h1 className="text-xl font-bold mb-2">{type === 'salary' && "اطلاعات تنخواه"}</h1>

                            <div className="w-full flex items-center justify-between">
                                <p>عنوان تنخواه:</p>
                                <p>{data.title}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>تعداد:</p>
                                <p>{data.count} عدد </p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>مبلغ هر یک:</p>
                                <p>{data.value} تومان </p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>مبلغ کل:</p>
                                <p>{data.complete_value} تومان</p>
                            </div>
                        </div>
                    )
                }
                {
                    type === 'vacation' && (
                        <div className="flex flex-col items-center py-3 gap-3">
                            <h1 className="text-xl font-bold mb-2">{type === 'vacation' && "اطلاعات مرخصی کاربر"}</h1>

                            <div className="w-full flex items-center justify-between">
                                <p>تاریخ درخواست:</p>
                                <p>{data.date_of_request}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>از زمان:</p>
                                <p>{dateConverter(data.of_time)}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>تا زمان:</p>
                                <p>{dateConverter(data.to_time)}</p>
                            </div>

                            <div className="w-full flex items-center justify-between">
                                <p>نوع مرخصی:</p>
                                <p>{data.type}</p>
                            </div>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default MoreNotificationDataModal
