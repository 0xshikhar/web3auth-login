"use client";

import Image from 'next/image'
import { useEffect } from 'react'
import { Web3Auth } from "@web3auth/modal";
import Card from '../components/Card'

export default function Home() {

  useEffect(() => {
    async function init() {
      const web3auth = new Web3Auth({
        clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Get your Client ID from the Web3Auth Dashboard
        web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://goerli.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
      });

      await web3auth.initModal();
    }
    init()


  }, [])
  return (
    <main className="flex h-screen sm:w-screen items-center justify-between bg-white">
      {/* create 2 column grid */}
        <div className="w-3/5 justify-center items-center align-middle text-center px-2 md:pl-[100px] md:mx-10 md:px-10 z-50">
          <Card />
        </div>
        <div className="w-2/5 md:justify-end ">
          <img src="/back.png" alt="background" className='h-screen w-[600px] object-fill md:object-cover md:rounded-bl-[150px] flex absolute top-0 right-0 bottom-0' />
          <div className="w-44 h-48 left-[124px] top-[385px] absolute flex-col justify-start items-center gap-8 inline-flex z-60">
            <div className="w-28 h-28 bg-white rounded-full"></div>
            <Image src="/ellipse.png" alt="logo" width={120} height={120} />
            <div className="w-44 h-9 text-white text-lg font-bold font-['DM Sans'] leading-7 z-60">ByteBreach</div>
          </div>

          {/* <div className='flex justify-center items-start align-middle'>
            <div className='text-6xl font-bold text-white'>ByteBreach</div>
            <Image src="/ellipse.png" alt="logo" width={120} height={120} />
          </div> */}

          {/* <div className="w-96 h-96 relative">
            <div className="w-96 h-96 left-0 top-0 absolute">
              <img src="/back.png" alt="background" className='h-screen object-fill md:object-cover md:rounded-bl-[150px] flex absolute top-0 right-0 bottom-0' />            </div>
            <div className="w-44 h-48 left-[224px] top-[385px] absolute flex-col justify-start items-center gap-8 inline-flex">
              <div className="w-28 h-28 bg-white rounded-full"></div>
              <div className="w-44 h-9 text-white text-3xl font-bold font-['DM Sans'] leading-7">ByteBreach</div>
            </div>
          </div> */}

        </div>

        {/* <div className="md:hidden bg-cover bg-center bg-[url('/back.png')]" >
          <div className="flex justify-center items-center align-middle text-center mx-10 px-10 z-50">
            <Card />
          </div>
        </div> */}

    </main>
  )
}

// rounded-bl-[150px] absolute top-0 right-0