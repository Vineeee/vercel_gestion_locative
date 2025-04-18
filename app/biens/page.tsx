import { Filter, Home, Plus, Search } from "lucide-react"
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

export default async function BiensPage() {
  const supabase = createServerSupabaseClient()

  // Fetch properties with building information
  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      *,
      buildings:building_id (
        name
      )
    `)
    .order("ref", { ascending: true })

  if (error) {
    console.error("Error fetching properties:", error)
  }

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Biens</h1>
          <p className="text-gray-500 mt-1">Gérez tous vos biens immobiliers et leurs caractéristiques</p>
        </div>
        <Link href="/biens/nouveau">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Bien
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrez les biens selon différents critères</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Rechercher..." className="pl-9" />
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Type de bien</option>
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="parking">Parking</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Surface</option>
                <option value="0-30">0-30 m²</option>
                <option value="30-60">30-60 m²</option>
                <option value="60-100">60-100 m²</option>
                <option value="100+">100+ m²</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Statut</option>
                <option value="occupied">Occupé</option>
                <option value="vacant">Vacant</option>
                <option value="notice">Préavis</option>
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
          <CardTitle>Liste des Biens</CardTitle>
          <CardDescription>{properties?.length || 0} biens trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Immeuble</TableHead>
                <TableHead className="text-center">Surface (m²)</TableHead>
                <TableHead className="text-center">Pièces</TableHead>
                <TableHead className="text-right">Loyer (€)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties && properties.length > 0 ? (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-gray-500" />
                        <Link href={`/biens/${property.id}`} className="hover:underline">
                          {property.ref}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.buildings?.name || "-"}</TableCell>
                    <TableCell className="text-center">{property.surface}</TableCell>
                    <TableCell className="text-center">{property.rooms}</TableCell>
                    <TableCell className="text-right">{property.rent}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.status === "Occupé"
                            ? "default"
                            : property.status === "Vacant"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {property.status}
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
                            <Link href={`/biens/${property.id}`} className="w-full">
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/biens/${property.id}/modifier`} className="w-full">
                              Modifier
                            </Link>
                          </DropdownMenuItem>
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
                    Aucun bien trouvé. Commencez par en ajouter un.
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
