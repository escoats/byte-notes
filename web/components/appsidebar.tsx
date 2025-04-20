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
import { SquareTerminal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import {
  getNotebookTreeByUser,
  getProfileData,
} from "@/utils/supabase/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { BookMarked, List, FileText, Plus } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({
  setActivePageId,
}: {
  setActivePageId: Dispatch<SetStateAction<string>>;
}) {
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

    toast("Notebook created!");
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
    console.log(existing);

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

    toast("Chapter created!");
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
    console.log(existing);

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

    toast("Page created!");
    setNewPageTitle("");
    setSelectedChapterId("");
    setIsPageDialogOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["notebook_tree"] });
  };

  // handles renaming item in database when user right clicks in sidebar
  function handleRenameSidebarItem(id: string): void {
    toast("Rename functionality not implemented yet.");
  }

  // handles deleting item from database when user right clicks in sidebar
  async function handleDeleteSidebarItem(
    id: string,
    type: string
  ): Promise<void> {
    const { error } = await supabase.from(type).delete().eq("id", id);

    if (error) {
      toast.error(`Failed to delete ${type}.`);
      return;
    }

    toast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
    await queryClient.invalidateQueries({ queryKey: ["notebook_tree"] });
  }

  return (
    <Sidebar className="h-[calc(100vh-115px)] mt-[115px]">
      <SidebarContent className="mt-1">
        {notebookTree?.map((notebook, notebookIdx) => (
          <SidebarGroup key={notebookIdx}>
            {/* Notebook Title */}
            <SidebarGroupLabel className="text-left">
              <ContextMenu>
                <ContextMenuTrigger>
                  <p className="text-[11px] text-gray-400 uppercase text-left tracking-wider px-2 pt-3 pb-1">
                    {notebook.name}
                  </p>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48 bg-gray-800">
                  <ContextMenuItem
                    onClick={() => handleRenameSidebarItem(notebook.id)}
                  >
                    Rename Notebook
                  </ContextMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                        Delete Notebook
                      </ContextMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this notebook?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the notebook (including all associated pages)
                          and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteSidebarItem(notebook.id, "notebook")
                          }
                          className="bg-red-600"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ContextMenuContent>
              </ContextMenu>
            </SidebarGroupLabel>

            {/* Chapters */}
            <SidebarGroupContent>
              <SidebarMenu>
                {notebook.chapter.map((chapter, chapterIdx) => (
                  <Collapsible key={chapterIdx} className="pl-2 pr-2 group">
                    <SidebarGroup className="p-0 mb-1">
                      <SidebarGroupLabel asChild className="text-left">
                        <ContextMenu>
                          <ContextMenuTrigger>
                            {chapter.page.length > 0 ? (
                              <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 text-white text-[13px] font-medium hover:bg-gray-800 rounded-md transition pl-2">
                                <SquareTerminal
                                  strokeWidth={1.5}
                                  size={16}
                                  className="mr-2"
                                />
                                <p className="text-left font-medium text-sm">
                                  {chapter.name}
                                </p>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-0 group-data-[state=closed]:-rotate-90" />
                              </CollapsibleTrigger>
                            ) : (
                              <div className="flex items-center justify-start w-full py-1.5 text-white text-[13px] font-medium pl-2 opacity-70">
                                <SquareTerminal
                                  strokeWidth={1.5}
                                  size={16}
                                  className="mr-2"
                                />
                                <p className="text-left font-medium text-sm">
                                  {chapter.name}
                                </p>
                                <ChevronDown className="ml-auto h-4 w-4 rotate-270" />
                              </div>
                            )}
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-48 bg-gray-800">
                            <ContextMenuItem
                              onClick={() =>
                                handleRenameSidebarItem(chapter.id)
                              }
                            >
                              Rename Chapter
                            </ContextMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <ContextMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  Delete Chapter
                                </ContextMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete this
                                    chapter?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the chapter and remove
                                    its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteSidebarItem(
                                        chapter.id,
                                        "chapter"
                                      )
                                    }
                                    className="bg-red-600"
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </ContextMenuContent>
                        </ContextMenu>
                      </SidebarGroupLabel>

                      {/* Pages */}
                      <CollapsibleContent>
                        <SidebarMenuSub className="pl-4 space-y-1">
                          {chapter.page.map((page, pageIdx) => (
                            <SidebarMenuSubItem key={pageIdx} className="pl-1">
                              <ContextMenu>
                                <ContextMenuTrigger
                                  onClick={() => setActivePageId(page.id)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="px-2 py-0 m-0 -ml-1 text-[13px] text-gray-300 rounded hover:bg-gray-700 hover:text-white transition"
                                  >
                                    <p className="text-left -ml-1">
                                      {page.name}
                                    </p>
                                  </Button>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-48 bg-gray-800">
                                  <ContextMenuItem
                                    onClick={() =>
                                      handleRenameSidebarItem(page.id)
                                    }
                                  >
                                    Rename Page
                                  </ContextMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <ContextMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        Delete Page
                                      </ContextMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you sure you want to delete this
                                          page?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete the page and
                                          remove its data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteSidebarItem(
                                              page.id,
                                              "page"
                                            )
                                          }
                                          className="bg-red-600"
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </ContextMenuContent>
                              </ContextMenu>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <Separator className="m-0 mt-5 -mb-2.5 p-0 bg-[#64748B] opacity-50" />
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* + New */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="mb-4 mr-2 ml-2 bg-blue-400 text-white"
          >
            + New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60  bg-slate-700">
          <DropdownMenuGroup>
            {/* New Notebook */}
            <Dialog
              open={isNotebookDialogOpen}
              onOpenChange={setIsNotebookDialogOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-700 transition"
                >
                  <BookMarked className="h-4 w-4" />
                  <span>New Notebook</span>
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
            <DropdownMenuSeparator />
            {/* New Chapter */}
            <Dialog
              open={isChapterDialogOpen}
              onOpenChange={setIsChapterDialogOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-700 transition"
                >
                  <List className="h-4 w-4" />
                  <span>Chapter</span>
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
                    <Select
                      value={selectedNotebookId}
                      onValueChange={setSelectedNotebookId}
                    >
                      <SelectTrigger className="w-[277.25]">
                        <SelectValue placeholder="Select a notebook" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Your notebooks</SelectLabel>
                          {notebookTree?.map((nb) => (
                            <SelectItem key={nb.id} value={nb.id}>
                              {nb.name}
                            </SelectItem>
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
                  <Button
                    type="submit"
                    className="bg-blue-400"
                    onClick={handleCreateChapter}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            {/* New Page */}
            <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-700 transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>Page</span>
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
                    <Select
                      value={selectedChapterId}
                      onValueChange={setSelectedChapterId}
                    >
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
                  <Button
                    type="submit"
                    className="bg-blue-400"
                    onClick={handleCreatePage}
                  >
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
