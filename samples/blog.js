const fs = require("fs");

(async () => {
  try {
    const data = await fetch("https://blog.inproved.com/wp-json/wp/v2/posts?per_page=100&page=2");
    const response = await data.json();
    const posts = response.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      date: post.date,
      slug: post.slug,
      link: post.link,
    }));
    fs.writeFileSync("blog2.json", JSON.stringify(posts, null, 2), "utf-8");
    console.log("Blog posts fetched and saved to blog.json");
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
})();
