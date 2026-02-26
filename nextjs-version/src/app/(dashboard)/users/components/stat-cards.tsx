import { Card, CardContent } from "@/components/ui/card"
import {Users, UserCheck, Clock, UserX} from "lucide-react"

interface StatCardsProps {
  stats: {
    total: number
    active: number
    pending: number
    inactive: number
  }
}

export function StatCards({ stats }: StatCardsProps) {
  const metrics = [
    {
      title: 'Total Team Members',
      value: stats.total,
      icon: Users,
      description: 'All team members',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Members',
      value: stats.active,
      icon: UserCheck,
      description: 'Currently active',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Pending Invites',
      value: stats.pending,
      icon: Clock,
      description: 'Awaiting acceptance',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Inactive Members',
      value: stats.inactive,
      icon: UserX,
      description: 'Deactivated accounts',
      color: 'text-gray-600 dark:text-gray-400'
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className='border'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <metric.icon className={`size-8 ${metric.color}`} />
            </div>

            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>{metric.title}</p>
              <div className='text-3xl font-bold'>{metric.value}</div>
              <p className='text-xs text-muted-foreground'>{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
