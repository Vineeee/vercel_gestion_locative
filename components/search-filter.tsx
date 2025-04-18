"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFilterProps {
  placeholder?: string
  filters: {
    name: string
    options: { label: string; value: string }[]
  }[]
  baseUrl: string
}

export function SearchFilter({ placeholder = "Rechercher...", filters, baseUrl }: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce(
      (acc, filter) => {
        acc[filter.name] = searchParams.get(filter.name) || ""
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) {
      params.set("q", searchQuery)
    }

    for (const [key, value] of Object.entries(filterValues)) {
      if (value) {
        params.set(key, value)
      }
    }

    router.push(`${baseUrl}?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setFilterValues(
      filters.reduce(
        (acc, filter) => {
          acc[filter.name] = ""
          return acc
        },
        {} as Record<string, string>,
      ),
    )
    router.push(baseUrl)
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.name}>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={filterValues[filter.name]}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            >
              <option value="">Tous</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" type="button" onClick={resetFilters} className="mr-2">
          Réinitialiser
        </Button>
        <Button type="submit">
          <Filter className="mr-2 h-4 w-4" /> Appliquer les filtres
        </Button>
      </div>
    </form>
  )
}
