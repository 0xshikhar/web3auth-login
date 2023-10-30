"use client";

import Image from 'next/image'
import { useEffect } from 'react'
import { Web3Auth } from "@web3auth/modal";
import Card from '../components/Card'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://bxyhvkwqbpkopjfkdyox.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

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

// rounded-bl-[150px] absolute top-0 right-0