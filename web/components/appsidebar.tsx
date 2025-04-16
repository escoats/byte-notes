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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import {
  getNotebookTreeByUser,
  getProfileData,
} from "@/utils/supabase/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

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
  const supabase = createSupabaseComponentClient();
  const queryClient = useQueryClient();

  //useStates for creating & setting new notebook title and opening/closing dialog on creation
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [isNotebookDialogOpen, setIsNotebookDialogOpen] = useState(false);

  //useStates for creating & setting new chapter title, opening/closing dialog on creation, and selecting a notebook for the chater
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>("");


  //useStates for creating & setting new page title, opening/closing dialog on creation, and selecting a chapter for the page
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");



  // Get current authenticated user
  const { data: profileData } = useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data) return null;
      return await getProfileData(supabase, data.user!.id);
    },
  });

  // Get user's notebook + chapter + page tree
  const { data: notebookTree } = useQuery({
    queryKey: ["notebook_tree"],
    enabled: !!profileData?.id,
    queryFn: async () => await getNotebookTreeByUser(supabase, profileData!.id),
  });

  //Creates a new notebook and adds to notebook table & sidebar
  const handleCreateNotebook = async () => {
    if (!newNotebookTitle.trim() || !profileData?.id) return;

    const { data: existing, error: checkError } = await supabase
      .from("notebook")
      .select("id")
      .eq("title", newNotebookTitle.trim())
      .eq("author_id", profileData.id)
      .maybeSingle();

    if (checkError) {
      toast.error("Failed to fetch notebook.");
      return;
    }

    if (existing) {
      toast.error("Notebook already exists");
      return;
    }

    const { error } = await supabase.from("notebook").insert({
      title: newNotebookTitle.trim(),
      author_id: profileData.id,
    });

    if (error) {
      console.error("Failed to create notebook:", error.message);
      toast.error("Failed to create notebook.");
      return;
    }

    toast.success("Notebook created!");
    setNewNotebookTitle("");
    setIsNotebookDialogOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["notebook_tree"] });
  };

  //Creates a new chapter and adds to chapter table & sidebar
  const handleCreateChapter = async () => {
    //trim to remove whitespace for supabase
    if (!newChapterTitle.trim() || !profileData?.id) return;

    const { data: existing, error: checkError } = await supabase
      .from("chapter")
      .select("id")
      .eq("title", newChapterTitle.trim())
      .eq("notebook_id", selectedNotebookId)
      .maybeSingle();
      console.log(existing)

    if (checkError) {
      toast.error("Failed to fetch chapter.");
      return;
    }

    if (existing) {
      toast.error("Chapter already exists");
      return;
    }

    const { error } = await supabase.from("chapter").insert({
      title: newChapterTitle.trim(),
      notebook_id: selectedNotebookId,
    });

    if (error) {
      console.error("Failed to create chapter:", error.message);
      toast.error("Failed to create chapter.");
      return;
    }

    toast.success("Chapter created!");
    setNewChapterTitle("");
    setSelectedNotebookId("");
    setIsChapterDialogOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["notebook_tree"] });
  };

  //Creates a new page and adds to page table & sidebar
  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !profileData?.id) return;

    const { data: existing, error: checkError } = await supabase
      .from("page")
      .select("id")
      .eq("title", newPageTitle.trim())
      .eq("chapter_id", selectedChapterId)
      .maybeSingle();
      console.log(existing)

    if (checkError) {
      toast.error("Failed to fetch page.");
      return;
    }

    if (existing) {
      toast.error("Page already exists");
      return;
    }

    const { error } = await supabase.from("page").insert({
      title: newPageTitle.trim(),
      chapter_id: selectedChapterId,
    });

    if (error) {
      console.error("Failed to create page:", error.message);
      toast.error("Failed to create page.");
      return;
    }

    toast.success("Page created!");
    setNewPageTitle("");
    setSelectedChapterId("");
    setIsPageDialogOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["notebook_tree"] });
  };

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
        {notebookTree?.map((notebook, notebookIdx) => (
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
                              <Link href={`/${page.id}`}>
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
      {/* + New */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mb-4 mr-2 ml-2 bg-blue-400">
            + New
          </Button>
        </DropdownMenuTrigger>
        {/* TODO: Style so New Notebook, etc. text is black and gray when hovered */}
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            {/* New Notebook */}
              <Dialog open={isNotebookDialogOpen} onOpenChange={setIsNotebookDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  New Notebook
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Notebook</DialogTitle>
                  <DialogDescription>
                    Create a new notebook to store your chapters
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notebook" className="text-right">
                      Notebook
                    </Label>
                    <Input
                      id="notebook"
                      className="col-span-3"
                      value={newNotebookTitle}
                      onChange={(e) => setNewNotebookTitle(e.target.value)}
                      placeholder="Name of your notebook..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="bg-blue-400">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-blue-400"
                    onClick={handleCreateNotebook}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* New Chapter */}
            <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  New Chapter
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Chapter</DialogTitle>
                  <DialogDescription>
                    Create a new chapter to store your pages
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapter" className="text-right">
                      Chapter
                    </Label>
                    <Input
                      id="chapter"
                      className="col-span-3"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      placeholder="Name of your chapter..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notebook" className="text-right">
                      Notebook
                    </Label>
                    <Select value={selectedNotebookId} onValueChange={setSelectedNotebookId}>
                    <SelectTrigger className="w-[277.25]">
                      <SelectValue placeholder="Select a notebook" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Your notebooks</SelectLabel>
                        {notebookTree?.map((nb) => (
                          <SelectItem key={nb.id} value={nb.id}>{nb.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="bg-blue-400">
                      Cancel
                    </Button>
                  </DialogClose>
                  {/* TODO: implement Save logic to update database when new chapter is created */}
                  <Button type="submit" className="bg-blue-400" onClick={handleCreateChapter}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* New Page */}
            <Dialog  open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  New Page
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                  <DialogDescription>
                    Create a new page to start taking notes
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="page" className="text-right">
                      Page
                    </Label>
                    <Input
                      id="page"
                      className="col-span-3"
                      placeholder="Name of your page..."
                      value={newPageTitle}
                      onChange={(e) => setNewPageTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapter" className="text-right">
                      Chapter
                    </Label>
                    <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                    <SelectTrigger className="w-[277.25]">
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Your chapters</SelectLabel>
                        {notebookTree?.flatMap((notebook) =>
                        notebook.chapter.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {notebook.name} / {chapter.name}
                          </SelectItem>
                        ))
                      )}
                      </SelectGroup>
                    </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="bg-blue-400">
                      Cancel
                    </Button>
                  </DialogClose>
                  {/* TODO: implement Save logic to update database when new notebook is created */}
                  <Button type="submit" className="bg-blue-400" onClick={handleCreatePage}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Sidebar>
  );
}
