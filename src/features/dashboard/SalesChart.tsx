import React, { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { Card } from '../../components/ui/Card'
import { formatRupiah, cn } from '../../lib/utils'

export interface SalesDataPoint {
  label: string
  sales: number
  count: number
}

interface SalesChartProps {
  hourlyData?: SalesDataPoint[]
  weeklyData?: SalesDataPoint[]
}

const DEFAULT_HOURLY: SalesDataPoint[] = [
  { label: '08:00', sales: 45000, count: 2 },
  { label: '10:00', sales: 120000, count: 5 },
  { label: '12:00', sales: 340000, count: 12 },
  { label: '14:00', sales: 210000, count: 8 },
  { label: '16:00', sales: 180000, count: 7 },
  { label: '18:00', sales: 420000, count: 15 },
  { label: '20:00', sales: 290000, count: 9 },
]

const DEFAULT_WEEKLY: SalesDataPoint[] = [
  { label: 'Sen', sales: 1250000, count: 42 },
  { label: 'Sel', sales: 1480000, count: 50 },
  { label: 'Rab', sales: 1320000, count: 45 },
  { label: 'Kam', sales: 1650000, count: 56 },
  { label: 'Jum', sales: 2100000, count: 72 },
  { label: 'Sab', sales: 2850000, count: 95 },
  { label: 'Min', sales: 2600000, count: 88 },
]

export const SalesChart: React.FC<SalesChartProps> = ({
  hourlyData = DEFAULT_HOURLY,
  weeklyData = DEFAULT_WEEKLY,
}) => {
  const [period, setPeriod] = useState<'hourly' | 'weekly'>('hourly')
  const [chartType, setChartType] = useState<'area' | 'bar'>('area')

  const chartData = period === 'hourly' ? hourlyData : weeklyData

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-zinc-950">Tren Penjualan & Omzet</h3>
          <p className="text-xs text-zinc-500">
            Aktivitas transaksi dan pergerakan omzet kasir
          </p>
        </div>

        {/* Controls: Period toggle and Chart style */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-100 rounded-lg flex gap-1">
            <button
              onClick={() => setPeriod('hourly')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer',
                period === 'hourly'
                  ? 'bg-white text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              )}
            >
              Jam Hari Ini
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer',
                period === 'weekly'
                  ? 'bg-white text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              )}
            >
              7 Hari Terakhir
            </button>
          </div>

          <div className="p-1 bg-zinc-100 rounded-lg flex gap-1">
            <button
              onClick={() => setChartType('area')}
              className={cn(
                'px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer',
                chartType === 'area'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              )}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                'px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer',
                chartType === 'bar'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              )}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#18181B" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#A1A1AA"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#A1A1AA"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `Rp ${val / 1000}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SalesDataPoint
                    return (
                      <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="text-zinc-400 font-medium">{label}</p>
                        <p className="font-extrabold text-sm text-amber-300">
                          {formatRupiah(data.sales)}
                        </p>
                        <p className="text-[11px] text-zinc-300">
                          {data.count} transaksi selesai
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#18181B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#A1A1AA"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#A1A1AA"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `Rp ${val / 1000}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SalesDataPoint
                    return (
                      <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="text-zinc-400 font-medium">{label}</p>
                        <p className="font-extrabold text-sm text-amber-300">
                          {formatRupiah(data.sales)}
                        </p>
                        <p className="text-[11px] text-zinc-300">
                          {data.count} transaksi selesai
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="sales" fill="#18181B" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
