import { ArrowLeft, Building, Edit, Home, MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function BuildingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Récupérer les détails de l'immeuble
  const { data: building, error } = await supabase.from("buildings").select("*").eq("id", params.id).single()

  if (error || !building) {
    console.error("Error fetching building:", error)
    return notFound()
  }

  // Récupérer les propriétés associées à cet immeuble
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("building_id", building.id)
    .order("ref", { ascending: true })

  // Calculer quelques statistiques
  const totalProperties = properties?.length || 0
  const occupiedProperties = properties?.filter((p) => p.status === "Occupé").length || 0
  const vacantProperties = properties?.filter((p) => p.status === "Vacant").length || 0
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex items-center mb-6">
        <Link href="/immeubles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-gray-500" />
            <h1 className="text-3xl font-bold">{building.name}</h1>
            <Badge className="ml-3">{building.status}</Badge>
          </div>
          <p className="text-gray-500 mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {building.address}
          </p>
        </div>
        <Link href={`/immeubles/${building.id}/modifier`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="properties">Biens</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'immeuble</CardTitle>
                  <CardDescription>Détails et caractéristiques de l'immeuble</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informations générales</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Nom</dt>
                          <dd>{building.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Adresse</dt>
                          <dd>{building.address}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Type</dt>
                          <dd>{building.type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Année de construction</dt>
                          <dd>{building.year_built}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">État</dt>
                          <dd>
                            <Badge variant="outline">{building.status}</Badge>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Statistiques</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Nombre d'unités</dt>
                          <dd>{building.units}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Biens enregistrés</dt>
                          <dd>{totalProperties}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Biens occupés</dt>
                          <dd>{occupiedProperties}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Biens vacants</dt>
                          <dd>{vacantProperties}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Taux d'occupation</dt>
                          <dd className="font-semibold">{occupancyRate}%</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Biens immobiliers</CardTitle>
                  <CardDescription>Liste des biens dans cet immeuble</CardDescription>
                </CardHeader>
                <CardContent>
                  {properties && properties.length > 0 ? (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                          <div className="flex items-center">
                            <Home className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                              <Link href={`/biens/${property.id}`} className="font-medium hover:underline">
                                {property.ref}
                              </Link>
                              <p className="text-sm text-gray-500">
                                {property.type} - {property.surface} m² - {property.rooms} pièces
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
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
                            <p className="ml-4 font-semibold">{property.rent} €/mois</p>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <Link href={`/biens/nouveau?building_id=${building.id}`}>
                          <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">Aucun bien enregistré pour cet immeuble</p>
                      <Link href={`/biens/nouveau?building_id=${building.id}`}>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Documents associés à l'immeuble</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="h-6 w-6 text-red-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Plan de l'immeuble.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="h-6 w-6 text-red-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Règlement de copropriété.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Ajouter un document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Carte non disponible</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{building.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/biens?building_id=${building.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" /> Voir tous les biens
                </Button>
              </Link>
              <Link href={`/immeubles/${building.id}/modifier`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" /> Modifier l'immeuble
                </Button>
              </Link>
              <Link href={`/biens/nouveau?building_id=${building.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
