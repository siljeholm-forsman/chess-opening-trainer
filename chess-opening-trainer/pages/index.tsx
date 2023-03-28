import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import useSWR from 'swr';
import Chessboard from '@/components/chessboard';


const inter = Inter({ subsets: ['latin'] })

//const fetcher = (url: string) => fetch(url, 
//  {"body": JSON.stringify({"opening": "London System"}), "method": "GET"}
//).then((res) => res.json())
const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = () => {
  const [openingName, setOpeningName] = useState<string>('London System')
  const { data, error, isLoading } = useSWR(
    `/api/openings/?opening=${openingName}`, 
    fetcher
    //(url) => fetch(
    //  url, 
    //  {
    //    body: JSON.stringify({"opening": openingName})
    //  }
    //).then((res) => res.json())
  );

  useEffect(() => {
    console.log(data);
  }, [data])

  return (
    <>
      <Head>
        <title>Chess Opening Trainer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* // center the chessboard with flexbox */}
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <input type="text" value={openingName} onChange={(e) => setOpeningName(e.target.value)} />
        <div className="">
          <Chessboard/>
        </div>
      </div>
    </>
  )
}

export default Home;