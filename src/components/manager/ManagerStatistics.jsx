import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMonthThunk } from "../../features/adminSlice";
import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from "recharts";

function ManagerStatistics() {
  const dispatch = useDispatch();
  const { monthData, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    const now = new Date();
    dispatch(
      getMonthThunk({ year: now.getFullYear(), month: now.getMonth() + 1 })
    );
  }, [dispatch]);

  const pieData = monthData?.length
    ? monthData.map((item) => ({
        name: item.name,
        value: item.value,
      }))
    : [
        { name: "10대", value: 0 },
        { name: "20대", value: 0 },
        { name: "30대", value: 0 },
        { name: "40대", value: 0 },
        { name: "50대", value: 0 },
        { name: "60대", value: 0 },
      ];

  const COLORS = ["#4AB0C6", "#2D82B7", "#1A4882", "#5AC8C6", "#A3E4DB"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) return <p>로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>에러: {error}</p>;

  return (
    <div style={{ display: "flex", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="65%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend type="file" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ManagerStatistics;
