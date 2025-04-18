"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

type Tenant = {
  id: number
  name: string
}

type Property = {
  id: number
  ref: string
  type: string
  building_id: number
  buildings: {
    name: string
  } | null
}

export default function NewLeasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [formData, setFormData] = useState({
    ref: "",
    tenant_id: "",
    property_id: "",
    start_date: "",
    end_date: "",
    rent: "",
    charges: "",
    deposit: "",
    payment_day: "5",
    payment_method: "",
    status: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createBrowserSupabaseClient()

      // Fetch tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from("tenants")
        .select("id, name")
        .order("name", { ascending: true })

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError)
      } else {
        setTenants(tenantsData || [])
      }

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select(`
          id, 
          ref, 
          type,
          building_id,
          buildings:building_id (
            name
          )
        `)
        .eq("status", "Vacant")
        .order("ref", { ascending: true })

      if (propertiesError) {
        console.error("Error fetching properties:", propertiesError)
      } else {
        setProperties(propertiesData || [])
      }
    }

    fetchData()
  }, [])

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
      const leaseData = {
        ...formData,
        tenant_id: Number.parseInt(formData.tenant_id),
        property_id: Number.parseInt(formData.property_id),
        rent: Number.parseFloat(formData.rent),
        charges: Number.parseFloat(formData.charges),
        deposit: Number.parseFloat(formData.deposit),
        payment_day: Number.parseInt(formData.payment_day),
      }

      const { error } = await supabase.from("leases").insert([leaseData])

      if (error) throw error

      // Update property status to "Occupé"
      const { error: updateError } = await supabase
        .from("properties")
        .update({ status: "Occupé" })
        .eq("id", formData.property_id)

      if (updateError) {
        console.error("Error updating property status:", updateError)
      }

      router.push("/baux")
      router.refresh()
    } catch (error) {
      console.error("Error adding lease:", error)
      alert("Une erreur est survenue lors de l'ajout du bail")
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-gray-500" />
          <h1 className="text-3xl font-bold">Nouveau Bail</h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations du bail</CardTitle>
          <CardDescription>Créez un nouveau contrat de location</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ref">Référence du bail</Label>
                <Input
                  id="ref"
                  name="ref"
                  placeholder="BAIL-2023-001"
                  required
                  value={formData.ref}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant_id">Locataire</Label>
                  <Select onValueChange={(value) => handleSelectChange("tenant_id", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un locataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id.toString()}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_id">Bien immobilier</Label>
                  <Select onValueChange={(value) => handleSelectChange("property_id", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bien" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.ref} - {property.buildings?.name || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    value={formData.end_date}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_day">Jour de paiement</Label>
                  <Input
                    id="payment_day"
                    name="payment_day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="5"
                    required
                    value={formData.payment_day}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Méthode de paiement</Label>
                  <Select onValueChange={(value) => handleSelectChange("payment_method", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                      <SelectItem value="Prélèvement automatique">Prélèvement automatique</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select onValueChange={(value) => handleSelectChange("status", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Préavis">Préavis</SelectItem>
                    <SelectItem value="Archivé">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/baux")}>
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
