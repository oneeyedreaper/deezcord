"use client";

import { MemberRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";


const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 w-4 h-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

interface MutationProps {
  memberId: string;
  role: MemberRole;
}

export function MembersModal() {
  const [loadingId, setLoadingId] = useState("");

  const router = useRouter();
  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModalOpen = isOpen && type === "members";
  const onModalClose = () => onClose();

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const { mutate: kick } = useMutation({
    mutationFn: async (memberId: string) => {
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      return response.data;
    },
    onMutate: (memberId) => {
      setLoadingId(memberId);
    },
    onSuccess: (server) => {
      router.refresh();
      onOpen("members", { server });
    },
    onError: console.error,
    onSettled: () => setLoadingId(""),
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: async ({ memberId, role }: MutationProps) => {
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });

      return response.data;
    },
    onMutate: ({ memberId }) => {
      setLoadingId(memberId);
    },
    onSuccess: (server) => {
      router.refresh();
      onOpen("members", { server });
    },
    onError: console.error,
    onSettled: () => setLoadingId(""),
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="overflow-hidden p-0 text-black bg-white">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="pr-6 mt-8 max-h-[420px]">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex gap-x-2 items-center mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex gap-x-1 items-center text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 w-4 h-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeRole({
                                    memberId: member.id,
                                    role: "GUEST",
                                  })
                                }
                              >
                                <Shield className="mr-2 w-4 h-4" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="ml-auto w-4 h-4" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  changeRole({
                                    memberId: member.id,
                                    role: "GUEST",
                                  })
                                }
                              >
                                <ShieldCheck className="mr-2 w-4 h-4" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="ml-auto w-4 h-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => kick(member.id)}>
                          <Gavel className="mr-2 w-4 h-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

              {loadingId === member.id && (
                <Loader2 className="ml-auto w-4 h-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
