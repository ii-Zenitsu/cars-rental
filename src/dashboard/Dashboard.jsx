import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts"
import { Car, Users, FileText, DollarSign } from "lucide-react"

export default function Dashboard() {
  const cars = useSelector((state) => state.cars)
  const clients = useSelector((state) => state.clients)
  const contracts = useSelector((state) => state.contracts)

  // Calculate key metrics
  const totalCars = cars.length
  const availableCars = cars.filter((car) => car.available).length
  const activeContracts = contracts.filter((contract) => contract.getStatus()).length
  const totalRevenue = contracts.reduce((sum, contract) => sum + contract.getTotalPrice(cars), 0)

  // Car types data for pie chart
  const carTypeData = [
    { name: "Petrol", value: cars.filter((car) => car.type === "petrol").length },
    { name: "Diesel", value: cars.filter((car) => car.type === "diesel").length },
    { name: "Electric", value: cars.filter((car) => car.type === "electric").length },
    { name: "Hybrid", value: cars.filter((car) => car.type === "hybrid").length },
  ]

  // Car availability by type
  const availabilityByType = [
    {
      name: "Petrol",
      Available: cars.filter((car) => car.type === "petrol" && car.available).length,
      Unavailable: cars.filter((car) => car.type === "petrol" && !car.available).length,
    },
    {
      name: "Diesel",
      Available: cars.filter((car) => car.type === "diesel" && car.available).length,
      Unavailable: cars.filter((car) => car.type === "diesel" && !car.available).length,
    },
    {
      name: "Electric",
      Available: cars.filter((car) => car.type === "electric" && car.available).length,
      Unavailable: cars.filter((car) => car.type === "electric" && !car.available).length,
    },
    {
      name: "Hybrid",
      Available: cars.filter((car) => car.type === "hybrid" && car.available).length,
      Unavailable: cars.filter((car) => car.type === "hybrid" && !car.available).length,
    },
  ]

  // Popular car brands
  const brandCounts = {}
  cars.forEach((car) => {
    brandCounts[car.brand] = (brandCounts[car.brand] || 0) + 1
  })

  const popularBrands = Object.entries(brandCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)


  // Group contracts by month for revenue trend
  const monthlyRevenue = {}
  contracts.forEach((contract) => {
    const startDate = new Date(contract.startDate)
    const month = startDate.toLocaleString("default", { month: "short" })
    const revenue = contract.getTotalPrice(cars)

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0
    }
    monthlyRevenue[month] += revenue
  })

  const revenueData = Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount }))

  // Contract Duration Scatter Plot
  const contractDurationData = contracts.map((contract) => ({
    duration: contract.getDuration(),
    revenue: contract.getTotalPrice(cars),
  }))

  // Popular Car Models
  const modelCounts = {}
  cars.forEach((car) => {
    const model = `${car.brand} ${car.model}`
    modelCounts[model] = (modelCounts[model] || 0) + 1
  })
  const popularModels = Object.entries(modelCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  // Client Age Distribution
  const ageGroups = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-55": 0,
    "56+": 0,
  }
  clients.forEach((client) => {
    const age = client.getAge()
    if (age <= 25) ageGroups["18-25"]++
    else if (age <= 35) ageGroups["26-35"]++
    else if (age <= 45) ageGroups["36-45"]++
    else if (age <= 55) ageGroups["46-55"]++
    else ageGroups["56+"]++
  })
  const clientAgeData = Object.entries(ageGroups).map(([range, count]) => ({ range, count }))

  const [primary, accent, secondary, base] = ["#ff865b", "#b387fa", "#fd6f9c", "#9fb9d0"]
  const COLORS = [
    "#ff865b", // Primary
    "#b387fa", // Accent
    "#fd6f9c", // secondary
    "#cca5fc",
    "#ffbea6",
    "#e5c3fd",
    "#ffd9cc",
    "#f0d6fe",
    "#fff0eb",
    "#f8e8fe",
  ]

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 p-4 bg-base-100">
      <h1 className="text-4xl font-bold mb-6 text-base-content">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-6 lg:gap-16 lg:mx-12 my-8">
        <Card className="bg-base-300 border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-base-content">Total Cars</CardTitle>
            <Car className="mb-2 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-base-content">{totalCars}</div>
            <p className="text-xs text-base-content/70">
              {availableCars} available ({Math.round((availableCars / totalCars) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-base-300 border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-base-content">Total Clients</CardTitle>
            <Users className="mb-2 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-base-content">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-base-300 border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-base-content">Active Contracts</CardTitle>
            <FileText className="mb-2 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-base-content">{activeContracts}</div>
            <p className="text-xs text-base-content/70">Out of {contracts.length} total contracts</p>
          </CardContent>
        </Card>

        <Card className="bg-base-300 border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-base-content">Total Revenue</CardTitle>
            <DollarSign className="mb-2 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-base-content">€{totalRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-6 lg:gap-16 lg:mx-12 mt-16">
        {/* Car Types Pie Chart */}
        <Card className="bg-base-200 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Car Types Distribution</CardTitle>
            <CardDescription className="text-base-content/70">Breakdown of fleet by fuel type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {carTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "12px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="bg-base-300 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Revenue Trend</CardTitle>
            <CardDescription className="text-base-content/70">Monthly revenue from contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" stroke={secondary} />
                  <YAxis stroke={secondary} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "12px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="amount" stroke={accent} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Car Availability by Type */}
        <Card className="bg-base-300 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Availability by Type</CardTitle>
            <CardDescription className="text-base-content/70">Available vs. unavailable cars by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={availabilityByType}>
                  <XAxis dataKey="name" stroke={secondary} />
                  <YAxis stroke={secondary} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "12px"  }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="Available" fill="#ff865b" />
                  <Bar dataKey="Unavailable" fill="#b387fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Contract Duration vs Revenue Scatter Plot */}
        <Card className="bg-base-300 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Contract Duration vs Revenue</CardTitle>
            <CardDescription className="text-base-content/70">
              Relationship between contract duration and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <XAxis type="number" dataKey="duration" name="Duration" unit=" days" stroke={secondary} />
                  <YAxis type="number" dataKey="revenue" name="Revenue" unit="€" stroke={secondary} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "12px"  }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Scatter name="Contracts" data={contractDurationData} fill="#ff865b" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Client Age Distribution */}
        <Card className="bg-base-300 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Client Age Distribution</CardTitle>
            <CardDescription className="text-base-content/70">Age groups of clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientAgeData}>
                  <XAxis dataKey="range" stroke={secondary} />
                  <YAxis stroke={secondary} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "12px"  }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#ff865b">
                    {clientAgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

