import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RiskLevelBadge, RiskStatusBadge } from "@/components/StatusBadge";

const riskColors: Record<string, string> = {
  Critical: "hsl(0, 72%, 45%)",
  High: "hsl(0, 84%, 60%)",
  Medium: "hsl(38, 92%, 50%)",
  Low: "hsl(142, 71%, 45%)",
};

export default function RisksOverview() {
  const { risks } = useGRC();

  const heatMapData = risks.map(r => ({
    x: r.impact,
    y: r.likelihood,
    name: r.title,
    level: r.level,
  }));

  const riskSummary = [
    { label: "Critical", count: risks.filter(r => r.level === "Critical").length },
    { label: "High", count: risks.filter(r => r.level === "High").length },
    { label: "Medium", count: risks.filter(r => r.level === "Medium").length },
    { label: "Low", count: risks.filter(r => r.level === "Low").length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Risk heat map and distribution analysis</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {riskSummary.map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{item.count}</p>
              <RiskLevelBadge level={item.label} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Heat Map (Likelihood vs Impact)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="x" name="Impact" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} label={{ value: "Impact →", position: "bottom", offset: 0 }} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="y" name="Likelihood" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} label={{ value: "Likelihood →", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                <Tooltip content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">Impact: {d.x} · Likelihood: {d.y}</p>
                      <RiskLevelBadge level={d.level} />
                    </div>
                  );
                }} />
                <Scatter data={heatMapData}>
                  {heatMapData.map((entry, i) => (
                    <Cell key={i} fill={riskColors[entry.level]} r={8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Risks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {risks.map(risk => (
              <div key={risk.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{risk.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Asset: {risk.assetName} · Owner: {risk.owner}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <RiskLevelBadge level={risk.level} />
                  <RiskStatusBadge status={risk.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
