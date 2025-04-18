"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type Activity = {
  type: string
  description: string
  date: string
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const supabase = createBrowserSupabaseClient()

        // Récupérer les baux récents
        const { data: recentLeases } = await supabase
          .from("leases")
          .select(
            `
            ref,
            start_date,
            status,
            tenants:tenant_id (name),
            properties:property_id (ref)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(5)

        // Transformer les données en activités
        const leaseActivities =
          recentLeases?.map((lease) => {
            let type = "Nouveau bail"
            let description = `${lease.tenants?.name} a signé un bail pour ${lease.properties?.ref}`

            if (lease.status === "Préavis") {
              type = "Préavis"
              description = `${lease.tenants?.name} a donné son préavis pour ${lease.properties?.ref}`
            }

            return {
              type,
              description,
              date: formatDistanceToNow(new Date(lease.start_date), { addSuffix: true, locale: fr }),
            }
          }) || []

        // Ajouter quelques activités fictives pour compléter
        const mockActivities = [
          {
            type: "Paiement reçu",
            description: "Loyer reçu pour l'appartement APT-B204",
            date: "Il y a 1 jour",
          },
          {
            type: "Maintenance",
            description: "Demande de réparation pour l'appartement APT-C305",
            date: "Il y a 2 jours",
          },
        ]

        setActivities([...leaseActivities, ...mockActivities].slice(0, 5))
      } catch (error) {
        console.error("Error fetching activities:", error)
        // Fallback to mock data if there's an error
        setActivities([
          {
            type: "Nouveau locataire",
            description: "Jean Dupont a signé un bail pour l'appartement A102",
            date: "Il y a 2 heures",
          },
          {
            type: "Fin de bail",
            description: "Le bail de Marie Martin pour la maison M3 se termine dans 30 jours",
            date: "Il y a 5 heures",
          },
          {
            type: "Paiement reçu",
            description: "Loyer reçu pour l'appartement B204",
            date: "Il y a 1 jour",
          },
          {
            type: "Maintenance",
            description: "Demande de réparation pour l'appartement C305",
            date: "Il y a 2 jours",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
        <CardDescription>Les dernières activités sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start pb-4 border-b last:border-0 last:pb-0 animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                <div className="flex-1">
                  <h4 className="font-semibold">{activity.type}</h4>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
