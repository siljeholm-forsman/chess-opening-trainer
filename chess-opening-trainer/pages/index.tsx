import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr';
import Chessboard from '@/components/chessboard';
import { Chess } from 'chess.js';
import * as ch from 'chess.js';


const inter = Inter({ subsets: ['latin'] })

//const fetcher = (url: string) => fetch(url, 
//  {"body": JSON.stringify({"opening": "London System"}), "method": "GET"}
//).then((res) => res.json())
const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home = () => {
  const [theoryGame, setTheoryGame] = useState<Chess>(new Chess());
  const theoryHistoryRef = useRef<ch.Move[]>([]); 
  const [lastMoveIsCorrect, setLastMoveIsCorrect] = useState<boolean | null>(null);
  const [theoryOver, setTheoryOver] = useState<boolean>(false);
  const [openingName, setOpeningName] = useState<string>('London System')
  const { data, error, isLoading } = useSWR(
    `/api/openings/?opening=${openingName}`, 
    fetcher
  );
  const [pgn, setPgn] = useState<string>('');

  useEffect(() => {
    if (data?.pgn) {
      setPgn(data.pgn)
    }
  }, [data])

  useEffect(() => {
    theoryGame.loadPgn(pgn);
    theoryHistoryRef.current = theoryGame.history({verbose: true});
  }, [pgn])

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
        {theoryOver ? <p>Opening complete</p> : lastMoveIsCorrect === null ? null : lastMoveIsCorrect ? <p>Correct!</p> : <p>Incorrect!</p>}
        <div className=" grow aspect-square">
          <Chessboard 
            onMove={(currentMove: ch.Move, history: ch.Move[]) => {
              console.log(theoryHistoryRef.current);
              if (!theoryHistoryRef.current) return;
              if (history.length > theoryHistoryRef.current.length) {
                setTheoryOver(true);
                console.log('theory over')
                return;
              }
              if (currentMove.after === theoryHistoryRef.current[history.length - 1].after) {
                console.log('correct move')
                setLastMoveIsCorrect(true);
              } else {
                console.log('incorrect move')
                setLastMoveIsCorrect(false);
              }
            }}
            getNextMove={(history: ch.Move[]) => {
              if (!theoryHistoryRef.current) return;
              if (history.length >= theoryHistoryRef.current.length) {
                setTheoryOver(true);
                console.log('theory over')
                return;
              }
              return theoryHistoryRef.current[history.length];
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Home;