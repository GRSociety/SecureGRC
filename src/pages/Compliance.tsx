import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

export default function Compliance() {
  const { controls, risks, getCompliancePercentage, getNonCompliantControls, getActiveRisksCount } = useGRC();
  const compliance = getCompliancePercentage();
  const nonCompliant = getNonCompliantControls();
  const activeRisks = getActiveRisksCount();

  const allSafeguards = controls.flatMap(c => c.safeguards);
  const inProgress = allSafeguards.filter(s => s.status === "in-progress").length;

  // Generate security plan items from non-compliant controls
  const securityPlan = nonCompliant.map(nc => {
    const relatedRisks = risks.filter(r => r.cisControlId?.startsWith(nc.safeguardId.split(".")[0]));
    return {
      ...nc,
      priority: relatedRisks.some(r => r.level === "Critical") ? "Critical" : relatedRisks.some(r => r.level === "High") ? "High" : "Medium",
      relatedRiskCount: relatedRisks.length,
      recommendation: `Implement ${nc.safeguardTitle.toLowerCase()} to address ${relatedRisks.length} associated risk${relatedRisks.length !== 1 ? "s" : ""}`,
    };
  }).sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2 };
    return (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance & Security Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">Strategic improvements based on CIS Framework gaps</p>
      </div>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="text-lg font-bold text-foreground">Overall Compliance</p>
                <p className="text-sm text-muted-foreground">CIS Critical Security Controls v8</p>
              </div>
            </div>
            <span className="text-4xl font-bold text-primary">{compliance}%</span>
          </div>
          <Progress value={compliance} className="h-3" />
          <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
            <span><CheckCircle className="inline h-3 w-3 text-success mr-1" />{allSafeguards.filter(s => s.status === "compliant").length} Compliant</span>
            <span className="text-warning">{inProgress} In Progress</span>
            <span className="text-destructive">{nonCompliant.length} Non-Compliant</span>
            <span>{activeRisks} Active Risks</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Generated Security Plan ({securityPlan.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {securityPlan.map((item, i) => (
              <div key={item.safeguardId} className="p-5 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded mt-0.5">{i + 1}</span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{item.safeguardId}</span>
                        <Badge variant="outline" className={
                          item.priority === "Critical" ? "bg-destructive/10 text-destructive border-destructive/20" :
                          item.priority === "High" ? "bg-destructive/10 text-destructive border-destructive/20" :
                          "bg-warning/10 text-warning border-warning/20"
                        }>
                          {item.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.safeguardTitle}</p>
                      <p className="text-xs text-muted-foreground">Control: {item.controlTitle}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>{item.recommendation}</span>
                      </div>
                      {item.relatedRiskCount > 0 && (
                        <p className="text-xs text-destructive mt-1">{item.relatedRiskCount} associated risk{item.relatedRiskCount > 1 ? "s" : ""} identified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
