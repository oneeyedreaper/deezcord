import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "@/components/socket-indicator";

import { UserAvatar } from "../user-avatar";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  type,
  name,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center px-3 h-12 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="mr-2 w-8 h-8 md:w-8 md:h-8" />
      )}
      <p className="font-semibold text-black dark:text-white text-md">{name}</p>
      <div className="flex items-center ml-auto">
        {type === "conversation" ? <ChatVideoButton /> : null}
        <SocketIndicator />
      </div>
    </div>
  );
};
