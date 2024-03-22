import Head from "next/head";
import { useEffect } from "react";
import { api } from "~/utils/api";

interface CardListItemsProps {
  list: [];
}

function CardListItems({ list }: CardListItemsProps) {
  return <div>Hello</div>;
}

export default function SupportTicketsList() {
  const list = api.supportTickets.list.useQuery();

  console.log(list.data);

  return (
    <>
      <Head>
        <title> Support Tickets list </title>
      </Head>
      <main className="h-screen">
        <div>
          <ul>{/* <CardListItems list={list} /> */}</ul>
        </div>
      </main>
    </>
  );
}
