import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";

import AddSVG from "public/add.svg";
import Event from "../components/Event";
import Message from "../components/Message";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import Progress from "../components/Progress";

import { useEvents } from "../hooks/useEvents";
// import { useMessages } from "../hooks/useMessages";

const Home: NextPage = () => {
  const [modalActive, setModalActive] = useState(false);

  const { events: _events, loading } = useEvents();
  const [events, setEvents] = useState(_events);

  // const { messages: _messages, loading: loading2 } = useMessages();
  // const [messages, setMessages] = useState(_messages);

  const todaysDate = () => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const date = `${month} ${year}`;
    return date;
  };

  const handleOnAdd = () => {
    setModalActive(true);
  };

  const handleOnModalClose = () => {
    setModalActive(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>TimeLockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal active={modalActive} handleOnClose={handleOnModalClose} />
      <main className="flex w-full flex-1 flex-col items-center p-20">
        <Navbar />

        <section className="flex flex-col w-full py-20 space-y-5">
          <h1 className="text-8xl text-left text-white font-bold">Messages</h1>
          <div className="flex w-full">
            <h2 className="text-gray-400 text-lg ">{todaysDate()}</h2>
          </div>
          <div className="flex flex-nowrap space-x-5 overflow-hidden overflow-x-scroll">
            <figure
              onClick={handleOnAdd}
              className="flex-none flex flex-col p-5 rounded items-center space-y-5 justify-center w-[350px] h-[250px] bg-custom-teal"
            >
              <AddSVG className="" />
              <h3 className="bg-custom-teal/80 font-bold text-lg">
                Add Message
              </h3>
            </figure>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Message
                  key={i}
                  messageId="0x1234567890"
                  message="This is a test message"
                  timestamp={167149355 + i}
                />
              ))}
          </div>
        </section>

        <section className="flex space-y-10 flex-col xl:flex-row w-full">
          <div className="flex flex-col w-full xl:w-1/2 space-y-5">
            <h1 className="text-4xl text-left text-white font-bold">Events</h1>
            <div className="flex flex-col w-full space-y-5 overflow-y-auto">
              <Event
                event={{
                  type: "MessageUnlocked",
                  timestamp: 1671323839,
                  address: "0x1234567890",
                }}
              />
              <Event
                event={{
                  type: "MessageLocked",
                  timestamp: 1671323839,
                  messageId: "0x123456789",
                }}
              />
              <Event
                event={{
                  type: "FeeUpdated",
                  timestamp: 1671323839,
                  oldFee: 1.23,
                  fee: 2.34,
                }}
              />
              <Event
                event={{
                  type: "MinimumLockUpTimeUpdated",
                  timestamp: 1671323839,
                  oldTime: 4,
                  minimumLockUpTime: 5,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col w-full xl:w-1/2 space-y-5">
            <h1 className="text-4xl text-left text-white font-bold">
              Progress
            </h1>
            <div className="flex flex-col w-full space-y-5 overflow-y-auto">
              <Progress messageId="0x1234567890" timestamp={1671850914} />
            </div>
          </div>
        </section>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center font-bold text-white justify-center gap-2"
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
