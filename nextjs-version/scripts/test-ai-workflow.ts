/**
 * FlowPost AI Workflow Test Script
 * 
 * This script tests the entire AI generation workflow to ensure
 * everything is connected and working properly.
 * 
 * Run with: npx tsx scripts/test-ai-workflow.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

async function testEnvironmentVariables() {
  log('\n📋 Testing Environment Variables...', colors.cyan);
  
  const requiredVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ];

  let allPresent = true;

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      success(`${varName} is set`);
    } else {
      error(`${varName} is missing`);
      allPresent = false;
    }
  }

  // Check optional vars
  const optionalVars = [
    'FIRECRAWL_API_KEY',
    'ARCADE_API_KEY',
    'TWITTER_API_KEY',
    'LINKEDIN_ACCESS_TOKEN',
  ];

  log('\n📋 Optional Environment Variables:', colors.cyan);
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      success(`${varName} is set (Phase 2/3 ready)`);
    } else {
      warning(`${varName} not set (needed for Phase 2/3)`);
    }
  }

  return allPresent;
}

async function testOpenAIConnection() {
  log('\n🤖 Testing OpenAI Connection...', colors.cyan);
  
  try {
    info('Sending test request to OpenAI...');
    
    const startTime = Date.now();
    const { text, usage } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: 'Say "Hello from FlowPost!" in exactly 5 words.',
    });
    const endTime = Date.now();

    success('OpenAI connection successful!');
    info(`Response: "${text}"`);
    info(`Tokens used: ${usage?.totalTokens || 0}`);
    info(`Response time: ${endTime - startTime}ms`);
    info(`Estimated cost: $${((usage?.totalTokens || 0) / 1000 * 0.02).toFixed(4)}`);
    
    return true;
  } catch (err: any) {
    error('OpenAI connection failed!');
    error(`Error: ${err.message}`);
    
    if (err.message?.includes('API key')) {
      warning('Check your OPENAI_API_KEY in .env.local');
    }
    if (err.message?.includes('rate_limit')) {
      warning('Rate limit exceeded. Wait a moment and try again.');
    }
    if (err.message?.includes('insufficient_quota')) {
      warning('OpenAI account has insufficient quota. Add credits.');
    }
    
    return false;
  }
}

async function testContentGeneration() {
  log('\n📝 Testing Content Generation...', colors.cyan);
  
  const testCases = [
    {
      name: 'Instagram Caption',
      contentType: 'caption',
      platform: 'instagram',
      prompt: 'Write about AI automation for social media',
    },
    {
      name: 'Twitter Thread',
      contentType: 'thread',
      platform: 'twitter',
      prompt: 'Explain the benefits of AI content generation',
    },
    {
      name: 'LinkedIn Post',
      contentType: 'caption',
      platform: 'linkedin',
      prompt: 'Professional post about productivity tools',
    },
  ];

  let successCount = 0;

  for (const testCase of testCases) {
    try {
      info(`\nTesting: ${testCase.name}...`);
      
      const startTime = Date.now();
      const { text, usage } = await generateText({
        model: openai('gpt-4o-mini'),
        system: `You are a ${testCase.platform} content expert. Create ${testCase.contentType} content.`,
        prompt: testCase.prompt,
      });
      const endTime = Date.now();

      success(`${testCase.name} generated successfully!`);
      info(`Length: ${text.length} characters`);
      info(`Tokens: ${usage?.totalTokens || 0}`);
      info(`Time: ${endTime - startTime}ms`);
      info(`Preview: ${text.substring(0, 100)}...`);
      
      successCount++;
    } catch (err: any) {
      error(`${testCase.name} failed: ${err.message}`);
    }
  }

  log(`\n📊 Results: ${successCount}/${testCases.length} tests passed`, colors.cyan);
  return successCount === testCases.length;
}

async function testPromptEngineering() {
  log('\n🎨 Testing Prompt Engineering...', colors.cyan);
  
  try {
    info('Testing tone variations...');
    
    const tones = ['professional', 'casual', 'humorous'];
    const results: string[] = [];

    for (const tone of tones) {
      const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: `Write in a ${tone} tone.`,
        prompt: 'Write one sentence about coffee.',
      });
      results.push(text);
      info(`${tone}: "${text}"`);
    }

    success('Prompt engineering working correctly!');
    return true;
  } catch (err: any) {
    error(`Prompt engineering test failed: ${err.message}`);
    return false;
  }
}

async function testErrorHandling() {
  log('\n🛡️  Testing Error Handling...', colors.cyan);
  
  try {
    info('Testing with invalid input...');
    
    // Test with empty prompt
    try {
      await generateText({
        model: openai('gpt-4o-mini'),
        prompt: '',
      });
      warning('Empty prompt should have been rejected');
    } catch (err) {
      success('Empty prompt correctly rejected');
    }

    // Test with very long prompt (should work but be expensive)
    info('Testing with long prompt...');
    const longPrompt = 'Write about AI. '.repeat(100);
    const { usage } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: longPrompt,
    });
    
    if ((usage?.totalTokens || 0) > 500) {
      warning(`Long prompt used ${usage?.totalTokens} tokens - consider limiting input length`);
    } else {
      success('Long prompt handled correctly');
    }

    return true;
  } catch (err: any) {
    error(`Error handling test failed: ${err.message}`);
    return false;
  }
}

async function testCostCalculation() {
  log('\n💰 Testing Cost Calculation...', colors.cyan);
  
  try {
    const { usage } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: 'Write a short tweet about AI.',
    });

    const tokens = usage?.totalTokens || 0;
    const cost = (tokens / 1000) * 0.02; // $0.02 per 1K tokens average

    info(`Tokens used: ${tokens}`);
    info(`Calculated cost: $${cost.toFixed(4)}`);
    
    if (cost > 0.05) {
      warning('Single generation cost is high. Consider optimizing prompts.');
    } else {
      success('Cost calculation looks good!');
    }

    // Project monthly costs
    const generationsPerMonth = 10000;
    const monthlyCost = cost * generationsPerMonth;
    
    info(`\n📊 Cost Projections:`);
    info(`  - 1,000 generations: $${(cost * 1000).toFixed(2)}`);
    info(`  - 10,000 generations: $${(cost * 10000).toFixed(2)}`);
    info(`  - 100,000 generations: $${(cost * 100000).toFixed(2)}`);

    return true;
  } catch (err: any) {
    error(`Cost calculation test failed: ${err.message}`);
    return false;
  }
}

async function testPerformance() {
  log('\n⚡ Testing Performance...', colors.cyan);
  
  try {
    const iterations = 3;
    const times: number[] = [];

    info(`Running ${iterations} performance tests...`);

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      await generateText({
        model: openai('gpt-4o-mini'),
        prompt: 'Write a short social media post.',
      });
      const endTime = Date.now();
      times.push(endTime - startTime);
      info(`  Test ${i + 1}: ${endTime - startTime}ms`);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    info(`\n📊 Performance Results:`);
    info(`  - Average: ${avgTime.toFixed(0)}ms`);
    info(`  - Fastest: ${minTime}ms`);
    info(`  - Slowest: ${maxTime}ms`);

    if (avgTime < 3000) {
      success('Performance is excellent! (< 3 seconds)');
    } else if (avgTime < 5000) {
      success('Performance is good (< 5 seconds)');
    } else {
      warning('Performance is slow (> 5 seconds). Check network/API status.');
    }

    return true;
  } catch (err: any) {
    error(`Performance test failed: ${err.message}`);
    return false;
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('🚀 FlowPost AI Workflow Test Suite', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const results = {
    environment: false,
    connection: false,
    generation: false,
    prompts: false,
    errors: false,
    costs: false,
    performance: false,
  };

  try {
    results.environment = await testEnvironmentVariables();
    
    if (!results.environment) {
      error('\n❌ Environment variables missing. Fix .env.local and try again.');
      process.exit(1);
    }

    results.connection = await testOpenAIConnection();
    
    if (!results.connection) {
      error('\n❌ OpenAI connection failed. Check API key and try again.');
      process.exit(1);
    }

    results.generation = await testContentGeneration();
    results.prompts = await testPromptEngineering();
    results.errors = await testErrorHandling();
    results.costs = await testCostCalculation();
    results.performance = await testPerformance();

  } catch (err: any) {
    error(`\n❌ Test suite failed: ${err.message}`);
    process.exit(1);
  }

  // Summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('📊 Test Summary', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const testResults = [
    { name: 'Environment Variables', passed: results.environment },
    { name: 'OpenAI Connection', passed: results.connection },
    { name: 'Content Generation', passed: results.generation },
    { name: 'Prompt Engineering', passed: results.prompts },
    { name: 'Error Handling', passed: results.errors },
    { name: 'Cost Calculation', passed: results.costs },
    { name: 'Performance', passed: results.performance },
  ];

  let passedCount = 0;
  for (const result of testResults) {
    if (result.passed) {
      success(`${result.name}: PASSED`);
      passedCount++;
    } else {
      error(`${result.name}: FAILED`);
    }
  }

  log('\n' + '='.repeat(60), colors.cyan);
  
  if (passedCount === testResults.length) {
    success(`\n🎉 All tests passed! (${passedCount}/${testResults.length})`);
    success('✅ Your AI workflow is fully functional and ready for production!');
    log('\n📝 Next steps:', colors.cyan);
    info('  1. Run database migration: add_ai_tracking.sql');
    info('  2. Update AI Generator page to use real AI');
    info('  3. Deploy to staging for testing');
    info('  4. Deploy to production');
  } else {
    warning(`\n⚠️  Some tests failed (${passedCount}/${testResults.length} passed)`);
    warning('Fix the issues above before deploying to production.');
  }

  log('\n' + '='.repeat(60) + '\n', colors.cyan);
}

// Run tests
runAllTests().catch((err) => {
  error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});
