import { categorySchema, criteriaSchema } from '../lib/validation/schemas';
import { logger } from '../lib/utils/logger';

async function testValidation() {
  console.log('\n🔍 Testing Input Validation:');
  
  // Test 1: Valid category input
  try {
    const validCategory = { category: 'laptop' };
    const result = categorySchema.parse(validCategory);
    console.log('✅ Valid category passed:', result);
  } catch (error) {
    console.error('❌ Valid category failed:', error);
  }

  // Test 2: Too long category input
  try {
    const longCategory = { 
      category: 'a'.repeat(201) // Exceeds MAX_CATEGORY_LENGTH
    };
    categorySchema.parse(longCategory);
    console.error('❌ Long category validation failed to catch overflow');
  } catch (error) {
    console.log('✅ Long category correctly rejected');
  }

  // Test 3: Valid criteria input
  try {
    const validCriteria = { criteria: 'I need a laptop for gaming' };
    const result = criteriaSchema.parse(validCriteria);
    console.log('✅ Valid criteria passed:', result);
  } catch (error) {
    console.error('❌ Valid criteria failed:', error);
  }

  // Test 4: Too long criteria input
  try {
    const longCriteria = { 
      criteria: 'a'.repeat(501) // Exceeds MAX_CRITERIA_LENGTH
    };
    criteriaSchema.parse(longCriteria);
    console.error('❌ Long criteria validation failed to catch overflow');
  } catch (error) {
    console.log('✅ Long criteria correctly rejected');
  }
}

async function testLogger() {
  console.log('\n🔍 Testing Secure Logger:');

  // Test 1: Regular error logging
  logger.error('Test error message');
  
  // Test 2: Error with sensitive data
  const sensitiveError = new Error('Error with API_KEY=abc123');
  logger.error('Test error with sensitive data', sensitiveError);

  // Test 3: Info logging (should only show in development)
  logger.info('Test info message', { 
    sensitiveData: 'API_KEY=abc123',
    normalData: 'test'
  });

  // Test 4: Debug logging (should only show in development)
  logger.debug('Test debug message', {
    sensitiveData: 'SECRET_KEY=xyz789',
    normalData: 'test'
  });
}

async function runTests() {
  console.log('🚀 Starting Security Tests...');
  
  await testValidation();
  await testLogger();
  
  console.log('\n✨ Security Tests Complete!');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 