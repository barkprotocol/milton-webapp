import { TooltipProps } from 'recharts';

const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <h4 className="font-semibold">{label}</h4>
        <p className="text-sm">Transactions: {payload[0].value}</p>
        <p className="text-sm">Rewards: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
