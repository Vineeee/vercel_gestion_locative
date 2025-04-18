import { ArrowLeft, Calendar, Download, Edit, FileText, Home, User, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function LeaseDetailPage({ params }: { params: { id: string } }) {
  // Simuler les données d'un bail
  const lease = {
    id: params.id,
    ref: "BAIL-2023-001",
    tenant: {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "06 12 34 56 78",
    },
    property: {
      ref: "APT-A102",
      type: "Appartement",
      address: "12 Rue des Lilas, 75001 Paris",
      building: "Résidence Les Oliviers",
    },
    startDate: "01/01/2023",
    endDate: "31/12/2025",
    rent: 1200,
    charges: 150,
    deposit: 2400,
    paymentDay: 5,
    paymentMethod: "Virement bancaire",
    status: "Actif",
    clauses: [
      "Interdiction d'animaux domestiques",
      "Interdiction de fumer dans les parties communes",
      "Entretien du jardin à la charge du locataire",
    ],
    renewals: [],
    documents: [
      { name: "Contrat de bail signé.pdf", type: "contract", date: "01/01/2023" },
      { name: "État des lieux d'entrée.pdf", type: "inventory", date: "01/01/2023" },
      { name: "Attestation d'assurance.pdf", type: "insurance", date: "01/01/2023" },
      { name: "Quittances de loyer.zip", type: "receipts", date: "01/06/2023" },
    ],
  }

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex items-center mb-6">
        <Link href="/baux">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-2 text-gray-500" />
            <h1 className="text-3xl font-bold">{lease.ref}</h1>
            <Badge className="ml-3">{lease.status}</Badge>
          </div>
          <p className="text-gray-500 mt-1">
            Bail pour {lease.property.ref} - {lease.property.building}
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="clauses">Clauses</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du bail</CardTitle>
                  <CardDescription>Détails du contrat de location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informations générales</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Référence</dt>
                          <dd>{lease.ref}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Statut</dt>
                          <dd>
                            <Badge variant="outline">{lease.status}</Badge>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Date de début</dt>
                          <dd>{lease.startDate}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Date de fin</dt>
                          <dd>{lease.endDate}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Durée</dt>
                          <dd>3 ans</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Informations financières</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Loyer</dt>
                          <dd>{lease.rent} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Charges</dt>
                          <dd>{lease.charges} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Total</dt>
                          <dd className="font-semibold">{lease.rent + lease.charges} €/mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Dépôt de garantie</dt>
                          <dd>{lease.deposit} €</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Jour de paiement</dt>
                          <dd>Le {lease.paymentDay} du mois</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Méthode de paiement</dt>
                          <dd>{lease.paymentMethod}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Historique des renouvellements</h3>
                    {lease.renewals.length > 0 ? (
                      <div className="space-y-2">
                        {lease.renewals.map((renewal, index) => (
                          <div key={index} className="p-3 bg-gray-100 rounded-md">
                            <p className="font-medium">Renouvellement #{index + 1}</p>
                            <p className="text-sm text-gray-500">Date: {renewal.date}</p>
                            <p className="text-sm text-gray-500">Nouveau loyer: {renewal.newRent} €</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun renouvellement pour le moment</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="clauses">
              <Card>
                <CardHeader>
                  <CardTitle>Clauses du bail</CardTitle>
                  <CardDescription>Clauses spécifiques du contrat de location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Clauses particulières</h3>
                      <ul className="space-y-2">
                        {lease.clauses.map((clause, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 rounded-full bg-gray-900 mt-2 mr-2"></div>
                            <span>{clause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Clauses générales</h3>
                      <p className="text-gray-700">
                        Le présent contrat est soumis aux dispositions de la loi n° 89-462 du 6 juillet 1989 tendant à
                        améliorer les rapports locatifs. Les parties sont tenues de respecter les obligations qui en
                        découlent.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" /> Télécharger le contrat complet
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Documents associés au bail</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lease.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
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
                          <div>
                            <span>{doc.name}</span>
                            <p className="text-xs text-gray-500">Ajouté le {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Télécharger
                        </Button>
                      </div>
                    ))}
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
              <CardTitle>Locataire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <User className="h-10 w-10 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-lg">{lease.tenant.name}</p>
                  <p className="text-sm text-gray-500">{lease.tenant.email}</p>
                  <p className="text-sm text-gray-500">{lease.tenant.phone}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" /> Voir fiche locataire
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Bien immobilier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Home className="h-10 w-10 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-lg">{lease.property.ref}</p>
                  <p className="text-sm text-gray-500">{lease.property.type}</p>
                  <p className="text-sm text-gray-500">{lease.property.address}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" /> Voir fiche bien
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" /> Générer quittance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Envoyer rappel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" /> Renouveler le bail
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <X className="mr-2 h-4 w-4" /> Résilier le bail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
