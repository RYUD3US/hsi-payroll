import { useRouter } from "next/navigation";
import { User, ChevronDown, ShieldCheck, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "../settings-menu";
import { useSettingsStore } from "@/stores/settings-store";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfileMenu() {
  const router = useRouter();
  const supabase = createClient();
  const { browserNavButtonsEnabled } = useSettingsStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {browserNavButtonsEnabled && (
        <div className="hidden xl:flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.forward()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="hidden lg:block">
        <SettingsMenu />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 cursor-pointer group transition-all">
            <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500">
              <User className="h-3 w-3 text-zinc-400 group-hover:text-zinc-200" />
            </div>
            <span className="text-sm text-zinc-400 font-medium hidden lg:inline-block">Admin</span>
            <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-y-0.5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Access Level</span>
            <div className="flex items-center gap-1.5 text-zinc-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Administrator
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}