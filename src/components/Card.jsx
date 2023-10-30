import Router, { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
    CHAIN_NAMESPACES,
    IProvider,
    WALLET_ADAPTERS,
} from "@web3auth/base";
import {
    OpenloginAdapter,
    OpenloginLoginParams,
} from "@web3auth/openlogin-adapter";
import CustomRainbowWallet from "./CustomRainbowWallet";
import { checkAddress } from "../utils/supabase";
import RPC from "../utils/RPC";
import { atom, useAtom } from 'jotai'
import { walletAddressAtom } from "../utils/state";

const clientId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

function Card() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [open, setOpen] = useState("client");

    const [web3auth, setWeb3auth] = useState();
    const [provider, setProvider] = useState();
    const [loggedIn, setLoggedIn] = useState();
    const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);

    useEffect(() => {
        const init = async () => {
            try {
                const chainConfig = {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0x1",
                    rpcTarget: "https://rpc.ankr.com/eth",
                    displayName: "Ethereum Goerli",
                    blockExplorer: "https://goerli.etherscan.io",
                    ticker: "ETH",
                    tickerName: "Ethereum",
                };
                const web3auth = new Web3AuthNoModal({
                    clientId,
                    chainConfig,
                    web3AuthNetwork: "sapphire_devnet",
                });

                const privateKeyProvider = new EthereumPrivateKeyProvider({
                    config: { chainConfig },
                });

                const openloginAdapter = new OpenloginAdapter({
                    adapterSettings: {
                        whiteLabel: {
                            appName: "ByteReach",
                            appUrl: "https://web3auth.io",
                            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
                            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
                            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
                            mode: "auto", // whether to enable dark mode. defaultValue: false
                            theme: {
                                primary: "#768729",
                            },
                            useLogoLoader: true,
                        },
                        mfaSettings: {
                            deviceShareFactor: {
                                enable: true,
                                priority: 1,
                                mandatory: true,
                            },
                            backUpShareFactor: {
                                enable: true,
                                priority: 2,
                                mandatory: false,
                            },
                            socialBackupFactor: {
                                enable: true,
                                priority: 3,
                                mandatory: false,
                            },
                            passwordFactor: {
                                enable: true,
                                priority: 4,
                                mandatory: false,
                            },
                        },
                    },
                    loginSettings: {
                        mfaLevel: "mandatory",
                    },
                    privateKeyProvider,
                });
                web3auth.configureAdapter(openloginAdapter);
                setWeb3auth(web3auth);

                // adding wallet connect v2 adapter
                // const defaultWcSettings = await getWalletConnectV2Settings(
                //   "eip155",
                //   [1],
                //   "04309ed1007e77d1f119b85205bb779d"
                // );
                // const walletConnectModal = new WalletConnectModal( {projectId: "04309ed1007e77d1f119b85205bb779d"});
                // const walletConnectV2Adapter = new WalletConnectV2Adapter({
                //   adapterSettings: {
                //     qrcodeModal: walletConnectModal,
                //     ...defaultWcSettings.adapterSettings,
                //   },
                //   loginSettings: { ...defaultWcSettings.loginSettings },
                // });

                // web3auth.configureAdapter(walletConnectV2Adapter);

                await web3auth.init();
                setProvider(web3auth.provider);
                if (web3auth.connected) {
                    setLoggedIn(true);
                    console.log("web3auth connected", web3auth.connected);

                    const rpc = new RPC(web3auth.provider);
                    const address = await rpc.getAccounts();
                    setWalletAddress(address);
                    console.log("address", address);
                    if (address.length > 0) {
                        console.log("check address", checkAddress(address[0]))
                        checkAddress(address[0]).then((res) => {
                            console.log("res:", res);
                            if (res) {
                                router.push("/dashboard");
                            }
                            else {
                                if (open === "client") {
                                    router.push("/client");
                                }
                                else {
                                    router.push("/auditor");
                                }
                            }
                        }
                        )
                    }
                    router.push("/dashboard");
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const userRoutes = async (provider) => {
        if (provider) {
            setLoggedIn(true);
            console.log("web3auth provider", provider);

            const rpc = new RPC(provider);
            const address = await rpc.getAccounts();
            setWalletAddress(address);
            console.log("address", address);
            if (address.length > 0) {
                console.log("check address", checkAddress(address[0]))
                checkAddress(address[0]).then((res) => {
                    console.log("res:", res);
                    if (res) {
                        router.push("/dashboard");
                    }
                    else {
                        if (open === "client") {
                            router.push("/client");
                        }
                        else {
                            router.push("/auditor");
                        }
                    }
                }
                )
            }
            router.push("/dashboard");
        }
    }


    const login = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const web3authProvider = await web3auth.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
                loginProvider: "google",

            }
        );
        setProvider(web3authProvider);
        userRoutes(web3authProvider);
    };

    const loginGithub = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const web3authProvider = await web3auth.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
                loginProvider: "github",
            }
        );
        setProvider(web3authProvider);
        userRoutes(web3authProvider);
    };

    const loginWithEmail = async (email) => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const web3authProvider = await web3auth.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
                loginProvider: "email_passwordless",
                extraLoginOptions: {
                    login_hint: email,
                },
            }
        );
        setProvider(web3authProvider);
        userRoutes(web3authProvider);
    };

    const authenticateUser = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const idToken = await web3auth.authenticateUser();
        uiConsole(idToken);
    };

    const getUserInfo = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const user = await web3auth.getUserInfo();
        uiConsole(user);
    };

    const logout = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };

    const getChainId = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const chainId = await rpc.getChainId();
        uiConsole(chainId);
    };

    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const address = await rpc.getAccounts();
        setWalletAddress(address);
        uiConsole(address);
    };

    const getBalance = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const balance = await rpc.getBalance();
        uiConsole(balance);
    };

    const signMessage = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const signedMessage = await rpc.signMessage();
        uiConsole(signedMessage);
    };


    const handleTabOpen = (tabCategory) => {
        setOpen(tabCategory);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add your email submission logic here, like making an API request to send the email.
        console.log('Email submitted:', email);
        loginWithEmail(email);
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

    function uiConsole(...args) {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
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
                                <div className="px-2 md:px-10 pt-3 w-full md:h-[310px]">
                                    <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                        <button onClick={login} className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={25} height={25} />
                                            <div className="text-black">Login using your Google Account</div>
                                        </button>
                                    </div>
                                    <div className=" h-[0px] border my-6 border-neutral-300"></div>
                                    <div className="mt-3 text-left">
                                        <form onSubmit={handleSubmit}>
                                            <div className="relative text-left">
                                                <div className="text-black text-left px-2 md:px-0"> Email
                                                </div>
                                                <div className="mt-3 ">
                                                    <span className="absolute inset-y-0 top-8 right-0 flex items-center pr-4">
                                                        <MdOutlineEmail size={25} className="text-gray-500" />
                                                    </span>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        placeholder="Email address"
                                                        value={email}
                                                        onChange={(e) => handleOnChange(e)}
                                                        required
                                                        icon={<MdOutlineEmail className="bg-black" />}
                                                        className="peer px-10 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                                    />
                                                </div>
                                            </div>

                                            {emailError ? (<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                                                Please provide a valid email address.
                                            </p>)
                                                :
                                                (" ")
                                            }
                                            <div className="flex align-middle justify-center items-center">
                                                <button type="submit"
                                                    className="px-10 my-4 py-3 border flex gap-6 border-slate-200 dark:border-slate-700 bg-blue-950 rounded-[56px] text-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-300 dark:hover:text-slate-300 hover:shadow transition duration-150"
                                                >Submit
                                                </button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            ) :

                                (
                                    <div className="px-2 md:px-10 pt-3 w-full md:h-[450px]">
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <button onClick={login} className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={25} height={25} />
                                                <div className="text-black">Login using your Google Account</div>
                                            </button>
                                        </div>
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <button onClick={loginGithub} className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                                <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="google logo" width={25} height={25} />
                                                <div className="text-black">Login using your Github Account</div>
                                            </button>
                                        </div>
                                        <div className="flex text-center justify-center items-center align-middle mt-3 ">
                                            <CustomRainbowWallet />
                                        </div>
                                        <div className=" h-[0px] border my-6 border-neutral-300"></div>

                                        <div className="mt-3 text-left">
                                            <form onSubmit={handleSubmit}>
                                                <div className="relative text-left">
                                                    <div className="text-black text-left px-2 md:px-0"> Email
                                                    </div>
                                                    <div className="mt-3 ">
                                                        <span className="absolute inset-y-0 top-8 right-0 flex items-center pr-4">
                                                            <MdOutlineEmail size={25} className="text-gray-500" />
                                                        </span>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            placeholder="Email address"
                                                            value={email}
                                                            onChange={(e) => handleOnChange(e)}
                                                            required
                                                            icon={<MdOutlineEmail className="bg-black" />}
                                                            className="peer px-10 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
                                                        />
                                                    </div>
                                                </div>

                                                {/* <div className="relative top-0 right-0 pr-3 flex items-center align pointer-events-none">
                                                    </div> */}
                                                {emailError ? (<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
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
                                )
                        }
                    </div>
                </div>
            </section >
        </>
    );
};

export default Card;

{/* <div className="w-[656px] h-[427px] bg-zinc-100 rounded-[34px] shadow border border-zinc-100"></div> */ }
