import DatepickerInput from "@/Components/datepicker.component";
import {Dialog, DialogContent} from "@/Components/ui/dialog";
import {router} from "@inertiajs/react";
import {useState} from "react";
import {useMediaQuery} from "react-responsive";
import {Drawer, DrawerContent} from "@/Components/ui/drawer";

interface FilterModalProps {
    state: boolean,
    setState: ((open: boolean) => void),
}

const FilterReportModal = ({state, setState}: FilterModalProps) => {

    const mobile = useMediaQuery({ maxWidth: "546px" })

    const [ofTime, setOfTime] = useState<string>("")
    const [toTime, setToTime] = useState<string>("")

    const ofTimeFormatedDate = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setOfTime(selectedDate)
    }

    const toTimeFormatedDate = (date: any) => {
        const selectedDate = `${date.year}/${(date.month.index + 1).toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
        setToTime(selectedDate)
    }

    const handleFilter = () => {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.set('of_date', ofTime);
        currentUrl.searchParams.set('to_date', toTime);

        currentUrl.searchParams.delete("page")

        const searchPart = currentUrl.search.startsWith('?') ? currentUrl.search : '?' + currentUrl.search;

        router.get(currentUrl.pathname + searchPart, {}, {
            preserveState: true,
            onSuccess: () => {
                if (setState) setState(false)
            }
        })
    }

    if (mobile) {
        return (
            <Drawer open={state} onOpenChange={setState}>
                <DrawerContent className="bg-white px-4 py-2">
                    <h1 className="text-2xl mt-5 text-center font-bold mb-5">فیلتر گزارشات</h1>

                    <div className="flex items-center gap-3">
                        <DatepickerInput id="of_time" name="of_time" label="از تاریخ" value={ofTime} onChange={ofTimeFormatedDate} />
                        <DatepickerInput id="to_time" name="to_time" label="تا تاریخ" value={toTime} onChange={toTimeFormatedDate} />
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="py-3 px-8 text-white bg-blue-500 rounded-md text-md w-full" onClick={handleFilter}>
                            ثبت فیلتر ها
                        </button>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <h1 className="text-2xl mt-5 text-center font-bold mb-5">فیلتر گزارشات</h1>

                <div className="flex items-center gap-3">
                    <DatepickerInput id="of_time" name="of_time" label="از تاریخ" value={ofTime} onChange={ofTimeFormatedDate} />
                    <DatepickerInput id="to_time" name="to_time" label="تا تاریخ" value={toTime} onChange={toTimeFormatedDate} />
                </div>

                <div className="mt-4">
                    <button type="submit" className="py-3 px-8 text-white bg-blue-500 rounded-md text-md w-full" onClick={handleFilter}>
                        ثبت فیلتر ها
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FilterReportModal
