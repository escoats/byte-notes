import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

{
  /* TODO: Need to access user data */
}
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between h-[115px] px-6 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <img
            src="/ByteNotesLogo.png"
            alt="Byte Notes"
            className="w-[186px] h-[81px]"
          />
        </div>
        {/* Profile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-3 rounded-md px-3 py-1.5 h-14 w-40">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">Ajay</p>{" "}
                {/* TODO: update to be dynamic */}
                <p className="text-xs text-muted-foreground">@ajay</p>{" "}
                {/* TODO: update to be dynamic */}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/ajay.png" alt="@ajay" />{" "}
                {/* TODO: update to be dynamic */}
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="">
                  Upload photo
                </Label>
                <Input id="photo" type="file" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-400 align-content-start">
                Sign out
              </Button>
              <Button type="submit" className="bg-blue-400">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
    </div>
  );
}
