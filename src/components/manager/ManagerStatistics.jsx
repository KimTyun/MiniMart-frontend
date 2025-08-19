import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getYearThunk } from '../../features/adminSlice'
import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from 'recharts'

function ManagerStatistics() {
   const dispatch = useDispatch()
   const { yearData, loading, error } = useSelector((state) => state.admin)

   useEffect(() => {
      const now = new Date()
      dispatch(getYearThunk())
   }, [dispatch])

   const pieData = yearData?.length
      ? yearData.map((item) => ({
           name: item.name,
           value: item.value,
        }))
      : []

   const COLORS = ['#ff0000', '#ff7b00', '#ffee00', '#51ff00', '#0084ff', '#6200ff']

   const RADIAN = Math.PI / 180
   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)

      return (
         <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
         </text>
      )
   }

   if (loading) return <p>로딩중...</p>
   if (error) return <p style={{ color: 'red' }}>에러: {error}</p>

   return (
      <>
         <div>
            <h3>올해 연령대별 가입자 통계</h3>
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={120} fill="#0d00ff" dataKey="value">
                     {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Legend iconSize={30} layout="vertical" type="file" verticalAlign="middle" align="center" wrapperStyle={{ paddingLeft: 320 }} />
               </PieChart>
            </ResponsiveContainer>
         </div>
      </>
   )
}

export default ManagerStatistics
