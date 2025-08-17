import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from "recharts";

function ManagerStatistics() {
  const pieData = [
    { name: "10대", value: 300 },
    { name: "20대", value: 200 },
    { name: "30대", value: 100 },
    { name: "40대", value: 50 },
    { name: "50대", value: 10 },
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

  return (
    <div style={{ display: "flex", height: "400px" }}>
      {/* Pie Chart */}
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
      <div></div>
    </div>
  );
}

export default ManagerStatistics;
