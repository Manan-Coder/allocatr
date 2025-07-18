"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type Member = {
    name: string 
    speciality: string
    hours: number | ""
}

export default function TeamTable() {
    const [rows, setRows] = useState<Member[]>([{name:"", speciality: "", hours:""}])

    const addRow = () => {
        setRows([...rows, {name:"", speciality: "", hours: ""}])
    }

    const updateRow = (index: number, field: keyof Member, value: string) => {
    const updateRows = [...rows]
    if(field === "hours"){
            if(value === "" || /^\d+$/.test(value)) {
            const num = value === "" ? "" : Number(value)
            updateRows[index][field] = num
            } else {
                return
            }
        }
        else if(field === "name") {
        if(/^[a-zA-Z\s\-'\.]*$/.test(value)) {
            updateRows[index][field] = value
            } else {
                return
            }
        }
        else { 
            updateRows[index][field] = value
        }
        setRows(updateRows)
    }

    return( 
        <div className="p-4 max-w-4xl mx-auto">
            <div className="w-full flex items-center justify-center p-4">
            <p className="text-5xl">Allocatr</p>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-300">
                <th className="border border-gray-300 p-2 text-black">Name</th>
                <th className="border border-gray-300 p-2 text-black">Speciality</th>
                    <th className="border border-gray-300 p-2 text-black">Hours per day</th>
                </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border border-gray-300">
            <td className="border border-gray-300 p-1">
                <Input value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)} placeholder="Name" className="w-full"/>
            </td>
            <td className="border border-gray-300 p-1">
                <Input
                    value={row.speciality} onChange={(e) => updateRow(i, "speciality", e.target.value)} placeholder="Speciality" className="w-full" />
            </td>
            <td className="border border-gray-300 p-1">
                <Input type="text" value={row.hours === "" ? "" : row.hours.toString()} onChange={(e) => updateRow(i, "hours", e.target.value)} placeholder="Hours" className="w-full"/>
            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={addRow}
            >
                Add Row
            </button>
        </div>
    )
}