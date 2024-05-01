"use client";

import { Plus } from "lucide-react";
import React from "react";

import { useModal } from "@/hooks/use-modal-store";

import { ActionTooltip } from "../action-tooltip";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          onClick={() => onOpen("createServer")}
          className="flex items-center group"
        >
          <div className="flex overflow-hidden justify-center items-center mx-3 transition-all group-hover:bg-emerald-500 h-[48px] w-[48px] rounded-[24px] bg-background dark:bg-neutral-700 group-hover:rounded-[16px]">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
