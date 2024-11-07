import {ActiveStatus, InactiveStatus, WaitingStatus} from "@/Components/Admin/TableStatuses";
import {Inertia} from "@inertiajs/inertia";
import {useState} from "react";
import InactiveVacationModal from "@/Components/Modals/Admin/InactiveVacationModal";

interface ChangeStatusProps {
    id: number,
    activeStatusLabel: string,
    inactiveStatusLabel: string,
    waitingStatusLabel: string,
    link: string,
    is_vacation?: boolean,
    setState?: any,
}

const ChangeStatusModal = ({id, activeStatusLabel, inactiveStatusLabel, waitingStatusLabel, link, is_vacation = false, setState}: ChangeStatusProps) => {

    const [logInactiveState, setLogInactiveState] = useState<boolean>(false)

    const handleChangeStatus = (status: string) => {
        Inertia.post(route(link, id), {status: status})
    }

    return (
        <>
            <div
                className="bg-white py-2.5 px-5 absolute flex items-center justify-center gap-2 bottom-[42px] -right-[39px] max-md:-right-[80px] border border-dashed border-gray-600 rounded-full shadow-lg shadow-gray-300">
                <button type="button" onClick={() => handleChangeStatus("confirmed")}>
                    <ActiveStatus label={activeStatusLabel}/>
                </button>

                <button type="button" onClick={() => handleChangeStatus('confirming')}>
                    <WaitingStatus label={waitingStatusLabel}/>
                </button>

                {
                    is_vacation ? (
                        <button type="button" onClick={() => setLogInactiveState(true)}>
                            <InactiveStatus label={inactiveStatusLabel}/>
                        </button>
                    ) : (
                        <button type="button" onClick={() => handleChangeStatus("unconfirmed")}>
                            <InactiveStatus label={inactiveStatusLabel}/>
                        </button>
                    )
                }

                <div
                    className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"/>
            </div>

            <InactiveVacationModal state={logInactiveState} setState={setLogInactiveState} link={link} vacation_id={id} statusState={setState}/>
        </>
    )
}

export default ChangeStatusModal
