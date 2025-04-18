import Link from "next/link"
import { Building, Home, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <div className="flex gap-2">
          <Button variant="outline">Exporter</Button>
          <Link href="/biens/nouveau">
            <Button>Nouveau Bien</Button>
          </Link>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accès Rapide</CardTitle>
            <CardDescription>Naviguer vers les sections principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/immeubles">
                <Button variant="outline" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Gestion des Immeubles
                </Button>
              </Link>
              <Link href="/biens">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Gestion des Biens
                </Button>
              </Link>
              <Link href="/locataires">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Gestion des Locataires
                </Button>
              </Link>
              <Link href="/baux">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Gestion des Baux
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Biens à louer</CardTitle>
            <CardDescription>Biens actuellement vacants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">APT-SG101</p>
                  <p className="text-sm text-gray-500">Appartement - 70m² - 3 pièces</p>
                </div>
                <p className="font-semibold">1400 €/mois</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">APT-SG202</p>
                  <p className="text-sm text-gray-500">Appartement - 45m² - 2 pièces</p>
                </div>
                <p className="font-semibold">1050 €/mois</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">APT-B101</p>
                  <p className="text-sm text-gray-500">Appartement - 85m² - 4 pièces</p>
                </div>
                <p className="font-semibold">1800 €/mois</p>
              </div>
              <Link href="/biens?status=Vacant" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Voir tous les biens vacants
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Baux à renouveler</CardTitle>
            <CardDescription>Baux arrivant à échéance dans les 3 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">BAIL-2022-015</p>
                  <p className="text-sm text-gray-500">Marie Martin - HSE-M3</p>
                </div>
                <p className="text-sm text-red-500">14/03/2024</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">BAIL-2022-022</p>
                  <p className="text-sm text-gray-500">Sophie Lefebvre - APT-C305</p>
                </div>
                <p className="text-sm text-orange-500">31/08/2024</p>
              </div>
              <Link href="/baux" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Voir tous les baux
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
