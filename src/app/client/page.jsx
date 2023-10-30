import ClientForm from "../../components/ClientForm";

const Client = () => {

    return (
        <main className="flex h-screen sm:w-screen items-center justify-between bg-white">
            {/* create 2 column grid */}
            <div className="w-3/5 justify-center items-center align-middle text-center px-2 md:pl-[100px] md:mx-10 md:px-10 z-50">
                <ClientForm />
            </div>
            <div className="h-screen relative w-2/5 md:justify-end ">
                <img src="/back.png" alt="background" className='h-screen object-fill md:object-cover md:rounded-bl-[150px] flex absolute top-0 right-0 bottom-0' />
                <div className="absolute top-[250px] right-[160px] w-44 h-48 flex-col justify-center items-center align-middle gap-8 inline-flex z-60">
                    <div className="w-28 h-28 bg-white rounded-full"></div>
                    <img src="/ellipse.png" alt="logo" width={120} height={120} />
                    <div className="w-44 h-9 text-white text-center text-lg font-bold font-['DM Sans'] leading-7 z-60">ByteBreach</div>
                </div>
            </div>
        </main>
    )
}

export default Client;