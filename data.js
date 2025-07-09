import fs from "fs";
import cheerio from "cheerio";

function loadExistingBlogs() {  
  if (fs.existsSync("data.json")) {
    const data = fs.readFileSync("data.json", "utf-8");
    return JSON.parse(data);
  }
  return [];
}

/**
 * Extract title, links, images, and text using only Cheerio
 * @param {string} html
 * @returns {{ title: string, links: string[], images: string[], text: string }}
 */
function converto(html) {
  const $ = cheerio.load(html);

  const title = $("title").text() || null;

  const links = [];
  $("a[href]").each((_, el) => {
    links.push($(el).attr("href"));
  });

  const images = [];
  $("img[src]").each((_, el) => {
    images.push($(el).attr("src"));
  });

  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();

  return { title, links, images, text };
}

export async function fetchAllPages() {
  let existingBlogs = loadExistingBlogs();
  const existingIds = new Set(existingBlogs.map((b) => b.id));

  let page = 1;
  let newBlogsTotal = 0;

  while (true) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`https://blog.inproved.com/wp-json/wp/v2/posts?per_page=100&page=${page}`);
    const posts = await res.json();

    // If no posts, we are done
    if (!Array.isArray(posts) || posts.length === 0) {
      console.log("No more posts found.");
      break;
    }

    let newBlogsThisPage = [];

    for (const post of posts) {
      if (existingIds.has(post.id)) continue;

      // Add new blogs to the list
      const { title, links, images, text } = converto(post.content.rendered);
      newBlogsThisPage.push({
        id: post.id,
        title: post.title.rendered,
        date: post.date,
        slug: post.slug,
        link: post.link,
        content: {
          title,
          links,
          images,
          text,
        },
      });

      existingIds.add(post.id); // add to set to prevent future duplicates
    }

    if (newBlogsThisPage.length === 0) {
      console.log("All posts on this page already exist. Skipping...");
      break;
    }

    existingBlogs = [...existingBlogs, ...newBlogsThisPage];
    newBlogsTotal += newBlogsThisPage.length;
    console.log(`Added ${newBlogsThisPage.length} new blogs from page ${page}.`);

    page++;
  }

  fs.writeFileSync("data.json", JSON.stringify(existingBlogs, null, 2), "utf-8");
  console.log(`✅ Finished. Total new blogs added: ${newBlogsTotal}`);
}

fetchAllPages();