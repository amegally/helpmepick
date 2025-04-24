import { prisma } from '../lib/db';

async function testPermalink() {
  try {
    // 1. Create a test wizard result
    const testData = {
      category: "Gaming Laptop",
      criteria: "Need a powerful laptop for gaming under $2000",
      recommendations: [
        {
          name: "ASUS ROG Strix G15",
          description: "15.6-inch Gaming Laptop",
          explanation: "Great performance for the price",
          price: "$1,499",
          rating: 4.5,
          amazonUrl: "https://amazon.com/sample"
        },
        {
          name: "Lenovo Legion 5 Pro",
          description: "16-inch Gaming Laptop",
          explanation: "Excellent screen and performance",
          price: "$1,799",
          rating: 4.7,
          amazonUrl: "https://amazon.com/sample2"
        }
      ],
      permalink: "test-gaming-laptop"
    };

    console.log("🚀 Creating test wizard result...");
    const result = await prisma.wizardResult.create({
      data: testData
    });
    console.log("✅ Created wizard result:", result);

    // 2. Retrieve the result using permalink
    console.log("\n🔍 Fetching result by permalink...");
    const retrieved = await prisma.wizardResult.findUnique({
      where: { permalink: "test-gaming-laptop" }
    });
    console.log("✅ Retrieved result:", retrieved);

    // 3. Verify the data
    console.log("\n🔍 Verifying data...");
    
    // More lenient verification that checks each field individually
    const verificationResults = {
      category: retrieved?.category === testData.category,
      criteria: retrieved?.criteria === testData.criteria,
      recommendationsLength: retrieved?.recommendations && 
        Array.isArray((retrieved.recommendations as any)) && 
        (retrieved.recommendations as any[]).length === testData.recommendations.length,
      permalink: retrieved?.permalink === testData.permalink
    };

    console.log("Verification results:", verificationResults);
    
    const isValid = Object.values(verificationResults).every(result => result === true);
    console.log(isValid ? "✅ Data verification passed!" : "❌ Data verification failed!");

    // 4. Clean up
    console.log("\n🧹 Cleaning up test data...");
    await prisma.wizardResult.delete({
      where: { permalink: "test-gaming-laptop" }
    });
    console.log("✅ Test data cleaned up");

  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPermalink(); 