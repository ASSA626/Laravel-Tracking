import {Sheet, SheetClose, SheetContent, SheetTrigger} from "@/Components/ui/sheet"
import {SidebarLinks} from "@/Constants";
import {Link} from "@inertiajs/react";
import {cn} from "@/lib/utils";

const MobileNavbar = () => {
    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <img src="/static/icons/hamburger.svg" alt="menu" width={30} height={30} className="mt-1.5"/>
                </SheetTrigger>

                <SheetContent side="right" className="bg-white border-none">
                    <Link href={route('admin')} className="mb-12 cursor-pointer flex items-center gap-1 mt-6">
                        <img src="/static/icons/logo.svg" alt="ساعتینو" width={34} height={34}/>
                        <h1 className="text-26 font-bold text-black-1">ساعتینو</h1>
                    </Link>

                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-2 text-white">
                                {SidebarLinks.map((item) => (
                                    <SheetClose asChild key={item.link}>
                                        <Link href={route(item.link)} key={item.label} className={cn("mobilenav-sheet_close w-full", {"bg-bank-gradient": route().current(item.link)})}>
                                            <div className="size-6 relative">
                                                <img src={item.icon} alt={item.label} width={20} height={20} className={cn({"brightness-[3] invert-0": route().current(item.link)})}/>
                                            </div>
                                            <p className={cn("text-16 font-semibold text-black-2", {"text-white": route().current(item.link)})}>
                                                {item.label}
                                            </p>
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNavbar
