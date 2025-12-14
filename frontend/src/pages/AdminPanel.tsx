"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

interface Sweet {
  _id?: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

export default function AdminPanel() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [formData, setFormData] = useState<Sweet>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    imageUrl: "",
  })
  const { token } = useAuth()

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sweets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSweets(response.data.sweets)
    } catch (error: any) {
      alert(error.response?.data?.message || "Error fetching sweets")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingSweet && editingSweet._id) {
        // Update existing sweet
        await axios.put(`http://localhost:5000/api/sweets/${editingSweet._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert("Sweet updated successfully!")
      } else {
        // Add new sweet
        await axios.post("http://localhost:5000/api/sweets", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert("Sweet added successfully!")
      }

      setFormData({ name: "", category: "", price: 0, quantity: 0, description: "", imageUrl: "" })
      setShowAddForm(false)
      setEditingSweet(null)
      fetchSweets()
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving sweet")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return

    try {
      await axios.delete(`http://localhost:5000/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Sweet deleted successfully!")
      fetchSweets()
    } catch (error: any) {
      alert(error.response?.data?.message || "Error deleting sweet")
    }
  }

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setFormData(sweet)
    setShowAddForm(true)
  }

  const handleRestock = async (id: string) => {
    const quantity = prompt("Enter quantity to restock:")
    if (!quantity || isNaN(Number(quantity))) return

    try {
      await axios.post(
        `http://localhost:5000/api/sweets/${id}/restock`,
        { quantity: Number(quantity) },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert("Restock successful!")
      fetchSweets()
    } catch (error: any) {
      alert(error.response?.data?.message || "Error restocking sweet")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", category: "", price: 0, quantity: 0, description: "", imageUrl: "" })
    setEditingSweet(null)
    setShowAddForm(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your sweet inventory</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          {showAddForm ? "Cancel" : "Add New Sweet"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingSweet ? "Edit Sweet" : "Add New Sweet"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {editingSweet ? "Update Sweet" : "Add Sweet"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sweets Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Category</th>
                <th className="px-6 py-4 text-left font-medium">Price</th>
                <th className="px-6 py-4 text-left font-medium">Quantity</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sweets.map((sweet) => (
                <tr key={sweet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{sweet.name}</div>
                    {sweet.description && <div className="text-sm text-gray-500">{sweet.description}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {sweet.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">${sweet.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${sweet.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {sweet.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet._id!)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleDelete(sweet._id!)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
