/**
 * FlowPost AI Usage Monitoring Script
 * 
 * Real-time monitoring of AI usage, costs, and performance
 * 
 * Run with: npx tsx scripts/monitor-ai-usage.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function getTodayStats() {
  const { data, error } = await supabase
    .from('ai_generated_content')
    .select('*')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching today stats:', error);
    return null;
  }

  const successful = data.filter(d => d.status === 'success' || !d.status);
  const failed = data.filter(d => d.status === 'error');
  const totalCost = data.reduce((sum, d) => sum + (d.cost || 0), 0);
  const totalTokens = data.reduce((sum, d) => sum + (d.tokens_used || 0), 0);
  const uniqueUsers = new Set(data.map(d => d.user_id)).size;

  return {
    total: data.length,
    successful: successful.length,
    failed: failed.length,
    totalCost,
    totalTokens,
    uniqueUsers,
    avgCost: data.length > 0 ? totalCost / data.length : 0,
    avgTokens: data.length > 0 ? totalTokens / data.length : 0,
  };
}

async function getMonthlyStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('ai_generated_content')
    .select('*')
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    console.error('Error fetching monthly stats:', error);
    return null;
  }

  const totalCost = data.reduce((sum, d) => sum + (d.cost || 0), 0);
  const totalTokens = data.reduce((sum, d) => sum + (d.tokens_used || 0), 0);
  const uniqueUsers = new Set(data.map(d => d.user_id)).size;

  return {
    total: data.length,
    totalCost,
    totalTokens,
    uniqueUsers,
    avgCost: data.length > 0 ? totalCost / data.length : 0,
  };
}

async function getTopUsers(limit: number = 10) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('ai_generated_content')
    .select('user_id, cost, tokens_used')
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    console.error('Error fetching top users:', error);
    return [];
  }

  const userStats = data.reduce((acc: any, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = { generations: 0, cost: 0, tokens: 0 };
    }
    acc[item.user_id].generations++;
    acc[item.user_id].cost += item.cost || 0;
    acc[item.user_id].tokens += item.tokens_used || 0;
    return acc;
  }, {});

  return Object.entries(userStats)
    .map(([userId, stats]: [string, any]) => ({
      userId,
      ...stats,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, limit);
}

async function getContentTypeBreakdown() {
  const { data, error } = await supabase
    .from('ai_generated_content')
    .select('content_type, platform')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error('Error fetching content breakdown:', error);
    return {};
  }

  const breakdown: any = {};
  data.forEach(item => {
    const key = `${item.content_type} (${item.platform})`;
    breakdown[key] = (breakdown[key] || 0) + 1;
  });

  return Object.entries(breakdown)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10);
}

async function detectAnomalies() {
  const { data, error } = await supabase
    .from('ai_generated_content')
    .select('user_id, created_at')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error detecting anomalies:', error);
    return [];
  }

  const userCounts: any = {};
  data.forEach(item => {
    userCounts[item.user_id] = (userCounts[item.user_id] || 0) + 1;
  });

  const anomalies = Object.entries(userCounts)
    .filter(([, count]: any) => count > 50) // More than 50 generations today
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count);

  return anomalies;
}

async function displayDashboard() {
  console.clear();
  
  log('\n' + '='.repeat(80), colors.cyan);
  log('📊 FlowPost AI Usage Dashboard', colors.cyan);
  log('='.repeat(80) + '\n', colors.cyan);

  // Today's Stats
  log('📅 Today\'s Statistics', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  const todayStats = await getTodayStats();
  if (todayStats) {
    log(`Total Generations:     ${todayStats.total}`, colors.green);
    log(`  ✅ Successful:       ${todayStats.successful}`, colors.green);
    log(`  ❌ Failed:           ${todayStats.failed}`, todayStats.failed > 0 ? colors.red : colors.green);
    log(`Unique Users:          ${todayStats.uniqueUsers}`, colors.green);
    log(`Total Cost:            $${todayStats.totalCost.toFixed(2)}`, colors.yellow);
    log(`Total Tokens:          ${todayStats.totalTokens.toLocaleString()}`, colors.green);
    log(`Avg Cost/Generation:   $${todayStats.avgCost.toFixed(4)}`, colors.yellow);
    log(`Avg Tokens/Generation: ${Math.round(todayStats.avgTokens)}`, colors.green);
  }

  // Monthly Stats
  log('\n📆 This Month\'s Statistics', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  const monthlyStats = await getMonthlyStats();
  if (monthlyStats) {
    log(`Total Generations:     ${monthlyStats.total}`, colors.green);
    log(`Unique Users:          ${monthlyStats.uniqueUsers}`, colors.green);
    log(`Total Cost:            $${monthlyStats.totalCost.toFixed(2)}`, colors.yellow);
    log(`Total Tokens:          ${monthlyStats.totalTokens.toLocaleString()}`, colors.green);
    log(`Avg Cost/Generation:   $${monthlyStats.avgCost.toFixed(4)}`, colors.yellow);
    
    // Cost projections
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const projectedCost = (monthlyStats.totalCost / currentDay) * daysInMonth;
    
    log(`\n💰 Projected Month Cost: $${projectedCost.toFixed(2)}`, 
      projectedCost > 500 ? colors.red : projectedCost > 200 ? colors.yellow : colors.green);
  }

  // Top Users
  log('\n👥 Top 10 Users (This Month)', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  const topUsers = await getTopUsers(10);
  if (topUsers.length > 0) {
    topUsers.forEach((user, index) => {
      log(`${index + 1}. User ${user.userId.substring(0, 8)}... - ${user.generations} gens, $${user.cost.toFixed(2)}, ${user.tokens.toLocaleString()} tokens`, 
        colors.green);
    });
  } else {
    log('No data available', colors.yellow);
  }

  // Content Type Breakdown
  log('\n📝 Popular Content Types (Last 7 Days)', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  const contentBreakdown = await getContentTypeBreakdown();
  if (Object.keys(contentBreakdown).length > 0) {
    contentBreakdown.forEach(([type, count]: any, index) => {
      log(`${index + 1}. ${type}: ${count} generations`, colors.green);
    });
  } else {
    log('No data available', colors.yellow);
  }

  // Anomalies
  log('\n🚨 Usage Anomalies (Today)', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  const anomalies = await detectAnomalies();
  if (anomalies.length > 0) {
    log(`⚠️  ${anomalies.length} user(s) with unusual activity:`, colors.red);
    anomalies.forEach(anomaly => {
      log(`  - User ${anomaly.userId.substring(0, 8)}...: ${anomaly.count} generations today`, colors.yellow);
    });
  } else {
    log('✅ No anomalies detected', colors.green);
  }

  // Health Status
  log('\n💚 System Health', colors.blue);
  log('-'.repeat(80), colors.blue);
  
  if (todayStats) {
    const errorRate = todayStats.total > 0 ? (todayStats.failed / todayStats.total) * 100 : 0;
    const avgCost = todayStats.avgCost;
    
    log(`Error Rate:            ${errorRate.toFixed(2)}%`, 
      errorRate > 5 ? colors.red : errorRate > 1 ? colors.yellow : colors.green);
    log(`Avg Cost Status:       ${avgCost < 0.02 ? '✅ Optimal' : avgCost < 0.05 ? '⚠️  Acceptable' : '❌ High'}`,
      avgCost < 0.02 ? colors.green : avgCost < 0.05 ? colors.yellow : colors.red);
    log(`Daily Cost Status:     ${todayStats.totalCost < 50 ? '✅ Under Budget' : todayStats.totalCost < 100 ? '⚠️  Approaching Limit' : '❌ Over Budget'}`,
      todayStats.totalCost < 50 ? colors.green : todayStats.totalCost < 100 ? colors.yellow : colors.red);
  }

  log('\n' + '='.repeat(80), colors.cyan);
  log(`Last updated: ${new Date().toLocaleString()}`, colors.cyan);
  log('Press Ctrl+C to exit', colors.cyan);
  log('='.repeat(80) + '\n', colors.cyan);
}

async function monitorContinuously() {
  await displayDashboard();
  
  // Refresh every 30 seconds
  setInterval(async () => {
    await displayDashboard();
  }, 30000);
}

// Run monitoring
monitorContinuously().catch((err) => {
  console.error('❌ Monitoring error:', err);
  process.exit(1);
});
