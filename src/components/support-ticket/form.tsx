import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useEffect, useState } from "react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  subject: z.string().min(1),
  problem: z.string().min(1).max(500),
});

export default function SupportTicketForm() {
  const [showAlert, setShowAlert] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Maybe could be a hook in the future
  const createSupportTickets = api.supportTickets.create.useMutation({
    onError: () => {
      alert("There was an issue creating your ticket");
    },
    onSuccess: () => {
      setShowAlert(true);
      form.reset(
        {
          email: "",
          name: "",
          problem: "",
          subject: "",
        },
        { keepDirty: false },
      );
    },
  });

  //temporary alert - future should be dismissable
  useEffect(() => {
    let showAlertTimeout: ReturnType<typeof setTimeout> = setTimeout(
      () => "",
      10000,
    );

    if (showAlert) {
      showAlertTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
    }

    return () => clearTimeout(showAlertTimeout);
  }, [showAlert]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {
        name: fullName,
        email: contactEmail,
        problem: problemDescription,
        subject,
      } = values;

      createSupportTickets.mutate({
        fullName,
        contactEmail,
        problemDescription,
        subject,
      });
    } catch (e: unknown) {
      // Report bug as this would be outside a client validation, would be server related
    }
  }

  return (
    <>
      {/* Ideally this would be a reusable banner component that we can then extend to have multiple variations */}
      {showAlert && (
        <Alert className="-translate-y-1/26 absolute left-1/2 top-8 w-2/6 -translate-x-1/2 transform">
          <AlertTitle className="text text-center">
            Ticket successfully created!
          </AlertTitle>
          <AlertDescription className="text-center">
            Admin only view -
            <Link href={`/support-tickets-list`} className="underline">
              Click Here to view the rest of the tickets.
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <div className="">
        <div className="pb-6">
          <h1 className="text-5xl font-black text-slate-900">
            Ticket Creation
          </h1>
          <div className="text-muted-foreground">
            The goal of this is to make a ticket that will be managed by
            customer support
          </div>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Full Name </FormLabel>
                      <FormControl>
                        <Input placeholder="Carlos Lahrssen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="carloslahrssen@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Subject </FormLabel>
                  <FormControl>
                    <Input placeholder="Issue subject here!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Problem Description </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Explain your problem in under 500 characters...
                  </FormDescription>
                  <FormControl>
                    <div className="grid w-full gap-2">
                      <Textarea
                        className="text-pretty"
                        placeholder="Ticket information here"
                        {...field}
                      />
                      <Button type="submit"> Submit ticket </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </>
  );
}
