interface NoDataProps {
    message?: string
}

const NoDataMessage = ({message}: NoDataProps) => {
    return (
        <section className="w-full p-10 max-md:p-5 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
            <img src="/static/icons/null.svg" alt="" className="w-1/2 max-md:w-full"/>
            <h1 className="text-26 font-bold mt-14 text-gray-600 max-md:text-16 text-center">{message}</h1>
        </section>
    )
}

export default NoDataMessage
