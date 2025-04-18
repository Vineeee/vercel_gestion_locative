import { Filter, FileText, Plus, Search } from "lucide-react"
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
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function LeasesPage() {
  const supabase = createServerSupabaseClient()

  // Fetch leases with tenant and property information
  const { data: leases, error } = await supabase
    .from("leases")
    .select(`
      *,
      tenants:tenant_id (
        name
      ),
      properties:property_id (
        ref,
        buildings:building_id (
          name
        )
      )
    `)
    .order("ref", { ascending: true })

  if (error) {
    console.error("Error fetching leases:", error)
  }

  // Process the data to format dates
  const processedLeases = leases?.map((lease) => ({
    ...lease,
    startDate: new Date(lease.start_date).toLocaleDateString("fr-FR"),
    endDate: new Date(lease.end_date).toLocaleDateString("fr-FR"),
    tenant: lease.tenants?.name || "-",
    property: lease.properties?.ref || "-",
    building: lease.properties?.buildings?.name || "-",
  }))

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Baux</h1>
          <p className="text-gray-500 mt-1">Gérez tous vos contrats de location</p>
        </div>
        <Link href="/baux/nouveau">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Bail
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrez les baux selon différents critères</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Rechercher..." className="pl-9" />
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Statut</option>
                <option value="active">Actif</option>
                <option value="notice">Préavis</option>
                <option value="archived">Archivé</option>
              </select>
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
                <option value="">Date de fin</option>
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
          <CardTitle>Liste des Baux</CardTitle>
          <CardDescription>{processedLeases?.length || 0} baux trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Immeuble</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead className="text-right">Loyer (€)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedLeases && processedLeases.length > 0 ? (
                processedLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <Link href={`/baux/${lease.id}`} className="hover:underline">
                          {lease.ref}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{lease.tenant}</TableCell>
                    <TableCell>{lease.property}</TableCell>
                    <TableCell>{lease.building}</TableCell>
                    <TableCell>{lease.startDate}</TableCell>
                    <TableCell>{lease.endDate}</TableCell>
                    <TableCell className="text-right">{lease.rent + lease.charges}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lease.status === "Actif" ? "default" : lease.status === "Préavis" ? "outline" : "secondary"
                        }
                      >
                        {lease.status}
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
                            <Link href={`/baux/${lease.id}`} className="w-full">
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/baux/${lease.id}/modifier`} className="w-full">
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Documents</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Résilier</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Aucun bail trouvé. Commencez par en ajouter un.
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
