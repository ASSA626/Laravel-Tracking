import {Link} from "@inertiajs/react";
import {SidebarLinks} from "@/Constants";
import {cn} from "@/lib/utils";

const Sidebar = () => {
    return (
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link href={route('admin')} className="mb-12 flex cursor-pointer items-center gap-2">
                    <img src="/static/icons/logo.svg" alt="ساعتینو" width={34} height={34} className="size-[34px] max-xl:size-14"/>
                    <h1 className="sidebar-logo">ساعتینو</h1>
                </Link>

                {SidebarLinks.map((item) => (
                    <Link href={route(item.link)} key={item.label} className={cn("sidebar-link", {"bg-bank-gradient": route().current(item.link)})}>
                        <img
                            width={25}
                            src={item.icon}
                            alt={item.label}
                            className={cn({"brightness-[3] invert-0": route().current(item.link)})}
                        />

                        <p className={cn("sidebar-label", {"!text-white": route().current(item.link)})}>
                            {item.label}
                        </p>
                    </Link>
                ))}
            </nav>
        </section>
    )
}

export default Sidebar
