import type { NextPage } from "next";
import Head from "next/head";

import Navbar from "@/components/Navbar";
import UnlockedMessages from "@/components/UnlockedMessages";
import LockedMessages from "@/components/LockedMessages";
import EventLog from "@/components/EventLog";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>TimeLockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full max-w-[2000px] mx-auto flex-1 flex-col items-center justify-center p-20">
        <Navbar />
        <UnlockedMessages />
        <section className="flex space-x-6 flex-col items-start xl:flex-row w-full h-fit">
          <EventLog />
          <LockedMessages />
        </section>
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t border-white/10">
        <a
          className="flex items-center font-bold  justify-center gap-2"
          href="https://github.com/ConceptCodes/TimeLockr-dApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed with ❤️ by conceptcodes.eth
        </a>
      </footer>
    </div>
  );
};

export default Home;
