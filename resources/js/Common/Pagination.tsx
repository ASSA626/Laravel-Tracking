import {Link} from "@inertiajs/react";
import {cn} from "@/lib/utils";

const Pagination = ({links, queryParams = {}}: {
    links: any,
    queryParams?: Record<string, string | number | null>
}) => {

    const addQueryParams = (url: string, params: Record<string, string | number | null>) => {
        const urlObj = new URL(url, window.location.origin);

        if (urlObj.protocol === "http:") {
            urlObj.protocol = "https:"
        } else (urlObj.hostname === 'localhost')
        {
            urlObj.protocol = 'http:'
        }

        Object.keys(params).forEach(key => {
            urlObj.searchParams.set(key, String(params[key]));
        });

        return urlObj.toString();
    }

    const params: Record<string, string | number | null> = queryParams || {}

    return (
        <section className="mt-6 mb-4">
            <div className="flex items-center gap-2">
                {
                    links.map((link: any, i: number) => (
                        <Link href={link.url ? addQueryParams(link.url, params) : '#'} preserveState
                              className={cn("bg-transparent border-2 border-blue-500 text-blue-500 px-3 py-1 rounded-md flex items-center justify-center font-bold", {
                                  "bg-blue-500 text-white": link.active,
                                  "cursor-not-allowed": !link.url
                              })} key={i}>
                            <p className="text-16">{link.label}</p>
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}

export default Pagination
