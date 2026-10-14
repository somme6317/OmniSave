document.addEventListener("DOMContentLoaded", () => {
const downloadForm = document.getElementById("downloadForm");
const videoUrlInput = document.getElementById("videoUrl");
const pasteBtn = document.getElementById("pasteBtn");
const statusSection = document.getElementById("statusSection");
const statusTitle = document.getElementById("statusTitle");
const statusDesc = document.getElementById("statusDesc");
const progressBar = document.getElementById("progressBar");
const resultSection = document.getElementById("resultSection");
const resultTitle = document.getElementById("resultTitle");
const resultThumb = document.getElementById("resultThumb");
const thumbPlaceholder =
document.getElementById("thumbPlaceholder");
const platformBadge = document.getElementById("platformBadge");
const downloadHDLink = document.getElementById("downloadHDLink");
const downloadAudioLink =
document.getElementById("downloadAudioLink");
const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
let history = JSON.parse(localStorage.getItem("downloader_history") || "[]");

(async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      videoUrlInput.value = text;
    }
  } catch (err) {
    alert("Clipboard access denied. Please paste the link manually.");
  }
})();

});

// Link Processing Logic
function processLink(url) {
  const platform = detectPlatform(url);
  resultSection.classList.add("hidden");
  statusSection.classList.remove("hidden");
  progressBar.style.width = "10%";
  statusTitle.textContent = `Connecting to ${platform.name}...`;
  statusDesc.textContent = "Stripping watermark and generating clean video output...";

  let progress = 10;
  const interval = setInterval(() => {
    progress += 20;
    progressBar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        statusSection.classList.add("hidden");
        displayResult(url, platform);
      }, 400);
    }
  }, 300);
}

// Detect Platform from URL
function detectPlatform(url) {
  const lower = url.toLowerCase();

  if (lower.includes("tiktok.com")) return { name: "TikTok", icon: "fa-brands fa-tiktok", color: "#ff0050" };
  if (lower.includes("snapchat.com")) return { name: "Snapchat", icon: "fa-brands fa-snapchat", color: "#fffc00" };
  if (lower.includes("instagram.com")) return { name: "Instagram", icon: "fa-brands fa-instagram", color: "#e1306c" };
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return { name: "YouTube", icon: "fa-brands fa-youtube", color: "#ff0000" };
  if (lower.includes("facebook.com") || lower.includes("fb.watch")) return { name: "Facebook", icon: "fa-brands fa-facebook", color: "#1877f2" };
  if (lower.includes("twitter.com") || lower.includes("x.com")) return { name: "Twitter / X", icon: "fa-brands fa-x-twitter", color: "#ffffff" };

  return { name: "Universal", icon: "fa-solid fa-globe", color: "#dc143c" };
}

function displayResult(url, platform) {
  platformBadge.textContent = platform.name;
  resultTitle.textContent = `${platform.name} Video (Watermark-Free HD)`;

  // Demo download links
  downloadHDLink.href = url;
  downloadAudioLink.href = url;

  // Save to history
  const item = {
    id: Date.now(),
    title: `${platform.name} Video`,
    url: url,
    platform: platform.name,
    icon: platform.icon,
    date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  history.unshift(item);
  if (history.length > 5) history.pop();
  localStorage.setItem("downloader_history", JSON.stringify(history));
  renderHistory();
}

// Render History Items
function renderHistory() {
  if (history.length === 0) {
    emptyHistory.classList.remove("hidden");
    clearHistoryBtn.classList.add("hidden");
    historyList.innerHTML = "";
    historyList.appendChild(emptyHistory);
    return;
  }

  emptyHistory.classList.add("hidden");
  clearHistoryBtn.classList.remove("hidden");
  historyList.innerHTML = "";
  history.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "bg-gray-800/60 border border-gray-700/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs";
    div.innerHTML = `
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 shrink-0">
          <i class="${item.icon}"></i>
        </div>
        <div class="truncate">
          <div class="font-medium text-white truncate">${item.title}</div>
          <div class="text-gray-500 text-[10px] truncate">${item.url}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[10px] text-gray-500">${item.date}</span>
        <a href="${item.url}" target="_blank" class="px-2.5 py-1.5 bg-gray-700 hover:bg-crimson text-white rounded-md transition-colors">
          <i class="fa-solid fa-download"></i>
        </a>
      </div>
    `;
    historyList.appendChild(div);
  });
}
// Clear History
clearHistoryBtn.addEventListener("click", () => {
history = [];
localStorage.removeItem("downloader_history");
renderHistory();
});


