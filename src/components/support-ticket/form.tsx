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

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  subject: z.string().min(1),
  problem: z.string().min(1).max(256),
});

export default function SupportTicketForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Maybe could be a hook in the future
  const createSupportTickets = api.supportTickets.create.useMutation({
    onError: (e) => {
      alert("There was an issue creating your ticket");
    },
    onSuccess: () => {
      alert("Ticket created!");
    },
  });

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
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
          //   className="grid w-full max-w-sm items-center gap-1.5"
        />
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
          //   className="grid w-full max-w-sm items-center gap-1.5"
        />
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
                Description goes here in lighter text
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
  );
}
