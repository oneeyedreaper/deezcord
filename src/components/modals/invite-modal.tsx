"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

export function InviteModal() {
  const { copy, isCopied } = useCopyToClipboard();
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const onModalClose = () => onClose();

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const { mutate: onGenerateLink, isLoading } = useMutation({
    mutationKey: ["invite-code"],
    mutationFn: async () =>
      await axios.patch(`/api/servers/${server?.id}/invite-code`),
    onSuccess: ({ data }) => {
      onOpen("invite", { server: data });
    },
    onError: console.error,
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="overflow-hidden p-0 text-black bg-white">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex gap-x-2 items-center mt-2">
            <Input
              className="text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50"
              value={inviteUrl}
              readOnly
            />
            <Button onClick={() => copy(inviteUrl)} size="icon">
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            className="mt-4 text-xs text-zinc-500"
            variant="link"
            size="sm"
            onClick={onGenerateLink}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
