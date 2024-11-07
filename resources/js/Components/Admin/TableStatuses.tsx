interface StatusParams {
    label: string
}

export const InactiveStatus = ({label}: StatusParams) => {
    return (
        <div className="category-badge border border-red-700 bg-inherit">
            <div className="size-2 rounded-full bg-red-700"/>
            <p className="text-[12px] font-bold text-red-700">{label}</p>
        </div>
    )
}

export const ActiveStatus = ({label}: StatusParams) => {
    return (
        <div className="category-badge border border-success-600 bg-inherit">
            <div className="size-2 rounded-full bg-green-600"/>
            <p className="text-[12px] font-bold text-success-700">{label}</p>
        </div>
    )
}

export const WaitingStatus = ({label}: StatusParams) => {
    return (
        <div className="category-badge border-[#0047AB] bg-inherit">
            <div className="size-2 rounded-full bg-blue-500"/>
            <p className="text-[12px] font-bold text-blue-700">{label}</p>
        </div>
    )
}
