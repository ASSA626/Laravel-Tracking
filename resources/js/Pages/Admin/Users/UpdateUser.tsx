import AdminLayout from "@/Layouts/AdminLayout";
import Input from "@/Components/Input.component";
import {useForm, usePage} from "@inertiajs/react";
import {Switch} from "@/Components/ui/switch";
import {ChangeEvent, FormEvent, useState} from "react";
import {User} from "@/types";

interface FormData {
    fullname: string,
    username: string,
    mobile: string,
    national_code: string,
    image: string|null,
    father_name: string,
    address: string,
    zip: string,
    personally_number: string,
    bimeh_number: string,
    home_phone: string,
    mobile_friend: string,
    user_activity: boolean,
    days_function: boolean,
    bimeh: boolean,
    _method: string
}

const CreateUser = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {user}: any = usePage<{ user: User }>().props

    const {data, setData, post, processing, errors} = useForm<FormData>({
        fullname: user.fullname || '',
        username: user.username || '',
        mobile: user.mobile || '',
        national_code: user.national_code || '',
        image: null,
        father_name: user.father_name || '',
        address: user.address || '',
        zip: user.zip || '',
        personally_number: user.personally_number || '',
        bimeh_number: user.bimeh_number || '',
        home_phone: user.home_phone || '',
        mobile_friend: user.mobile_friend || '',
        user_activity: user.user_activity,
        days_function: user.days_function,
        bimeh: user.bimeh,
        _method: 'PUT'
    })

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string); // پیش‌نمایش تصویر
            };
            reader.readAsDataURL(file); // خواندن فایل به صورت URL
        }
    }

    const handleSwitchChange = (field: keyof FormData) => {
        setData(field, !data[field]);
    };

    const handleUpdateUser = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('users.update', user.id), {
            forceFormData: true
        })
    }

    return (
        <AdminLayout>
            <section className="home">
                <section className="home-content">
                    <h1 className="recent-transactions-label">ویرایش کارکنان</h1>

                    <form className="flex flex-col gap-8" onSubmit={handleUpdateUser}>
                        <div className="w-full flex items-center justify-center md:justify-start">
                            <label htmlFor="profile">
                                <img src={selectedImage ? selectedImage : "/static/icons/users.svg"} alt="" width={175} className="rounded-full"/>
                                <input id="profile" type="file" hidden onChange={handleImageChange}/>
                            </label>
                        </div>

                        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-10">
                            <Input id="name" type="text" name="name" label="نام و نام خانوادکی" value={data.fullname} onChange={(e) => setData("fullname", e.target.value)} error={errors.fullname}/>
                            <Input id="username" type="text" name="username" label="نام کاربری" value={data.username} onChange={(e) => setData("username", e.target.value)} error={errors.username}/>
                            <Input id="mobile" type="text" name="mobile" label="شماره موبایل" value={data.mobile} onChange={(e) => setData("mobile", e.target.value)} error={errors.mobile}/>
                        </div>

                        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-10">
                            <Input id="national_code" type="text" name="national_code" label="کدملی" value={data.national_code} onChange={(e) => setData("national_code", e.target.value)} error={errors.national_code}/>
                            <Input id="zip" type="text" name="zip" label="کدپستی" value={data.zip} onChange={(e) => setData("zip", e.target.value)} error={errors.zip}/>
                            <Input id="personally_number" type="text" name="personally_number" label="شماره پرسنلی" value={data.personally_number} onChange={(e) => setData("personally_number", e.target.value)} error={errors.personally_number}/>
                        </div>

                        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-10">
                            <Input id="bimeh_number" type="text" name="bimeh_number" label="شماره بیمه" value={data.bimeh_number} onChange={(e) => setData("bimeh_number", e.target.value)} error={errors.bimeh_number}/>
                            <Input id="home_phone" type="text" name="home_phone" label="شماره تلفن منزل" value={data.home_phone} onChange={(e) => setData("home_phone", e.target.value)} error={errors.home_phone}/>
                            <Input id="father_name" type="text" name="father_name" label="نام پدر" value={data.father_name} onChange={(e) => setData("father_name", e.target.value)} error={errors.father_name}/>
                        </div>

                        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-10">
                            <Input id="mobile_friend" type="text" name="mobile_friend" label="شماره یکی از نزدیکان" value={data.mobile_friend} onChange={(e) => setData("mobile_friend", e.target.value)} error={errors.mobile_friend}/>
                            <Input id="address" type="text" name="address" label="آدرس..." value={data.address} onChange={(e) => setData("address", e.target.value)} error={errors.address} />
                        </div>

                        <div className="flex items-start gap-8">
                            <div className="flex items-center gap-1.5">
                                <Switch className="border border-gray-900" checked={data.bimeh} onCheckedChange={() => handleSwitchChange('bimeh')}/>
                                <p>بیمه</p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <Switch className="border border-gray-900" checked={data.days_function} onCheckedChange={() => handleSwitchChange('days_function')}/>
                                <p>تنخواه</p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <Switch className="border border-gray-900" checked={data.user_activity} onCheckedChange={() => handleSwitchChange('user_activity')}/>
                                <p>فعال</p>
                            </div>
                        </div>

                        <button type="submit" className="px-4 py-3 bg-blue-600 w-[225px] rounded-full text-white max-md:w-full md:mt-4 max-md:mb-5">
                            ویرایش کاربر
                        </button>
                    </form>
                </section>
            </section>
        </AdminLayout>
    )
}

export default CreateUser
