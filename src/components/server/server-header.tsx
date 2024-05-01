"use client";

import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="flex items-center px-3 w-full h-12 font-semibold border-b-2 transition text-md border-neutral-200 dark:border-neutral-800 dark:hover:bg-zinc-700/50 hover:bg-zinc-700/10">
          {server.name}
          <ChevronDown className="ml-auto w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black space-y-[2px] dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="py-2 px-3 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400"
          >
            Invite People
            <UserPlus className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="py-2 px-3 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="py-2 px-3 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="py-2 px-3 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="py-2 px-3 text-sm text-rose-500 cursor-pointer"
          >
            Delete Server
            <Trash className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="py-2 px-3 text-sm text-rose-500 cursor-pointer"
          >
            Leave Server
            <LogOut className="ml-auto w-4 h-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
