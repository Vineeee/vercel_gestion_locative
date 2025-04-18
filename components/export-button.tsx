"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"

interface ExportButtonProps {
  variant?: "default" | "outline"
}

export function ExportButton({ variant = "outline" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: string) => {
    setIsExporting(true)
    try {
      // Rediriger vers l'API d'export
      window.location.href = `/api/export?type=${type}`
    } catch (error) {
      console.error("Error exporting data:", error)
    } finally {
      // Petit délai pour montrer le chargement
      setTimeout(() => {
        setIsExporting(false)
      }, 1000)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exportation..." : "Exporter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("buildings")}>Exporter les immeubles</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("properties")}>Exporter les biens</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("tenants")}>Exporter les locataires</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("leases")}>Exporter les baux</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
