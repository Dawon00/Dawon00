import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// 기존 README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

// 최신 블로그 포스트 추가하는 함수
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://dawonny.tistory.com/rss");

  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = "\n### Latest Blog Posts\n\n";
  for (let i = 0; i < 5 && i < feed.items.length; i++) {
    const { title, link } = feed.items[i];
    latestPosts += `- [${title}](${link})\n`;
  }

  // 기존 README.md에 최신 블로그 포스트 추가
  if (readmeContent.includes("### Latest Blog Posts")) {
    readmeContent = readmeContent.replace(
      /### Latest Blog Posts[\s\S]*?(?=\n\n## |\n$)/,
      latestPosts
    );
  } else {
    readmeContent += latestPosts;
  }

  // README.md 파일 작성
  writeFileSync(readmePath, readmeContent, "utf8", (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("README.md 업데이트 완료");
    }
  });
})();
