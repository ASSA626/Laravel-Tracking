import {HeaderBoxProps} from "@/types";

const HeaderBox = ({subText}: HeaderBoxProps) => {
    return (
        <div className="header-box">
            <h1 className="header-box-title">
                {subText}
            </h1>
        </div>
    )
}

export default HeaderBox
