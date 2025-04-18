"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

type Building = {
  id: number
  name: string
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [formData, setFormData] = useState({
    ref: "",
    type: "",
    building_id: "",
    surface: "",
    rooms: "",
    floor: "",
    rent: "",
    charges: "",
    deposit: "",
    description: "",
    status: "",
  })

  useEffect(() => {
    const fetchBuildings = async () => {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.from("buildings").select("id, name").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching buildings:", error)
        return
      }

      setBuildings(data || [])
    }

    fetchBuildings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const propertyData = {
        ...formData,
        building_id: Number.parseInt(formData.building_id),
        surface: Number.parseFloat(formData.surface),
        rooms: Number.parseInt(formData.rooms),
        floor: formData.floor ? Number.parseInt(formData.floor) : null,
        rent: Number.parseFloat(formData.rent),
        charges: Number.parseFloat(formData.charges),
        deposit: Number.parseFloat(formData.deposit),
      }

      const { error } = await supabase.from("properties").insert([propertyData])

      if (error) throw error

      router.push("/biens")
      router.refresh()
    } catch (error) {
      console.error("Error adding property:", error)
      alert("Une erreur est survenue lors de l'ajout du bien")
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="flex items-center">
          <Home className="h-6 w-6 mr-2 text-gray-500" />
          <h1 className="text-3xl font-bold">Nouveau Bien</h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations du bien</CardTitle>
          <CardDescription>Ajoutez un nouveau bien immobilier à votre portefeuille</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ref">Référence</Label>
                  <Input
                    id="ref"
                    name="ref"
                    placeholder="APT-A102"
                    required
                    value={formData.ref}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de bien</Label>
                  <Select onValueChange={(value) => handleSelectChange("type", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appartement">Appartement</SelectItem>
                      <SelectItem value="Maison">Maison</SelectItem>
                      <SelectItem value="Parking">Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="building_id">Immeuble</Label>
                <Select onValueChange={(value) => handleSelectChange("building_id", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un immeuble" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input
                    id="surface"
                    name="surface"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="65"
                    required
                    value={formData.surface}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Nombre de pièces</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    min="0"
                    placeholder="3"
                    required
                    value={formData.rooms}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Étage</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={formData.floor}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Loyer (€)</Label>
                  <Input
                    id="rent"
                    name="rent"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1200"
                    required
                    value={formData.rent}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charges">Charges (€)</Label>
                  <Input
                    id="charges"
                    name="charges"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150"
                    required
                    value={formData.charges}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit">Dépôt de garantie (€)</Label>
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2400"
                    required
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description du bien..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select onValueChange={(value) => handleSelectChange("status", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Occupé">Occupé</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                    <SelectItem value="Préavis">Préavis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/biens")}>
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
