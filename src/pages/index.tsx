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
          <div className="m-auto flex flex-row items-center">
            <SupportTicketForm />
          </div>
        </div>
      </main>
      <footer className="-translate-y-1/26 absolute bottom-8 left-1/2 w-2/6 -translate-x-1/2 transform">
        <p className="text-center text-muted-foreground">
          View tickets
          <Link className="underline" href={`/support-tickets-list`}>
            here
          </Link>
        </p>
      </footer>
    </>
  );
}
