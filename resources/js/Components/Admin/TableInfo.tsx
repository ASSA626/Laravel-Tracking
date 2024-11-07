import {Link} from "@inertiajs/react";
import React, {MouseEventHandler} from "react";

interface TableInfoParams {
    icon: string,
    title: string,
    count: string | number,
    linkCreate: string,
    linkLabel?: string,
    linkStatus: boolean,
    className?: string,
    anotherButton?: boolean,
    anotherButtonFun?: MouseEventHandler<HTMLButtonElement>,
    anotherButtonLabel?: string
    children?: React.ReactNode
}

const TableInfo = ({icon, title,count = "", linkCreate, linkLabel, linkStatus = true, anotherButton = false, className = "", anotherButtonFun, anotherButtonLabel = "انتخاب کاربر", children}: TableInfoParams) => {
    return (
        <div className={"bank-info " + className}>
            <figure className="flex-center h-fit rounded-full bg-blue-100">
                <img src={`/static/icons/${icon}`} alt="icon"/>
            </figure>

            <div className="flex w-full flex-1 flex-col justify-center gap-1">
                <div className="bank-info_content">
                    <h2 className="text-16 line-clamp-1 flex-1 font-bold text-blue-900">
                        {`${count === null ? "" : count}  ${title}`}
                    </h2>

                    <div className="flex items-center gap-2">
                        {
                            anotherButton &&
                            <button className="text-blue-700 font-bold" onClick={anotherButtonFun}>
                                {anotherButtonLabel}
                            </button>
                        }

                        {
                            linkStatus &&
                            <Link href={route(linkCreate)} className="max-md:hidden text-blue-900 font-bold">
                                {linkLabel}
                            </Link>
                        }

                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableInfo
