"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

interface Sweet {
  _id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [searchName, setSearchName] = useState("")
  const [searchCategory, setSearchCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    fetchSweets()
  }, [])

  useEffect(() => {
    filterSweets()
  }, [searchName, searchCategory, minPrice, maxPrice, sweets])

  const fetchSweets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sweets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSweets(response.data.sweets)
      setFilteredSweets(response.data.sweets)
      setLoading(false)
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching sweets")
      setLoading(false)
    }
  }

  const filterSweets = () => {
    let filtered = [...sweets]

    if (searchName) {
      filtered = filtered.filter((sweet) => sweet.name.toLowerCase().includes(searchName.toLowerCase()))
    }

    if (searchCategory) {
      filtered = filtered.filter((sweet) => sweet.category.toLowerCase().includes(searchCategory.toLowerCase()))
    }

    if (minPrice) {
      filtered = filtered.filter((sweet) => sweet.price >= Number(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter((sweet) => sweet.price <= Number(maxPrice))
    }

    setFilteredSweets(filtered)
  }

  const handlePurchase = async (sweetId: string, quantity: number) => {
    if (quantity <= 0) return

    try {
      await axios.post(
        `http://localhost:5000/api/sweets/${sweetId}/purchase`,
        { quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchSweets()
      alert("Purchase successful!")
    } catch (error: any) {
      alert(error.response?.data?.message || "Error processing purchase")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading sweets...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Sweet Shop Dashboard</h1>
        <p className="text-gray-600">Browse and purchase delicious sweets</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Sweet name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Category</label>
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Category..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sweets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSweets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No sweets found</div>
        ) : (
          filteredSweets.map((sweet) => (
            <div
              key={sweet._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                {sweet.imageUrl ? (
                  <img
                    src={sweet.imageUrl || "/placeholder.svg"}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🍬</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {sweet.category}
                  </span>
                </div>
                {sweet.description && <p className="text-sm text-gray-600 mb-3">{sweet.description}</p>}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">${sweet.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium ${sweet.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {sweet.quantity > 0 ? `${sweet.quantity} in stock` : "Out of stock"}
                  </span>
                </div>
                <button
                  onClick={() => handlePurchase(sweet._id, sweet.quantity)}
                  disabled={sweet.quantity === 0}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
