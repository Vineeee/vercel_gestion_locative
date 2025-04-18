"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export default function NewBuildingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    units: "",
    year_built: "",
    status: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createBrowserSupabaseClient()

      // Convert string values to appropriate types
      const buildingData = {
        ...formData,
        units: Number.parseInt(formData.units),
        year_built: Number.parseInt(formData.year_built),
      }

      const { error } = await supabase.from("buildings").insert([buildingData])

      if (error) throw error

      router.push("/immeubles")
      router.refresh()
    } catch (error) {
      console.error("Error adding building:", error)
      alert("Une erreur est survenue lors de l'ajout de l'immeuble")
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div className="flex items-center">
          <Building className="h-6 w-6 mr-2 text-gray-500" />
          <h1 className="text-3xl font-bold">Nouvel Immeuble</h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations de l'immeuble</CardTitle>
          <CardDescription>Ajoutez un nouvel immeuble à votre portefeuille</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'immeuble</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Résidence Les Oliviers"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="12 Rue des Lilas, 75001 Paris"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'immeuble</Label>
                  <Select onValueChange={(value) => handleSelectChange("type", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Mixte">Mixte</SelectItem>
                      <SelectItem value="Historique">Historique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Nombre d'unités</Label>
                  <Input
                    id="units"
                    name="units"
                    type="number"
                    min="1"
                    placeholder="24"
                    required
                    value={formData.units}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year_built">Année de construction</Label>
                  <Input
                    id="year_built"
                    name="year_built"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    placeholder="2010"
                    required
                    value={formData.year_built}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">État général</Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Bon">Bon</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                      <SelectItem value="Rénové">Rénové</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/immeubles")}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
