import Head from "next/head";
import Link from "next/link";
import SupportTicketForm from "~/components/support-ticket/form";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ticket App</title>
        <meta name="description" content="Create Tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <div className="flex h-full">
          <div className="m-auto flex items-center">
            <SupportTicketForm />
          </div>
        </div>
      </main>
    </>
  );
}
