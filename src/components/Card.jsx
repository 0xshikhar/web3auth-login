import Router, { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";

function Card() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [open, setOpen] = useState("client");

    const handleTabOpen = (tabCategory) => {
        setOpen(tabCategory);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add your email submission logic here, like making an API request to send the email.
        console.log('Email submitted:', email);
    };

    const handleOnChange = (e) => {

        setEmail(e.target.value);
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            console.log("valid email");

        }
        else {
            console.log("invalid email");
            setEmailError(true);
        }
    }



    return (
        <>
            <section className="my-25 lg:my-[120px] md:bg-white">
                <div className="container w-[290px] md:w-[660px] bg-[#F1F1F1] rounded-[34px]">
                    <div className="flex flex-wrap">
                        <div className="w-full">
                            <div className="">
                                <div className="flex flex-wrap md:bg-white">
                                    <div className={`w-1/2 rounded-t-[30px] py-4 px-1 md:px-4 text-sm font-semibold md:text-base lg:px-12 hover:underline-offset-8
                                            transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer ${open === "client" ? "bg-[#F1F1F1] text-black underline-offset-8" : " "
                                        }`}>
                                        <button
                                            onClick={() => handleTabOpen("client")}
                                        >
                                            Client
                                        </button>
                                    </div>

                                    <div className="w-1/2 rounded-t-[30px]">
                                        <div className={`rounded-t-[30px] py-4 px-4 text-sm font-semibold md:text-base lg:px-12 hover:underline-offset-8
                                            transition-all delay-75 text-black  cursor-pointer ${open === "auditor" ? "bg-[#F1F1F1] text-black underline-offset-8" : " "
                                            }`}>
                                            <button
                                                onClick={() => handleTabOpen("auditor")}
                                            >
                                                Auditors
                                            </button>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                        {
                            open === "client" ? (
                                <div className="px-2 md:px-10 pt-3 w-full md:h-[300px]">
                                    <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                        <button className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={25} height={25} />
                                            <div className="text-black">Login using your Google Account</div>
                                        </button>
                                    </div>
                                    <div class=" h-[0px] border my-6 border-neutral-300"></div>
                                    <div className="text-black">
                                        <div className="text-left px-2 md:px-0"> Email
                                        </div>
                                        <div className="mt-3 text-left">
                                            <form onSubmit={handleSubmit}>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder="Email address"
                                                    value={email}
                                                    onChange={(e) => handleOnChange(e)}
                                                    required
                                                    className="peer px-10 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                                />
                                                {emailError ? (<p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                                                    Please provide a valid email address.
                                                </p>)
                                                    :
                                                    (" ")
                                                }
                                                <div className="flex align-middle justify-center items-center">
                                                    <button type="submit"
                                                        className="px-10 my-4 py-3 border flex gap-6 border-slate-200 dark:border-slate-700 bg-blue-950 rounded-[56px] text-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                                                    >Submit
                                                    </button>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) :

                                (
                                    <div className="px-2 md:px-10 pt-3 w-full md:h-[450px]">
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <button className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={25} height={25} />
                                                <div className="text-black">Login using your Google Account</div>
                                            </button>
                                        </div>
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <button className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                                <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="google logo" width={25} height={25} />
                                                <div className="text-black">Login using your Github Account</div>
                                            </button>
                                        </div>
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <button className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                                <Image src="/wallet.png" alt="google logo" width={25} height={25} />
                                                <div className="text-black">Login using your Wallet</div>
                                            </button>
                                        </div>
                                        <div class=" h-[0px] border my-6 border-neutral-300"></div>
                                        <div className="text-black">
                                            <div className="text-left px-2 md:px-0"> Email
                                            </div>
                                            <div className="mt-3 text-left">
                                                <form onSubmit={handleSubmit}>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        placeholder="Email address"
                                                        value={email}
                                                        onChange={(e) => handleOnChange(e)}
                                                        required
                                                        className="peer px-10 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                                    />
                                                    {emailError ? (<p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                                                        Please provide a valid email address.
                                                    </p>)
                                                        :
                                                        (" ")
                                                    }
                                                    <div className="flex align-middle justify-center items-center">
                                                        <button type="submit"
                                                            className="px-10 my-4 py-3 border flex gap-6 border-slate-200 dark:border-slate-700 bg-blue-950 rounded-[56px] text-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                                                        >Submit
                                                        </button>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </section >
        </>
    );
};

export default Card;

{/* <div class="w-[656px] h-[427px] bg-zinc-100 rounded-[34px] shadow border border-zinc-100"></div> */ }
