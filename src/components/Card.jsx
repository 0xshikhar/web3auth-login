import Router, { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
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


const clientId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

function Card() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [open, setOpen] = useState("client");

    const [web3auth, setWeb3auth] = useState();
    const [provider, setProvider] = useState();
    const [loggedIn, setLoggedIn] = useState();

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
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

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

    const addChain = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const newChain = {
            chainId: "0x5",
            displayName: "Goerli",
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            tickerName: "Goerli",
            ticker: "ETH",
            decimals: 18,
            rpcTarget: "https://rpc.ankr.com/eth_goerli",
            blockExplorer: "https://goerli.etherscan.io",
        };
        await web3auth?.addChain(newChain);
        uiConsole("New Chain Added");
    };

    const switchChain = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        await web3auth?.switchChain({ chainId: "0x5" });
        uiConsole("Chain Switched");
    };

    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const address = await rpc.getAccounts();
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

    const sendTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const receipt = await rpc.sendTransaction();
        uiConsole(receipt);
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

    const getPrivateKey = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const privateKey = await rpc.getPrivateKey();
        uiConsole(privateKey);
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
                                                    className="peer px-10 py-3 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 "
                                                />
                                                {emailError ? (<p className=" invisible peer-invalid:visible text-red-800 text-sm">
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
                                            <button onClick={login} className="px-10 items-center justify-center py-3 border flex gap-6 border-slate-200 text-center dark:border-slate-700 bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
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
                                            <CustomRainbowWallet />
                                        </div>
                                        <div className=" h-[0px] border my-6 border-neutral-300"></div>
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
