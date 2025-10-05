import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
interface KpiChartProps {
  title: string;
  data: any[];
  dataKeys: { name: string; color: string }[];
  xAxisKey: string;
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border-2 border-foreground p-4 font-mono">
        <p className="label text-lg font-bold">{`${label}`}</p>
        {payload.map((pld: any) => (
          <p key={pld.name} style={{ color: pld.color }}>
            {`${pld.name}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
export function KpiChart({ title, data, dataKeys, xAxisKey }: KpiChartProps) {
  return (
    <Card className="bg-background border-2 border-foreground rounded-none h-[400px] flex flex-col">
      <CardHeader className="p-4 border-b-2 border-foreground">
        <CardTitle className="text-lg font-bold font-mono uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#F5F5F5" strokeDasharray="0" strokeOpacity={0.3} />
            <XAxis dataKey={xAxisKey} stroke="#F5F5F5" tick={{ fill: '#F5F5F5' }} tickLine={{ stroke: '#F5F5F5' }} axisLine={{ stroke: '#F5F5F5' }} />
            <YAxis stroke="#F5F5F5" tick={{ fill: '#F5F5F5' }} tickLine={{ stroke: '#F5F5F5' }} axisLine={{ stroke: '#F5F5F5' }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FFDF00', strokeWidth: 2 }} />
            <Legend wrapperStyle={{ color: '#F5F5F5' }} />
            {dataKeys.map((key) => (
              <Line key={key.name} type="monotone" dataKey={key.name} stroke={key.color} strokeWidth={3} dot={{ r: 4, fill: key.color, strokeWidth: 2, stroke: '#1E1E1E' }} activeDot={{ r: 8, stroke: key.color, strokeWidth: 2, fill: '#1E1E1E' }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}