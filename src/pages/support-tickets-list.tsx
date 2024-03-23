import { inferRouterOutputs } from "@trpc/server";
import Head from "next/head";
import { useEffect, useState } from "react";
import { StatusButton } from "~/components/support-ticket/status-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

// Future improvements add routing here so that the selected ticket would be appended to url for easy sharing
export default function SupportTicketsList() {
  const [selectedTicketId, setSelectedTicketId] = useState();
  const [selectedTicket, setSelectedTicket] = useState({
    id: null,
    subject: null,
    contactEmail: null,
    problemDescription: null,
    fullName: null,
    status: null,
  });
  const list = api.supportTickets.list.useQuery();
  const { data } = api.supportTickets.getById.useQuery(
    { id: Number(selectedTicketId) },
    {
      enabled: !!selectedTicketId,
    },
  );

  useEffect(() => {
    if (data && data?.[0]?.id) {
      const ticket = data?.[0];
      // @ts-ignore
      setSelectedTicket({ ...ticket });
    }
  }, [selectedTicketId, data]);

  const viewTicket = (supportTicket: any) => {
    setSelectedTicketId(supportTicket.id);
    // This method is better than just using the existing card because it will be choosing the updated version of that card, not the one on intiial render
  };

  if (!list.data) {
    return <div> Loading </div>;
  }

  return (
    <>
      <Head>
        <title> Support Tickets list </title>
      </Head>
      <main className="h-screen">
        <div className="grid grid-cols-3 gap-10">
          <ul>
            {list.data.map((supportTicket) => {
              return (
                <li key={supportTicket.id}>
                  <Card
                    className="hover:cursor-pointer hover:bg-slate-100"
                    onClick={() => viewTicket(supportTicket)}
                  >
                    <CardHeader>
                      <CardTitle>{supportTicket.subject} </CardTitle>
                      <CardDescription>
                        {supportTicket.contactEmail}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ul>
          <div className="col-span-2">
            {!selectedTicket?.id ? (
              <p> Select a card to view it's content </p>
            ) : (
              selectedTicket.status &&
              selectedTicket.id && (
                <>
                  <Card>
                    <CardHeader className="grid grid-cols-3">
                      <CardTitle className="col-span-2">
                        {selectedTicket.subject}
                      </CardTitle>
                      <div className="text-right">
                        <StatusButton
                          id={selectedTicket.id}
                          ticketStatus={selectedTicket.status}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>Name: {selectedTicket.fullName}</div>
                      <div>Email: {selectedTicket.contactEmail}</div>
                      <div>Problem: {selectedTicket.problemDescription}</div>
                    </CardContent>
                  </Card>
                </>
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}
