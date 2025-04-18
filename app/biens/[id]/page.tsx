import { ArrowLeft, Calendar, Edit, Home, MapPin, Maximize2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Simuler les données d'un bien immobilier
  const property = {
    id: params.id,
    ref: "APT-A102",
    type: "Appartement",
    building: "Résidence Les Oliviers",
    address: "12 Rue des Lilas, 75001 Paris",
    surface: 65,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 1,
    rent: 1200,
    charges: 150,
    deposit: 2400,
    status: "Occupé",
    tenant: "Jean Dupont",
    leaseStart: "01/01/2023",
    leaseEnd: "31/12/2025",
    features: [
      "Cuisine équipée",
      "Balcon",
      "Parquet",
      "Double vitrage",
      "Chauffage central",
      "Ascenseur",
      "Interphone",
    ],
    description:
      "Bel appartement lumineux avec vue dégagée, situé au 1er étage d'une résidence récente et sécurisée. Proche des commerces et des transports en commun.",
  }

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex items-center mb-6">
        <Link href="/biens">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <Home className="h-6 w-6 mr-2 text-gray-500" />
            <h1 className="text-3xl font-bold">{property.ref}</h1>
            <Badge className="ml-3">{property.status}</Badge>
          </div>
          <p className="text-gray-500 mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Galerie Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=800"
                  alt="Vue principale de l'appartement"
                  className="rounded-md max-h-full"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=100&width=100&text=Photo ${i}`}
                      alt={`Photo ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques du bien</CardTitle>
                  <CardDescription>Informations détaillées sur le bien immobilier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informations générales</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Type</dt>
                          <dd>{property.type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Immeuble</dt>
                          <dd>{property.building}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Surface</dt>
                          <dd>{property.surface} m²</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Étage</dt>
                          <dd>{property.floor}er</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Pièces</dt>
                          <dd>{property.rooms}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Chambres</dt>
                          <dd>{property.bedrooms}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Salles de bain</dt>
                          <dd>{property.bathrooms}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Informations financières</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Loyer</dt>
                          <dd>{property.rent} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Charges</dt>
                          <dd>{property.charges} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Total</dt>
                          <dd className="font-semibold">{property.rent + property.charges} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Dépôt de garantie</dt>
                          <dd>{property.deposit} €</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Description</h3>
                    <p className="text-gray-700">{property.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Équipements et caractéristiques</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-gray-900 mr-2"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="plan">
              <Card>
                <CardHeader>
                  <CardTitle>Plan du bien</CardTitle>
                  <CardDescription>Plan détaillé de l'appartement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center relative">
                    <img
                      src="/placeholder.svg?height=400&width=800&text=Plan de l'appartement"
                      alt="Plan de l'appartement"
                      className="max-h-full"
                    />
                    <Button variant="outline" size="sm" className="absolute top-2 right-2">
                      <Maximize2 className="h-4 w-4 mr-1" /> Agrandir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Documents associés au bien immobilier</CardDescription>
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
                        <span>Diagnostic énergétique.pdf</span>
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
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="h-6 w-6 text-blue-500 mr-2"
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
                        <span>Photos supplémentaires.zip</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Informations locatives</CardTitle>
            </CardHeader>
            <CardContent>
              {property.status === "Occupé" ? (
                <div>
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">{property.tenant}</p>
                      <p className="text-sm text-gray-500">Locataire actuel</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Début du bail</span>
                      <span>{property.leaseStart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fin du bail</span>
                      <span>{property.leaseEnd}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <User className="mr-2 h-4 w-4" /> Voir fiche locataire
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Ce bien est actuellement vacant</p>
                  <Button className="w-full">
                    <User className="mr-2 h-4 w-4" /> Ajouter un locataire
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-gray-100 rounded-md">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">Visite de maintenance</p>
                    <p className="text-sm text-gray-500">15/06/2023 - 10:00</p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-100 rounded-md">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">Révision chauffage</p>
                    <p className="text-sm text-gray-500">22/09/2023 - 14:00</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> Voir calendrier complet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
