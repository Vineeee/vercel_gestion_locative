"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building,
  Home,
  Users,
  FileText,
  BarChart,
  Calendar,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function EnhancedSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  const routes = [
    { name: "Tableau de bord", href: "/", icon: BarChart, current: pathname === "/" },
    { name: "Immeubles", href: "/immeubles", icon: Building, current: pathname.startsWith("/immeubles") },
    { name: "Biens", href: "/biens", icon: Home, current: pathname.startsWith("/biens") },
    { name: "Locataires", href: "/locataires", icon: Users, current: pathname.startsWith("/locataires") },
    { name: "Baux", href: "/baux", icon: FileText, current: pathname.startsWith("/baux") },
    { name: "Calendrier", href: "/calendrier", icon: Calendar, current: pathname.startsWith("/calendrier") },
    { name: "Paramètres", href: "/parametres", icon: Settings, current: pathname.startsWith("/parametres") },
  ]

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-white" collapsed={collapsed}>
        <SidebarHeader className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center">
            <Building className="h-6 w-6 text-gray-900" />
            {!collapsed && <span className="ml-2 text-lg font-bold">ImmoGest</span>}
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-5 pb-4">
          <SidebarMenu>
            {routes.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={item.current}>
                  <Link
                    href={item.href}
                    className={cn("group flex items-center rounded-md px-3 py-2 text-sm font-medium")}
                  >
                    <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} aria-hidden="true" />
                    {!collapsed && item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            {!collapsed && "Aide"}
          </Button>
        </div>
        <SidebarRail>
          <SidebarTrigger
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </SidebarTrigger>
        </SidebarRail>
      </Sidebar>
    </SidebarProvider>
  )
}
