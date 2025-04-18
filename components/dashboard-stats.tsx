"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

type Stat = {
  title: string
  value: number
  change: string
  changeType: "increase" | "decrease" | "neutral"
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stat[]>([
    { title: "Immeubles", value: 0, change: "0", changeType: "neutral" },
    { title: "Biens", value: 0, change: "0", changeType: "neutral" },
    { title: "Locataires", value: 0, change: "0", changeType: "neutral" },
    { title: "Baux Actifs", value: 0, change: "0", changeType: "neutral" },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createBrowserSupabaseClient()

        const [
          { count: buildingsCount },
          { count: propertiesCount },
          { count: tenantsCount },
          { count: activeLeasesCount },
          { count: vacantPropertiesCount },
        ] = await Promise.all([
          supabase.from("buildings").select("*", { count: "exact", head: true }),
          supabase.from("properties").select("*", { count: "exact", head: true }),
          supabase.from("tenants").select("*", { count: "exact", head: true }),
          supabase.from("leases").select("*", { count: "exact", head: true }).eq("status", "Actif"),
          supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "Vacant"),
        ])

        setStats([
          {
            title: "Immeubles",
            value: buildingsCount || 0,
            change: "+1",
            changeType: "increase",
          },
          {
            title: "Biens",
            value: propertiesCount || 0,
            change: "+3",
            changeType: "increase",
          },
          {
            title: "Locataires",
            value: tenantsCount || 0,
            change: "+2",
            changeType: "increase",
          },
          {
            title: "Baux Actifs",
            value: activeLeasesCount || 0,
            change: "+2",
            changeType: "increase",
          },
        ])
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={isLoading ? "animate-pulse" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : stat.value}</div>
            <p className={`text-xs ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
              {stat.change} depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
