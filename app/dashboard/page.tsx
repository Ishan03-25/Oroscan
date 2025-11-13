"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Activity, TrendingUp, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"

const screeningData = [
  { month: "Jan", completed: 45, pending: 12 },
  { month: "Feb", completed: 52, pending: 8 },
  { month: "Mar", completed: 48, pending: 15 },
  { month: "Apr", completed: 61, pending: 10 },
  { month: "May", completed: 55, pending: 14 },
  { month: "Jun", completed: 67, pending: 9 },
]

const riskDistribution = [
  { name: "Low Risk", value: 45, color: "#10b981" },
  { name: "Medium Risk", value: 30, color: "#f59e0b" },
  { name: "High Risk", value: 15, color: "#ef4444" },
  { name: "Pending", value: 10, color: "#6b7280" },
]

const recentScreenings = [
  { id: 1, name: "John Doe", date: "2025-10-20", status: "Completed", risk: "Low" },
  { id: 2, name: "Jane Smith", date: "2025-10-19", status: "Completed", risk: "Medium" },
  { id: 3, name: "Mike Johnson", date: "2025-10-18", status: "Pending", risk: "N/A" },
  { id: 4, name: "Sarah Williams", date: "2025-10-17", status: "Completed", risk: "High" },
  { id: 5, name: "Tom Brown", date: "2025-10-16", status: "Completed", risk: "Low" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Removed duplicate MedTech heading */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Screenings */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Screenings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">328</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">298</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">90.8% completion rate</p>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">30</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">9.2% pending</p>
            </CardContent>
          </Card>

          {/* High Risk */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">15</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">4.6% of completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Screening Trends */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Screening Trends</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Monthly completed and pending screenings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={screeningData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-600" />
                  <XAxis dataKey="month" stroke="#64748b" className="dark:stroke-slate-400" />
                  <YAxis stroke="#64748b" className="dark:stroke-slate-400" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "var(--background)", 
                      border: "1px solid var(--border)", 
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Risk Distribution</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Patient risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--background)", 
                      border: "1px solid var(--border)", 
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Screenings Table */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Recent Screenings</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Latest patient screening records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScreenings.map((screening) => (
                    <tr key={screening.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-100">{screening.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{screening.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            screening.status === "Completed"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                          }`}
                        >
                          {screening.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            screening.risk === "Low"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : screening.risk === "Medium"
                                ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                                : screening.risk === "High"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {screening.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
