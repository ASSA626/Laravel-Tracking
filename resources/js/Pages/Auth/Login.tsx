import { Head, useForm } from "@inertiajs/react";
import InputAuth from "@/Components/InputAuth.component";
import { FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {

    const { data, setData, post, processing, reset } = useForm({
        username: "",
        password: "",
        remember: true
    })

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('login'), {
            onError: (err) => {
                Object.keys(err).forEach(key => {
                    toast.error(err[key]);
                });
            }
        });
    }

    return (
        <>
            <Head title="ورود به سیستم" />

            <main className="custom-login-bg">
                <Toaster />

                <div className="w-full flex items-center justify-center min-h-[100vh] bg-[rgba(0, 0, 0, 0.2)] max-sm:p-[20px]">
                    <form className="relative w-[450px] backdrop-blur-[16px] border-2 border-[#c6c3c3] rounded-[15px] p-[7.5em_2.5em_4em_2.5em] text-white shadow-xl shadow-[rgba(0, 0, 0, 0.3)] max-sm:p-[7.5em_1.5em_4em_1.5em]" onSubmit={handleLogin}>
                        <div className="absolute top-0 left-[50%] -translate-x-[50%] flex items-center justify-center bg-[#c6c3c3] w-[140px] h-[70px] rounded-b-[20px] login-header">
                            <span className="text-[30px] text-black font-bold">ورود</span>
                        </div>

                        <InputAuth id="username" type="text" name="username" label="نام کاربری" value={data.username} onChange={(e) => setData("username", e.target.value)} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-6 top-[15px] left-[20px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        } />

                        <InputAuth id="password" type="password" name="password" label="رمزعبور" value={data.password} onChange={(e) => setData("password", e.target.value)} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-6 top-[15px] left-[20px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        } />

                        <button type="submit" className="bg-[#ececec] text-gray-700 w-full h-[50px] text-[16px] font-bold border-none rounded-full transition-all duration-200 hover:bg-white mt-4">
                            {processing ? 'در حال پردازش...' : 'ورود'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Login
