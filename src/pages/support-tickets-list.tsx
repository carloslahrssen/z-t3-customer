/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StatusButton } from "~/components/support-ticket/status-button";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { type SupportTicketWithReplies } from "~/server/db";
import { api } from "~/utils/api";

type Status = {
  value: "todo" | "progress" | "blocked" | "completed";
  label: string;
  color: string;
};

const statuses: Status[] = [
  {
    value: "todo",
    label: "New",
    color: "text-green-600",
  },
  {
    value: "progress",
    label: "In Progress",
    color: "text-slate-600",
  },
  {
    value: "completed",
    label: "Resolved",
    color: "",
  },
  {
    value: "blocked",
    label: "Blocked",
    color: "text-red-600",
  },
];

const formSchema = z.object({
  reply: z.string().min(1).max(500),
});

// Future improvements add routing here so that the selected ticket would be appended to url for easy sharing
export default function SupportTicketsList() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [selectedTicket, setSelectedTicket] =
    useState<SupportTicketWithReplies>();

  const list = api.supportTickets.list.useQuery();
  const repliesMutation = api.replies.create.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      form.reset({ reply: "" });
    },
  });

  useEffect(() => {
    if (selectedTicket?.id && list.data) {
      const findSelectedTicket = list.data.find(
        (ticket) => ticket.id === selectedTicket?.id,
      );

      setSelectedTicket(findSelectedTicket);
    }
  }, [list.data, selectedTicket?.id]);

  const viewTicket = (supportTicket: unknown) => {
    setSelectedTicket(supportTicket as SupportTicketWithReplies);
  };

  const statusColor = useCallback((status: string) => {
    return statuses.find((fStatus) => fStatus.value === status)?.color;
  }, []);

  const changeStatus = async () => {
    await queryClient.invalidateQueries();
  };

  const orderedList = useMemo(() => {
    if (list.data) {
      return list.data.sort((a, b) => b.id - a.id);
    }

    return [];
  }, [list.data]);

  const replyTicket = (data: { reply: string }) => {
    // mutate
    console.log(
      `“Would normally send email here with body: ${selectedTicket?.id} ${data.reply}`,
    );
    repliesMutation.mutate({
      message: data.reply,
      supportTicketId: Number(selectedTicket?.id),
    });
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
        <div className="mb-10 w-full gap-8 bg-slate-800 p-10">
          <div className="text-center text-xl font-black text-slate-100">
            Admin Portal
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <ul className="mx-8">
            {orderedList.map((supportTicket) => {
              return (
                <li key={supportTicket.id} className="mb-2">
                  <Card
                    className="hover:cursor-pointer hover:bg-slate-100"
                    onClick={() => viewTicket(supportTicket)}
                  >
                    <CardHeader>
                      <CardTitle>
                        <div className="grid grid-cols-3">
                          <div className="col-span-2">
                            {supportTicket.subject}
                          </div>
                          <div>
                            <p
                              className={`text-gre text-right text-sm font-black uppercase ${statusColor(supportTicket.status ?? "")}`}
                            >
                              {
                                statuses.find(
                                  (status) =>
                                    status.value == supportTicket.status,
                                )?.label
                              }
                            </p>
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {supportTicket.contactEmail}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ul>
          <div className="col-span-2 mr-8">
            {!selectedTicket?.id ? (
              <p> Select a card to view its content </p>
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
                          onChange={() => changeStatus()}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>Name: {selectedTicket.fullName}</div>
                      <div>Email: {selectedTicket.contactEmail}</div>
                      <div>Problem: {selectedTicket.problemDescription}</div>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-lg font-bold">Message History</p>
                        <ul>
                          {selectedTicket.replies.map((reply, index) => {
                            return (
                              <li
                                className="mx-2 my-4"
                                key={`${selectedTicket.id}-${index}`}
                              >
                                - {reply.message}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <Separator className="my-4" />

                      <div className="pt-4">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(replyTicket)}>
                            <FormField
                              control={form.control}
                              name="reply"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel> Reply to this ticket </FormLabel>
                                  <FormControl>
                                    <div className="grid w-full gap-2">
                                      <Textarea
                                        className="text-pretty"
                                        placeholder="Ticket information here"
                                        {...field}
                                      />
                                      <Button type="submit">
                                        Reply to ticket
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                      </div>
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
