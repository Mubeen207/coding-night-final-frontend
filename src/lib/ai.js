export const processWithAI = (description) => {
  const text = description.toLowerCase();
  
  // Category Detection
  let category = "Community";
  if (text.includes("react") || text.includes("javascript") || text.includes("html") || text.includes("css") || text.includes("bug")) {
    category = "Web Development";
  } else if (text.includes("figma") || text.includes("design") || text.includes("ui") || text.includes("ux")) {
    category = "Design";
  } else if (text.includes("resume") || text.includes("interview") || text.includes("career")) {
    category = "Career";
  }

  // Urgency Detection
  let urgency = "Low";
  if (text.includes("urgent") || text.includes("asap") || text.includes("deadline") || text.includes("tomorrow") || text.includes("stuck")) {
    urgency = "High";
  } else if (text.includes("soon") || text.includes("help") || text.includes("review")) {
    urgency = "Medium";
  }

  // Tag Extraction
  const allKeywords = ["javascript", "react", "html", "css", "figma", "node", "python", "interview", "debugging", "portfolio", "resume", "design", "tailwind"];
  const suggestedTags = [];
  allKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      // capitalize first letter
      suggestedTags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });

  return { category, urgency, tags: suggestedTags };
};
