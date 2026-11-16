export default function Message({ text, images, position = false }: {
    text: string,
    images?: string[], position?: boolean
}) {
    const activeClass = position && "rounded-2xl! rounded-br-md! bg-blue-600! text-sm leading-relaxed text-white shadow-sm shadow-blue-600/20";

    const classPosition = position ? 'justify-start' : 'justify-end';

    return (
        <article className={`flex w-full ${classPosition} relative`}>
            <div className={`w-full rounded-2xl rounded-bl-md bg-slate-100 p-4 pb-3 text-sm text-slate-800 ${activeClass} h-max flex flex-col max-w-[85%] gap-1 
            sm:max-w-[70%]`}>
                <p className={`leading-relaxed text-[15px]`}>
                    {text}
                </p>
                {images && <hr className="border-gray-300 mt-2 mb-2" />}

                {images && (
                    <section className="w-full h-auto flex items-center gap-1.5 flex-wrap mt-2 pb-2">
                        {
                            images.map((img) => (
                                <span className="rounded-lg overflow-hidden w-60 grow h-50 bg-black group transition-all">
                                    <img src={img} className="w-full h-full object-cover transition-all" />
                                </span>
                            ))
                        }
                    </section>
                )}
            </div>
        </article>
    )
}