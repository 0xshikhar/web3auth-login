"use client"

import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import Router, { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStarOfLife } from "react-icons/fa";
import Company from "../../public/company.png";
import { PiGithubLogo } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { auditorClientData } from "../utils/supabase";
import { atom, useAtom } from 'jotai'
import { walletAddressAtom } from "../utils/state";

const userType = "auditor";

export default function AuditorForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        github: "",
        cost: "",
        twitter: "",
        sherlock: "",
        codeArena: "",
        invite: "",
    });
    const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
    console.log("wallet address", walletAddress[0]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        auditorClientData(walletAddress[0], userType, formData)
        router.push("/dashboard");
    };

    return (
        <section className="my-25 lg:my-[50px] md:bg-white">
            <div className="container w-[290px] md:w-[660px] md:h-[750px] bg-[#F1F1F1] rounded-[34px] shadow">
                <div className="px-5 pt-5 text-black text-left">
                    <div className="text-xl px-2 md:px-0 font-semibold "> Contact Details
                    </div>
                    <div className="text-sm pt-1 px-2 md:px-0 text-gray-500"> Enter your details to login
                    </div>
                    <div className=" h-[0px] border my-6 border-neutral-300"></div>

                    <form onSubmit={handleSubmit}>
                        <div className="relative pb-3">
                            <div className="text-black px-2 md:px-0 flex">Full Name {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
                            </div>
                            <div className="mt-1 ">
                                <span className="absolute inset-y-0 top-5 right-0 flex items-center pr-4">
                                    <AiOutlineUser size={25} className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    placeholder="John Carter"
                                    onChange={handleChange}
                                    required
                                    className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                />
                            </div>
                        </div>

                        <div className="relative pb-3">
                        <div className="text-black px-2 md:px-0 flex">Github {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
                            </div>
                            <div className="mt-1 ">
                                <span className="absolute inset-y-0 top-6 right-0 flex items-center pr-4">
                                    <Image src='/github.png' alt="github" width='20' height='20' />
                                </span>
                                <input
                                    type="text"
                                    id="github"
                                    name="github"
                                    value={formData.github}
                                    placeholder="eg. bytebreach"
                                    onChange={handleChange}
                                    required
                                    className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                />
                            </div>
                        </div>

                        <div className="relative pb-3">
                            <div className="text-black px-2 md:px-0 flex">Weekly Cost {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
                            </div>
                            <div className="mt-1 ">

                                <input
                                    type="text"
                                    id="cost"
                                    name="cost"
                                    value={formData.cost}
                                    placeholder="eg. 500$"
                                    onChange={handleChange}
                                    required
                                    className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                />
                            </div>
                        </div>

                        <div className="relative pb-3">
                            <div className="text-black px-2 md:px-0">Twitter
                            </div>
                            <div className="mt-1 ">
                                <span className="absolute inset-y-0 top-5 right-0 flex items-center pr-4">
                                    <Image src='/x.com.png' alt="x" width='20' height='20' />
                                </span>
                                <input
                                    type="text"
                                    id="twitter"
                                    name="twitter"
                                    value={formData.twitter}
                                    placeholder="eg. bytebreach"
                                    onChange={handleChange}
                                    required
                                    className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative pb-3 w-1/2">
                                <div className="text-black px-2 md:px-0">Sherlock
                                </div>
                                <div className="mt-1 ">
                                    <span className="absolute inset-y-0 top-5 right-0 flex items-center pr-4">
                                        <Image src='/sherlock.png' alt="x" width='20' height='20' />
                                    </span>
                                    <input
                                        type="text"
                                        id="sherlock"
                                        name="sherlock"
                                        value={formData.sherlock}
                                        placeholder="eg. bytebreach"
                                        onChange={handleChange}
                                        required
                                        className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                    />
                                </div>
                            </div>

                            <div className="relative pb-3 w-1/2">
                                <div className="text-black px-2 md:px-0">CodeArena
                                </div>
                                <div className="mt-1 ">
                                    <input
                                        type="text"
                                        id="codeArena"
                                        name="codeArena"
                                        value={formData.codeArena}
                                        placeholder="eg. bytebreach"
                                        onChange={handleChange}
                                        required
                                        className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className=" h-[0px] border my-3 border-neutral-300"></div>

                        <div className="relative pb-3">
                            <div className="text-black px-2 md:px-0 flex">Invite {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
                            </div>
                            <div className="mt-1 ">

                                <input
                                    type="text"
                                    id="invite"
                                    name="invite"
                                    value={formData.invite}
                                    placeholder="12345"
                                    onChange={handleChange}
                                    required
                                    className="peer px-6 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                />
                            </div>
                        </div>

                        <div className="flex align-middle justify-center items-center">
                            <button type="submit"
                                className="px-6 py-4 border flex gap-6 border-slate-200 dark:border-slate-700 bg-blue-950 rounded-[56px] text-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-200 dark:hover:text-slate-300 hover:shadow transition duration-150"
                            >Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
