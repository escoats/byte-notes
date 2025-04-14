import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

// array of user's notebooks
const notebooks = [
  {
    name: "COMP 426",
    id: "234a8903-19d8-4489-8e74-3d15632015fb",
    chapter: [
      {
        name: "Backend",
        id: "234a8903-19d8-4489-8e74-3d15632015fb",
        page: [
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
        ],
      },
      {
        name: "Backend",
        id: "234a8903-19d8-4489-8e74-3d15632015fb",
        page: [
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
        ],
      },
      {
        name: "Backend",
        id: "234a8903-19d8-4489-8e74-3d15632015fb",
        page: [
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
        ],
      },
    ],
  },
  {
    name: "COMP 426",
    id: "234a8903-19d8-4489-8e74-3d15632015fb",
    chapter: [
      {
        name: "Backend",
        id: "234a8903-19d8-4489-8e74-3d15632015fb",
        page: [
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
        ],
      },
    ],
  },
  {
    name: "COMP 426",
    id: "234a8903-19d8-4489-8e74-3d15632015fb",
    chapter: [
      {
        name: "Backend",
        id: "234a8903-19d8-4489-8e74-3d15632015fb",
        page: [
          {
            name: "L21 - Final Projects",
            id: "234a8903-19d8-4489-8e74-3d15632015fb",
          },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      {/* Logo */}
      <div className="flex justify-center mr-2.5 -mt-0.5">
        <img
          src="/ByteNotesLogo.png"
          alt="Byte Notes"
          className="w-[186px] h-[166px]"
        />
      </div>
      <SidebarContent>
        {notebooks.map((notebook, notebookIdx) => (
          <SidebarGroup key={notebookIdx}>
            <SidebarGroupLabel>
              <p className="text-white text-xs">{notebook.name}</p>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {notebook.chapter.map((chapter, chapterIdx) => (
                  <Collapsible key={chapterIdx}>
                    <SidebarGroup>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <p className="text-white text-sm">{chapter.name}</p>
                          <ChevronDown className="text-white ml-auto transition-transform group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {chapter.page.map((page, pageIdx) => (
                            <SidebarMenuSubItem key={pageIdx}>
                              <Link
                                href={`/${page.id}`}
                              >
                                <p className="text-white text-sm">
                                  {page.name}
                                </p>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
