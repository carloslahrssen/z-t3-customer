"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/utils/api";

type Status = {
  value: "todo" | "progress" | "blocked" | "completed";
  label: string;
};

const statuses: Status[] = [
  {
    value: "todo",
    label: "New",
  },
  {
    value: "progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Resolved",
  },
  {
    value: "blocked",
    label: "Blocked",
  },
];

export function StatusButton({
  id,
  ticketStatus,
  onChange,
}: {
  id: number;
  ticketStatus: Status["value"];
  onChange: () => void;
}) {
  const changeTicketStatus = api.supportTickets.changeStatus.useMutation({
    onSuccess: () => {
      onChange();
    },
  });
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<Status["value"]>(ticketStatus);

  useEffect(() => {
    setSelectedStatus(ticketStatus);
  }, [ticketStatus]);

  const changeStatus = async (value: Status["value"]) => {
    try {
      setSelectedStatus(value);
      changeTicketStatus.mutate({
        status: value,
        id,
      });
    } catch (e) {
      // Report as we shouldn't be getting 500s
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {statuses.find((status) => selectedStatus === status.value)?.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandGroup heading="Statuses">
                {statuses.map((status) => {
                  return (
                    <CommandItem
                      key={status.value}
                      onSelect={() => changeStatus(status.value)}
                    >
                      <span> {status.label} </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
