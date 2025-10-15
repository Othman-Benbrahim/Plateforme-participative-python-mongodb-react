import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { motion } from 'framer-motion';

export const StatsCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="hover:shadow-md transition-shadow" data-testid="stats-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
            {Icon && <Icon className="h-4 w-4 text-slate-400" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};