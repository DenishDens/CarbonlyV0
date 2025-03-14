import MaterialLibrary from "@/components/material-library"

export default function MaterialsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Material Library</h1>
      <p className="text-gray-600">Manage emission factors for different materials and activities</p>
      <MaterialLibrary />
    </div>
  )
}

