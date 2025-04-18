import { Building, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { SearchFilter } from "@/components/search-filter"
import { DeleteDialog } from "@/components/delete-dialog"

export default async function ImmeublesPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const supabase = createServerSupabaseClient()

  // Construire la requête avec les filtres
  let query = supabase.from("buildings").select("*")

  // Appliquer les filtres si présents
  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`)
  }

  if (searchParams.type) {
    query = query.eq("type", searchParams.type)
  }

  if (searchParams.status) {
    query = query.eq("status", searchParams.status)
  }

  if (searchParams.year) {
    const yearRange = searchParams.year.split("-")
    if (yearRange.length === 2) {
      query = query.gte("year_built", yearRange[0]).lte("year_built", yearRange[1])
    } else if (searchParams.year === "before-1950") {
      query = query.lt("year_built", 1950)
    } else if (searchParams.year === "after-2000") {
      query = query.gt("year_built", 2000)
    }
  }

  // Exécuter la requête
  const { data: buildings, error } = await query.order("name", { ascending: true })

  if (error) {
    console.error("Error fetching buildings:", error)
  }

  // Définir les filtres disponibles
  const filters = [
    {
      name: "type",
      options: [
        { label: "Résidentiel", value: "Résidentiel" },
        { label: "Commercial", value: "Commercial" },
        { label: "Mixte", value: "Mixte" },
        { label: "Historique", value: "Historique" },
      ],
    },
    {
      name: "year",
      options: [
        { label: "Avant 1950", value: "before-1950" },
        { label: "1950-1980", value: "1950-1980" },
        { label: "1980-2000", value: "1980-2000" },
        { label: "Après 2000", value: "after-2000" },
      ],
    },
    {
      name: "status",
      options: [
        { label: "Excellent", value: "Excellent" },
        { label: "Bon", value: "Bon" },
        { label: "Moyen", value: "Moyen" },
        { label: "Rénové", value: "Rénové" },
      ],
    },
  ]

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Immeubles</h1>
          <p className="text-gray-500 mt-1">Gérez tous vos immeubles et leurs informations</p>
        </div>
        <Link href="/immeubles/nouveau">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvel Immeuble
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrez les immeubles selon différents critères</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFilter placeholder="Rechercher un immeuble..." filters={filters} baseUrl="/immeubles" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des Immeubles</CardTitle>
          <CardDescription>{buildings?.length || 0} immeubles trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Unités</TableHead>
                <TableHead className="text-center">Année</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings && buildings.length > 0 ? (
                buildings.map((building) => (
                  <TableRow key={building.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        {building.name}
                      </div>
                    </TableCell>
                    <TableCell>{building.address}</TableCell>
                    <TableCell>{building.type}</TableCell>
                    <TableCell className="text-center">{building.units}</TableCell>
                    <TableCell className="text-center">{building.year_built}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          building.status === "Excellent"
                            ? "default"
                            : building.status === "Bon"
                              ? "secondary"
                              : building.status === "Moyen"
                                ? "outline"
                                : "default"
                        }
                      >
                        {building.status}
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
                            <Link href={`/immeubles/${building.id}`} className="w-full">
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/immeubles/${building.id}/modifier`} className="w-full">
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DeleteDialog
                            title="Supprimer l'immeuble"
                            description="Êtes-vous sûr de vouloir supprimer cet immeuble ? Cette action est irréversible."
                            onDelete={async () => {
                              "use server"
                              // Cette fonction serait implémentée côté serveur
                              // pour supprimer l'immeuble
                            }}
                            trigger={<DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun immeuble trouvé. Commencez par en ajouter un.
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
