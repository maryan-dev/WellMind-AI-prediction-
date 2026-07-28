import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function LifestyleRadarChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="You"
            dataKey="you"
            stroke="#2196F3"
            fill="#2196F3"
            fillOpacity={0.35}
          />
          <Radar
            name="Cluster avg"
            dataKey="cluster"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
