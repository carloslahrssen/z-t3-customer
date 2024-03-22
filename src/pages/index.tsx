import Head from "next/head";
import Link from "next/link";
import { FormEvent } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const createSupportTickets = api.supportTickets.create.useMutation({
    onError: (e) => {
      alert('There was an issue creating your ticket')
    },
    onSuccess: () => {
      alert('Ticket created!')
    }
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const data = new FormData(event.currentTarget)

      const fullName = data.get('name')?.toString() ?? ''
      const contactEmail = data.get('email')?.toString() ?? ''
      const problemDescription = data.get('problem')?.toString() ?? ''
  
      const response = createSupportTickets.mutate({fullName, contactEmail, problemDescription})
      console.log(response)
    } catch(e: unknown) {
      // Report bug as this would be outside a client validation, would be server related
    }

  }

  return (
    <>
      <Head>
        <title>Ticket App</title>
        <meta name="description" content="Create Tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <div className="flex h-full">

            <div className="flex m-auto items-center gap-8">
              <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name"> Name </label>
                  <div>
                    <input name="name" placeholder="Carlos Lahrssen" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email"> Email </label>
                  <div>
                    <input name="email" type="email" placeholder="carloslahrssen@gmail.com"/>
                  </div>  
                </div>

                <div> 
                  <label htmlFor="problem">Problem</label>
                  <p> Description goes here in lighter text </p>
                  <div>
                  <textarea name="problem" className="text-pretty"></textarea> 
                  </div>  
                </div>

                <div>
                  <button type="submit" className="bg-black p-3 text-white">
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>

        </div>
      </main>
    </>
  );
}
