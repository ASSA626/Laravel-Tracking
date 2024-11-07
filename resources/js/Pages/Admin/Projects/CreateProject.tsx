import AdminLayout from "@/Layouts/AdminLayout";
import Input from "@/Components/Input.component";
import {useForm} from "@inertiajs/react";
import {FormEvent} from "react";
import SelectBox from "@/Components/SelectBox.component";

const CreateProject = () => {

    const {data, setData, post, processing, errors} = useForm({
        title: '',
        company_name: '',
    })

    const handleCreateProject = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('projects.store'))
    }

    return (
        <AdminLayout>
            <section className="home">
                <section className="home-content">
                    <h1 className="recent-transactions-label">افزودن پروژه جدید</h1>

                    <form className="flex flex-col gap-8" onSubmit={handleCreateProject}>
                        <div className="flex items-center gap-6 max-md:flex-col max-md:gap-10">
                            <Input id="title" type="text" name="title" label="عنوان پروژه" value={data.title} onChange={(e) => setData("title", e.target.value)} error={errors.title}/>
                            <SelectBox id="company_name" name="company_name" label="انتخاب شرکت" value={data.company_name} onChange={(e) => setData("company_name", e.target.value)} error={errors.company_name}>
                                <option hidden></option>
                                <option value="شرکت 1">شرکت 1</option>
                            </SelectBox>
                        </div>

                        <button type="submit" className="px-4 py-3 bg-blue-600 w-[225px] rounded-full text-white max-md:w-full md:mt-4 mb-5">
                            ثبت پروژه جدید
                        </button>
                    </form>
                </section>
            </section>
        </AdminLayout>
    )
}

export default CreateProject
