import {Dialog, DialogContent} from "@/Components/ui/dialog";

interface CaptionModal {
    state: boolean,
    setState: ((open: boolean) => void),
    title: string,
    caption: string
}

const CaptionModal = ({state, setState, title, caption}: CaptionModal) => {
    return (
        <Dialog open={state} onOpenChange={setState}>
            <DialogContent className="bg-white">
                <section className="mt-8">
                    <h1 className="text-24 text-center font-bold mb-4">{title}</h1>
                    
                    {
                        caption !== null ? (
                            <p className="text-14">{caption}</p>
                        ) : (
                            <p className="text-16 text-center font-bold bg-slate-100 p-4 border-2 border-dashed border-slate-500 rounded-md">چیزی برای نمایش ثبت نشده است</p>
                        )
                    }
                </section>
            </DialogContent>
        </Dialog>
    )
}

export default CaptionModal
