import Link from "next/link"
import { Building, Home, Users, FileText, BarChart, Calendar, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const routes = [
    { name: "Tableau de bord", href: "/", icon: BarChart, current: true },
    { name: "Immeubles", href: "/immeubles", icon: Building, current: false },
    { name: "Biens", href: "/biens", icon: Home, current: false },
    { name: "Locataires", href: "/locataires", icon: Users, current: false },
    { name: "Baux", href: "/baux", icon: FileText, current: false },
    { name: "Calendrier", href: "/calendrier", icon: Calendar, current: false },
    { name: "Paramètres", href: "/parametres", icon: Settings, current: false },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col h-full border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center">
            <Building className="h-6 w-6 text-gray-900" />
            <span className="ml-2 text-lg font-bold">ImmoGest</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-3">
            {routes.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  item.current ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                )}
              >
                <item.icon
                  className={cn(
                    item.current ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0",
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Button>
        </div>
      </div>
    </div>
  )
}
