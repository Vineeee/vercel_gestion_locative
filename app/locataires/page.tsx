import { Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function TenantsPage() {
  const supabase = createServerSupabaseClient()

  // Fetch tenants with their active leases
  const { data: tenants, error } = await supabase
    .from("tenants")
    .select(`
      *,
      leases:leases (
        id,
        ref,
        start_date,
        end_date,
        status,
        properties:property_id (
          ref,
          buildings:building_id (
            name
          )
        )
      )
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching tenants:", error)
  }

  // Process the data to get the current lease for each tenant
  const processedTenants = tenants?.map((tenant) => {
    const activeLease =
      tenant.leases && tenant.leases.length > 0
        ? tenant.leases.find((lease) => lease.status === "Actif") || tenant.leases[0]
        : null

    return {
      ...tenant,
      currentLease: activeLease,
      property: activeLease?.properties?.ref || "-",
      building: activeLease?.properties?.buildings?.name || "-",
      leaseStart: activeLease?.start_date ? new Date(activeLease.start_date).toLocaleDateString("fr-FR") : "-",
      leaseEnd: activeLease?.end_date ? new Date(activeLease.end_date).toLocaleDateString("fr-FR") : "-",
      status: activeLease?.status || "Aucun bail",
    }
  })

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Locataires</h1>
          <p className="text-gray-500 mt-1">Gérez tous vos locataires et leurs informations</p>
        </div>
        <Link href="/locataires/nouveau">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Locataire
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrez les locataires selon différents critères</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Rechercher..." className="pl-9" />
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Immeuble</option>
                <option value="oliviers">Résidence Les Oliviers</option>
                <option value="parisien">Immeuble Le Parisien</option>
                <option value="montmartre">Résidence Montmartre</option>
                <option value="eiffel">Tour Eiffel</option>
                <option value="marais">Le Marais</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Statut</option>
                <option value="active">Actif</option>
                <option value="notice">Préavis</option>
                <option value="ended">Terminé</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Date de fin de bail</option>
                <option value="3months">Dans les 3 mois</option>
                <option value="6months">Dans les 6 mois</option>
                <option value="1year">Dans l'année</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2">
              Réinitialiser
            </Button>
            <Button>
              <Filter className="mr-2 h-4 w-4" /> Appliquer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des Locataires</CardTitle>
          <CardDescription>{processedTenants?.length || 0} locataires trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Immeuble</TableHead>
                <TableHead>Début bail</TableHead>
                <TableHead>Fin bail</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTenants && processedTenants.length > 0 ? (
                processedTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${tenant.name.charAt(0)}`} />
                          <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Link href={`/locataires/${tenant.id}`} className="hover:underline">
                          {tenant.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{tenant.email}</div>
                        <div className="text-gray-500">{tenant.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.property}</TableCell>
                    <TableCell>{tenant.building}</TableCell>
                    <TableCell>{tenant.leaseStart}</TableCell>
                    <TableCell>{tenant.leaseEnd}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tenant.status === "Actif" ? "default" : tenant.status === "Préavis" ? "outline" : "secondary"
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Link href={`/locataires/${tenant.id}`} className="w-full">
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/locataires/${tenant.id}/modifier`} className="w-full">
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Documents</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucun locataire trouvé. Commencez par en ajouter un.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
