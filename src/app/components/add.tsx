"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type Member = {
    name: string 
    speciality: string
    hours: number | ""
}

type TeamAllocation = {
    project: {
        task: string
        createdAt: string
    }
    teamMembers: {
        id: number
        name: string
        speciality: string
        hoursPerDay: number
    }[]
    totalMembers: number
    totalHoursPerDay: number
    companyName : string
    managerName : string
}

export default function TeamTable() {
    const [rows, setRows] = useState<Member[]>([
        {name:"", speciality: "", hours:""},
        {name:"", speciality: "", hours:""},
        {name:"", speciality: "", hours:""}
    ])
    const [textareaValue, setTextareaValue] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [managerName, setManagerName] = useState("")
    const [submissionResult, setSubmissionResult] = useState<TeamAllocation | null>(null)

    const addRow = () => {
        setRows([...rows, {name:"", speciality: "", hours: ""}])
    }

    const updateRow = (index: number, field: keyof Member, value: string) => {
        const updatedRows = [...rows]
        if(field === "hours"){
            if(value === "" || /^\d+$/.test(value)) {
                const num = value === "" ? "" : Number(value)
                updatedRows[index][field] = num
            } else {
                return
            }
        }
        else if(field === "name") {
            if(/^[a-zA-Z\s\-'\.]*$/.test(value)) {
                updatedRows[index][field] = value
            } else {
                return
            }
        }
        else { 
            updatedRows[index][field] = value
        }
        setRows(updatedRows)
    }

    const createTeamData = (): TeamAllocation => {
        const validMembers = rows.filter(row => 
            row.name.trim() !== "" || row.speciality.trim() !== "" || row.hours !== ""
        )
        
        const teamAllocation: TeamAllocation = {
            project: {
                task: textareaValue.trim(),
                createdAt: new Date().toISOString()
            },
            teamMembers: validMembers.map((member, index) => ({
                id: index + 1,
                name: member.name.trim(),
                speciality: member.speciality.trim(),
                hoursPerDay: member.hours === "" ? 0 : Number(member.hours)
            })),
            totalMembers: validMembers.length,
            totalHoursPerDay: validMembers.reduce((total, member) => {
                return total + (member.hours === "" ? 0 : Number(member.hours))
            }, 0),
            companyName,
            managerName
        }
        return teamAllocation
    }
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
const [isGenerating, setIsGenerating] = useState(false)
const [isDownloading, setIsDownloading] = useState(false)

const handleSubmit = async () => {
    try {
        setIsGenerating(true)
        const teamData = createTeamData()
        setSubmissionResult(teamData)
        console.log("Team Allocation Data:", teamData)
        
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData)
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to generate PDF')
        }
        
        const blob = await response.blob()
        setPdfBlob(blob)
        
        console.log('PDF generated successfully!')
        alert("pdf generation successful!")
        
    } catch (error) {
        console.error('Error generating PDF:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert('Failed to generate PDF: ' + errorMessage)
    } finally {
        setIsGenerating(false)
    }
}
const handleDownloadPdf = async () => {
    if (!pdfBlob) {
        alert('No PDF available. Please generate the allocation first.')
        return
    }
    
    try {
        setIsDownloading(true)
        
        const url = window.URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `team-allocation-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        console.log('PDF downloaded successfully!')
        
    } catch (error) {
        console.error('Error downloading PDF:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert('Failed to download PDF: ' + errorMessage)
    } finally {
        setIsDownloading(false)
    }
}
const handlePreviewPdf = () => {
    if (!pdfBlob) {
        alert('No PDF available. Please generate the allocation first.')
        return
    }
    
    const url = window.URL.createObjectURL(pdfBlob)
    window.open(url)
}

    const validateForm = () => {
        const hasValidMembers = rows.some(row => 
            row.name.trim() !== "" && row.speciality.trim() !== "" && row.hours !== ""
        )
        const hasTask = textareaValue.trim() !== ""
        return hasValidMembers && hasTask
    }

    return( 
        <div className="p-4 h-screen max-w-4xl mx-auto bg-[#262624] font-sans flex flex-col border border-white/20 ">
            <div className="w-full flex items-center justify-center p-4">
                <p className="text-5xl font-sans text-[#c2c0b6]">Allocatr</p>
            </div>
            
            <div className="space-y-8 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    <h2 className="text-2xl font-sans text-[#c2c0b6] mb-4">Team Members</h2>
                    <div className="rounded-xl overflow-hidden">
                        <div className="h-64 overflow-y-auto">
                            <table className="table-auto w-full border-collapse font-sans">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-[#2b2b28]">
                                        <th className="bg-[#e26e47] p-2 text-[#ffffff] font-sans border-2 border-[#2b2b28] rounded-2xl">
                                            Name
                                        </th>
                                        <th className="bg-[#e26e47] p-2 text-[#ffffff] font-sans border-2 border-[#2b2b28] mx-2 rounded-2xl">
                                            Speciality
                                        </th>
                                        <th className="bg-[#e26e47] p-2 text-[#ffffff] font-sans border-2 border-[#2b2b28] rounded-2xl">
                                            <div className="font-semibold">
                                                Hours per day
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i} className="">
                                            <td className="p-1">
                                                <Input 
                                                    value={row.name} 
                                                    onChange={(e) => updateRow(i, "name", e.target.value)} 
                                                    placeholder="Name" 
                                                    className="w-full font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <Input value={row.speciality} onChange={(e) => updateRow(i, "speciality", e.target.value)} placeholder="Speciality" className="w-full font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]" />
                                            </td>
                                            <td className="p-1">
                                                <Input type="text" value={row.hours === "" ? "" : row.hours.toString()} onChange={(e) => updateRow(i, "hours", e.target.value)} placeholder="Hours" className="w-full font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]"/>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-full flex justify-end mt-4">
                        <button type="button" className="flex gap-1 items-center px-4 py-2 cursor-pointer bg-[#162f91] text-white rounded hover:bg-[#13277a] transition font-sans" onClick={addRow}>
                            <Plus />Add Row
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-sans text-[#c2c0b6] mb-4">Company&apos;s Name</h2>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Allocatr" className="resize-none font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]"/>
                </div>
                                <div className="space-y-4">
                    <h2 className="text-2xl font-sans text-[#c2c0b6] mb-4">Manager&apos;s Name</h2>
                    <Input value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="John Doe" className="resize-none font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]"/>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-sans text-[#c2c0b6] mb-4">Tasks</h2>
                    <Textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} placeholder="Type in the tasks and the time frame you want them to be done in." className="resize-none h-32 font-sans bg-[#30302e] border-white/10 text-[#c2c0b6]"/>
                </div>

                {submissionResult && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-sans text-[#c2c0b6] mb-4">Team Allocation Summary</h2>
                        <div className="bg-[#30302e] border border-white/10 rounded-lg p-4 text-[#c2c0b6]">
                            <p><strong>Project Task:</strong> {submissionResult.project.task}</p>
                            <p><strong>Total Members:</strong> {submissionResult.totalMembers}</p>
                            <p><strong>Total Hours per Day:</strong> {submissionResult.totalHoursPerDay}</p>
                        <p><strong>Created:</strong> {new Date(submissionResult.project.createdAt).toLocaleString()}</p>
                            
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Team Members:</h3>
                        {submissionResult.teamMembers.map(member => (
                        <div key={member.id} className="ml-4 mb-1">
                            {member.name} - {member.speciality} ({member.hoursPerDay}h/day)
                        </div>
                        ))}
                    </div>
                        </div>
                    </div>
                )}

                <div className="w-full flex justify-center pt-4">
                    <button 
                    type="button" 
                    className={`cursor-pointer px-8 py-3 rounded-lg font-sans font-semibold text-lg transition ${
                            validateForm() 
                        ? 'bg-[#e26e47] text-white hover:bg-[#d4603f]' 
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                        onClick={handleSubmit}
                        disabled={!validateForm()}
                    >
                        Get Team Allocation Roadmap
                    </button>
                </div>
                        <button 
            onClick={handleSubmit}
            disabled={isGenerating}
            className="submit-btn"
        >
        </button>
        
        {pdfBlob && (
            <div className="pdf-actions flex justify-center gap-8 h-12">
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="download-btn cursor-pointer bg-[#e26e47] hover:bg-[#d4603f] rounded-lg flex justify-center items-center p-4"
                >
                    <p>
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                    </p>
                </button>
                
                <button 
                    onClick={handlePreviewPdf}
                    className="preview-btn cursor-pointer bg-[#e26e47] hover:bg-[#d4603f] rounded-lg flex justify-center items-center p-4"
                >
                   <p>Preview PDF</p> 
                </button>
            </div>
        )}
            </div>
        </div>
    )
}