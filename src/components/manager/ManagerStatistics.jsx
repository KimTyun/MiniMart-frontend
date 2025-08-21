import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getYearThunk } from '../../features/adminSlice'
import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from 'recharts'
import '../../styles/managerStatistics.css'

function ManagerStatistics() {
   const dispatch = useDispatch()
   const { yearData, loading, error } = useSelector((state) => state.admin)

   useEffect(() => {
      dispatch(getYearThunk())
   }, [dispatch])

   const pieData =
      Array.isArray(yearData) && yearData.length > 0
         ? yearData
              .filter((item) => item && typeof item === 'object' && item.name && typeof item.value === 'number' && item.value > 0)
              .map((item) => ({
                 name: String(item.name),
                 value: Number(item.value),
              }))
         : []

   console.log('Filtered pieData:', pieData)

   const COLORS = ['#ff0000', '#ff7b00', '#b1a500', '#51ff00', '#0084ff', '#6200ff']

   const renderCustomizedLabel = (props) => {
      if (!props || typeof props.cx !== 'number' || typeof props.cy !== 'number' || typeof props.percent !== 'number' || typeof props.midAngle !== 'number' || typeof props.innerRadius !== 'number' || typeof props.outerRadius !== 'number') {
         return null
      }

      const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
      const RADIAN = Math.PI / 180
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)

      return (
         <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${Math.round(percent * 100)}%`}
         </text>
      )
   }

   if (loading) return <div>로딩중...</div>
   if (error) return <div>에러: {error}</div>

   // 데이터가 없거나 모든 값이 0인 경우
   if (!pieData || pieData.length === 0) {
      return (
         <div>
            <h2>올해 연령대별 가입자 통계</h2>
            <div>표시할 데이터가 없습니다.</div>
         </div>
      )
   }

   return (
      <div>
         <h2>올해 연령대별 가입자 통계</h2>
         <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
               <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={120} dataKey="value">
                     {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Legend />
               </PieChart>
            </ResponsiveContainer>
         </div>
      </div>
   )
}

export default ManagerStatistics
