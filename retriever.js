import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import "dotenv/config";
import fs from "fs";

// Load existing blogs
const raw = fs.readFileSync("data.json", "utf-8");
const data = JSON.parse(raw);

// If no data found, exit
if (!data || data.length === 0) {
  console.error("No data found in data.json");
  process.exit(1);
}

// Convert data to Document format
const docsList = data.map((item) => {
  return new Document({
    pageContent: item.content.text,
    metadata: {
      title: item.title,
      links: item.links,
      images: item.images,
      id: item.id,
    },
  });
});

// Create a text splitter to chunk the documents
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

// Split the documents into smaller chunks
const docSplits = await textSplitter.splitDocuments(docsList);

// Add to vectorDB
const vectorStore = await MemoryVectorStore.fromDocuments(
  docSplits,
  new OpenAIEmbeddings(),
);

// Create a retriever to query the vector store
const retriever = vectorStore.asRetriever();
retriever.k = 6; // Set the number of results to return

// Export the retriever for use in other parts of the application
export { retriever };

// Example query to test the retriever
// const userQuery = "Tell me how gold price is determined?";
// const top5 = await retriever.getRelevantDocuments(userQuery);

// top5.forEach((doc, i) => {
//   console.log(`Result ${i + 1}: ${doc.pageContent}`);
// });

// Example output for testing
// Result 1: providing an added layer of credibility. If you wanted to check the latest rates of the gold in the market and invest in 99.99% pure gold, click on the button below to reach out to our team of professionals in the precious metals industry and they will guide you through the whole process. Want to know more?Talk to your consultants to pick their brains about Gold Prices.Learn More Most Recent Posts All PostBlogFund ManagementIn Depth AnalyticsTopicsUncategorized BackTax BenefitsCompany
// Result 2: $2,100 an ounce depends on a complex interplay of factors. While the current drivers may support high prices in the short term, any significant economic recovery or shift in monetary policy could affect gold’s appeal. Moreover, advancements in gold mining technology and recycling could impact supply dynamics, influencing prices. Investor behavior will also play a critical role. If gold continues to provide strong returns, it will likely attract more investment, supporting higher prices.
// Result 3: investment and take advantage of varying market conditions. 2. Timing and Purchase Details Alex purchases gold bullion bars in three stages: First Purchase: January 2024 – 3 kilograms at $1,900 per ounce Second Purchase: April 2024 – 4 kilograms at $1,850 per ounce Third Purchase: July 2024 – 3 kilograms at $1,800 per ounce By staggering these purchases, Alex averages out the cost of gold, mitigating the risk associated with buying a large amount at a single price point. 3. Calculating the
// Result 4: interest reflects all these dynamics, rolled into one glittering narrative. As traders position themselves in gold futures, one thing becomes clear: in a world of shifting sands, gold remains the ultimate anchor. Want to know more?Talk to your consultants to pick their brains about Gold Prices.Learn More InProved makes it easy to procure and hold gold and silver bullion products in a tax-efficient manner. Ready to explore? Start an account Most Recent Posts All PostBlogFund ManagementIn Depth
// Result 5: the gold accumulated. 2. Calculating the Average Purchase PriceTo determine the average price per gram of gold accumulated, Jordan calculated the weighted average cost based on the amounts and prices of each purchase: Total Gold Purchased: 100g + 200g + 300g = 600 gramsTotal Cost of Gold Purchased: $6,500 + $12,000 + $17,400 = $35,900 The average cost per gram is calculated as follows: Average Cost per Gram: $35,900 / 600 grams = $59.83 3. Calculating the Average Purchase PriceBy August 2024,
// Result 6: on the button below to reach out to our team of professionals in the precious metals industry and they will guide you through the whole process. Want to know more?Talk to your consultants to pick their brains about Gold Prices.Learn More Most Recent Posts All PostBlogFund ManagementIn Depth AnalyticsTopicsUncategorized BackTax BenefitsCompany DetailsGoldDirectorsBeneficiariesFinancial AccountsDigital ServicesPromotionsGold and Bitcoin: A Comparative AnalysisWhere do Jewelers Buy Gold?Why Gold