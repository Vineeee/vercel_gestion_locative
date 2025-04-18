import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")

    let data

    switch (type) {
      case "buildings":
        const { data: buildings } = await supabase.from("buildings").select("*")
        data = buildings
        break
      case "properties":
        const { data: properties } = await supabase.from("properties").select(`
            *,
            buildings:building_id (
              name
            )
          `)
        data = properties
        break
      case "tenants":
        const { data: tenants } = await supabase.from("tenants").select("*")
        data = tenants
        break
      case "leases":
        const { data: leases } = await supabase.from("leases").select(`
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
        data = leases
        break
      default:
        return NextResponse.json({ error: "Type non valide" }, { status: 400 })
    }

    // Convertir les données en CSV
    const headers = data && data.length > 0 ? Object.keys(data[0]) : []
    const csvRows = []

    // Ajouter l'en-tête
    csvRows.push(headers.join(","))

    // Ajouter les lignes de données
    for (const row of data || []) {
      const values = headers.map((header) => {
        const value = row[header]
        // Gérer les objets imbriqués
        if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        // Échapper les guillemets et les virgules
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
      })
      csvRows.push(values.join(","))
    }

    // Créer le contenu CSV
    const csvContent = csvRows.join("\n")

    // Retourner le CSV comme réponse
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${type}_export_${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Erreur lors de l'exportation des données" }, { status: 500 })
  }
}
