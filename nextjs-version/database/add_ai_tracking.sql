-- ============================================================================
-- FlowPost AI Agent Tracking & Analytics System
-- Advanced AI tracking with comprehensive monitoring and analytics
-- ============================================================================

-- Add token tracking columns to ai_generated_content table
ALTER TABLE ai_generated_content
ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 6) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS model_used VARCHAR(100) DEFAULT 'gpt-4-turbo-preview',
ADD COLUMN IF NOT EXISTS generation_time_ms INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'success';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_content_cost ON ai_generated_content(user_id, created_at, cost);
CREATE INDEX IF NOT EXISTS idx_ai_content_status ON ai_generated_content(status, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_content_model ON ai_generated_content(model_used, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_content_platform ON ai_generated_content(platform, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_content_type ON ai_generated_content(content_type, created_at);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View 1: Monthly AI usage and costs per user
CREATE OR REPLACE VIEW user_monthly_ai_usage AS
SELECT 
  user_id,
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as generations_count,
  COUNT(*) FILTER (WHERE status = 'success') as successful_generations,
  COUNT(*) FILTER (WHERE status = 'error') as failed_generations,
  SUM(tokens_used) as total_tokens,
  SUM(cost) as total_cost,
  AVG(generation_time_ms) as avg_generation_time_ms,
  AVG(tokens_used) as avg_tokens_per_generation,
  AVG(cost) as avg_cost_per_generation
FROM ai_generated_content
GROUP BY user_id, DATE_TRUNC('month', created_at);

COMMENT ON VIEW user_monthly_ai_usage IS 'Monthly AI usage statistics per user including generation count, tokens used, total cost, and performance metrics';

-- View 2: Daily AI usage across all users
CREATE OR REPLACE VIEW daily_ai_usage AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_generations,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(tokens_used) as total_tokens,
  SUM(cost) as total_cost,
  AVG(generation_time_ms) as avg_generation_time_ms,
  COUNT(*) FILTER (WHERE status = 'success') as successful_generations,
  COUNT(*) FILTER (WHERE status = 'error') as failed_generations,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / NULLIF(COUNT(*), 0), 2) as success_rate_percent
FROM ai_generated_content
GROUP BY DATE(created_at)
ORDER BY date DESC;

COMMENT ON VIEW daily_ai_usage IS 'Daily AI usage statistics across all users for monitoring and cost tracking';

-- View 3: Content type popularity
CREATE OR REPLACE VIEW content_type_analytics AS
SELECT 
  content_type,
  platform,
  COUNT(*) as generation_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(tokens_used) as avg_tokens,
  AVG(cost) as avg_cost,
  AVG(generation_time_ms) as avg_time_ms,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / NULLIF(COUNT(*), 0), 2) as success_rate_percent
FROM ai_generated_content
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY content_type, platform
ORDER BY generation_count DESC;

COMMENT ON VIEW content_type_analytics IS 'Analytics on which content types and platforms are most popular';

-- View 4: User AI performance metrics
CREATE OR REPLACE VIEW user_ai_performance AS
SELECT 
  user_id,
  COUNT(*) as total_generations,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as generations_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as generations_last_30_days,
  SUM(cost) as total_cost_all_time,
  SUM(cost) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as cost_last_30_days,
  AVG(generation_time_ms) as avg_generation_time_ms,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / NULLIF(COUNT(*), 0), 2) as success_rate_percent,
  MAX(created_at) as last_generation_at
FROM ai_generated_content
GROUP BY user_id;

COMMENT ON VIEW user_ai_performance IS 'Per-user AI performance metrics for identifying power users and issues';

-- View 5: Model usage and performance comparison
CREATE OR REPLACE VIEW model_performance_comparison AS
SELECT 
  model_used,
  COUNT(*) as usage_count,
  AVG(tokens_used) as avg_tokens,
  AVG(cost) as avg_cost,
  AVG(generation_time_ms) as avg_time_ms,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / NULLIF(COUNT(*), 0), 2) as success_rate_percent,
  SUM(cost) as total_cost
FROM ai_generated_content
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY model_used
ORDER BY usage_count DESC;

COMMENT ON VIEW model_performance_comparison IS 'Compare performance and costs across different AI models';

-- ============================================================================
-- FUNCTIONS FOR ADVANCED ANALYTICS
-- ============================================================================

-- Function 1: Get user's remaining AI generations for current month
CREATE OR REPLACE FUNCTION get_user_remaining_generations(p_user_id TEXT, p_plan_limit INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_used INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_used
  FROM ai_generated_content
  WHERE user_id = p_user_id
    AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND status = 'success';
  
  IF p_plan_limit = -1 THEN
    RETURN -1; -- Unlimited
  ELSE
    RETURN GREATEST(0, p_plan_limit - v_used);
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_remaining_generations IS 'Calculate remaining AI generations for a user based on their plan limit';

-- Function 2: Get cost breakdown by time period
CREATE OR REPLACE FUNCTION get_cost_breakdown(
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  period DATE,
  total_cost DECIMAL,
  total_generations BIGINT,
  avg_cost_per_generation DECIMAL,
  unique_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as period,
    SUM(ai_generated_content.cost)::DECIMAL as total_cost,
    COUNT(*)::BIGINT as total_generations,
    AVG(ai_generated_content.cost)::DECIMAL as avg_cost_per_generation,
    COUNT(DISTINCT user_id)::BIGINT as unique_users
  FROM ai_generated_content
  WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date
  GROUP BY DATE(created_at)
  ORDER BY period DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_cost_breakdown IS 'Get detailed cost breakdown for a date range';

-- Function 3: Detect anomalous usage patterns
CREATE OR REPLACE FUNCTION detect_usage_anomalies()
RETURNS TABLE (
  user_id TEXT,
  generations_today BIGINT,
  avg_daily_generations NUMERIC,
  anomaly_score NUMERIC,
  alert_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      ai_generated_content.user_id,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_count,
      AVG(daily_counts.count) as avg_daily
    FROM ai_generated_content
    LEFT JOIN (
      SELECT 
        user_id,
        DATE(created_at) as date,
        COUNT(*) as count
      FROM ai_generated_content
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND created_at < CURRENT_DATE
      GROUP BY user_id, DATE(created_at)
    ) daily_counts ON ai_generated_content.user_id = daily_counts.user_id
    WHERE ai_generated_content.created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY ai_generated_content.user_id
  )
  SELECT 
    user_stats.user_id,
    today_count::BIGINT as generations_today,
    ROUND(avg_daily, 2) as avg_daily_generations,
    ROUND(today_count / NULLIF(avg_daily, 0), 2) as anomaly_score,
    CASE 
      WHEN today_count > avg_daily * 5 THEN 'CRITICAL'
      WHEN today_count > avg_daily * 3 THEN 'HIGH'
      WHEN today_count > avg_daily * 2 THEN 'MEDIUM'
      ELSE 'NORMAL'
    END as alert_level
  FROM user_stats
  WHERE today_count > 0
    AND avg_daily > 0
    AND today_count > avg_daily * 2
  ORDER BY anomaly_score DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION detect_usage_anomalies IS 'Detect users with anomalous usage patterns that may indicate abuse or issues';

-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE (Optional - for high traffic)
-- ============================================================================

-- Materialized view for hourly statistics (refresh every hour)
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_ai_stats AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as generation_count,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(tokens_used) as total_tokens,
  SUM(cost) as total_cost,
  AVG(generation_time_ms) as avg_time_ms,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / NULLIF(COUNT(*), 0), 2) as success_rate
FROM ai_generated_content
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_hourly_stats_hour ON hourly_ai_stats(hour);

COMMENT ON MATERIALIZED VIEW hourly_ai_stats IS 'Hourly AI usage statistics for real-time monitoring dashboards';

-- ============================================================================
-- TRIGGERS FOR REAL-TIME MONITORING
-- ============================================================================

-- Trigger function to log high-cost generations
CREATE OR REPLACE FUNCTION log_high_cost_generation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.cost > 0.05 THEN -- Alert if single generation costs more than $0.05
    RAISE NOTICE 'High cost generation detected: User %, Cost $%, Tokens %', 
      NEW.user_id, NEW.cost, NEW.tokens_used;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_high_cost_alert
  AFTER INSERT ON ai_generated_content
  FOR EACH ROW
  EXECUTE FUNCTION log_high_cost_generation();

COMMENT ON TRIGGER trigger_high_cost_alert ON ai_generated_content IS 'Alert when a single generation has unusually high cost';

-- ============================================================================
-- UTILITY QUERIES (Save these for monitoring)
-- ============================================================================

-- Query 1: Today's costs and usage
-- SELECT * FROM daily_ai_usage WHERE date = CURRENT_DATE;

-- Query 2: Top 10 users by cost this month
-- SELECT user_id, total_cost, generations_count 
-- FROM user_monthly_ai_usage 
-- WHERE month = DATE_TRUNC('month', CURRENT_DATE)
-- ORDER BY total_cost DESC LIMIT 10;

-- Query 3: Check for usage anomalies
-- SELECT * FROM detect_usage_anomalies();

-- Query 4: Get cost breakdown for last 7 days
-- SELECT * FROM get_cost_breakdown(CURRENT_DATE - 7, CURRENT_DATE);

-- Query 5: Most popular content types
-- SELECT * FROM content_type_analytics LIMIT 10;

-- Query 6: Model performance comparison
-- SELECT * FROM model_performance_comparison;

-- Query 7: User performance metrics
-- SELECT * FROM user_ai_performance ORDER BY total_generations DESC LIMIT 20;

-- ============================================================================
-- REFRESH MATERIALIZED VIEWS (Run this hourly via cron)
-- ============================================================================

-- REFRESH MATERIALIZED VIEW hourly_ai_stats;

-- ============================================================================
-- CLEANUP OLD DATA (Optional - run monthly)
-- ============================================================================

-- Delete AI generations older than 6 months (keep for compliance/analytics)
-- DELETE FROM ai_generated_content WHERE created_at < CURRENT_DATE - INTERVAL '6 months';

COMMENT ON TABLE ai_generated_content IS 'Stores all AI-generated content with comprehensive tracking for usage, costs, and performance monitoring';

-- ============================================================================
-- GRANT PERMISSIONS (Adjust based on your security model)
-- ============================================================================

-- Grant read access to analytics views for reporting tools
-- GRANT SELECT ON user_monthly_ai_usage TO analytics_role;
-- GRANT SELECT ON daily_ai_usage TO analytics_role;
-- GRANT SELECT ON content_type_analytics TO analytics_role;

-- ============================================================================
-- END OF AI TRACKING SCHEMA
-- ============================================================================
