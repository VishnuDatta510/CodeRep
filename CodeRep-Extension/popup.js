document.addEventListener("DOMContentLoaded", async () => {
  const elements = {
    loggedOut: document.getElementById("logged-out"),
    loggedIn: document.getElementById("logged-in"),
    headerStatus: document.getElementById("header-status"),
    apiTokenInput: document.getElementById("api-token"),
    saveTokenBtn: document.getElementById("save-token"),
    getTokenLink: document.getElementById("get-token-link"),
    logoutBtn: document.getElementById("logout-btn"),
    loadingState: document.getElementById("loading-state"),
    emptyState: document.getElementById("empty-state"),
    errorState: document.getElementById("error-state"),
    problemsList: document.getElementById("problems-list"),
    problemCount: document.getElementById("problem-count"),
    retryBtn: document.getElementById("retry-btn"),
    openDashboardBtn: document.getElementById("open-dashboard"),
    refreshBtn: document.getElementById("refresh-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    visitSite: document.getElementById("visit-site"),
  };

  let config = {
    token: null,
    baseUrl: "https://coderep.vercel.app",
  };

  /** Fetch with timeout to handle slow responses */
  async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please try again");
      }
      throw error;
    }
  }

  async function init() {
    const data = await chrome.storage.sync.get(["apiToken", "apiUrl"]);
    config.token = data.apiToken || null;
    config.baseUrl = data.apiUrl || "https://coderep.vercel.app";

    if (config.token) {
      showLoggedIn();
      await loadTodayProblems();
    } else {
      showLoggedOut();
    }
  }

  function showLoggedIn() {
    elements.loggedOut.style.display = "none";
    elements.loggedIn.style.display = "block";
    elements.headerStatus.style.display = "flex";
    elements.headerStatus.classList.add("connected");
    elements.headerStatus.classList.remove("disconnected");
  }

  function showLoggedOut() {
    elements.loggedOut.style.display = "block";
    elements.loggedIn.style.display = "none";
    elements.headerStatus.style.display = "none";
  }

  function showState(state) {
    elements.loadingState.style.display = "none";
    elements.emptyState.style.display = "none";
    elements.errorState.style.display = "none";
    elements.problemsList.style.display = "none";

    switch (state) {
      case "loading":
        elements.loadingState.style.display = "flex";
        break;
      case "empty":
        elements.emptyState.style.display = "flex";
        break;
      case "error":
        elements.errorState.style.display = "flex";
        break;
      case "list":
        elements.problemsList.style.display = "block";
        break;
    }
  }

  /** Fetches and displays today's due problems */
  async function loadTodayProblems() {
    showState("loading");

    try {
      const response = await fetchWithTimeout(
        `${config.baseUrl}/api/problems/today`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        },
        10000, // 10 second timeout
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);

        if (response.status === 401) {
          console.error("Token is invalid or expired. Please reconnect.");
        }

        throw new Error(`HTTP ${response.status}`);
      }

      const problems = await response.json();

      if (problems.length === 0) {
        elements.problemCount.textContent = "0";
        showState("empty");
      } else {
        elements.problemCount.textContent = problems.length;
        renderProblems(problems);
        showState("list");
      }
    } catch (error) {
      console.error("Error loading problems:", error);
      console.error("Config:", {
        baseUrl: config.baseUrl,
        hasToken: !!config.token,
      });
      elements.headerStatus.classList.remove("connected");
      elements.headerStatus.classList.add("disconnected");
      showState("error");
    }
  }

  /** Renders problem cards into the popup list */
  function renderProblems(problems) {
    elements.problemsList.innerHTML = "";

    problems.forEach((problem) => {
      const item = document.createElement("div");
      item.className = "problem-item";

      const difficultyClass = problem.difficulty.toLowerCase();

      item.innerHTML = `
        <div class="problem-content">
          <div class="problem-title">${escapeHtml(problem.title)}</div>
          <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
        </div>
        <div class="problem-actions">
          <button class="problem-btn open-problem" data-url="${escapeHtml(problem.url)}" data-id="${problem.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>Open</span>
          </button>
        </div>
      `;

      elements.problemsList.appendChild(item);
    });

    document.querySelectorAll(".open-problem").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const url = btn.dataset.url;
        const id = btn.dataset.id;
        await chrome.storage.local.set({ currentProblemId: id });
        chrome.runtime.sendMessage({ action: "openProblem", url });
      });
    });
  }

  function formatInterval(days) {
    if (days === 1) return "1 day interval";
    if (days < 7) return `${days} days interval`;
    if (days < 30) return `${Math.floor(days / 7)} weeks interval`;
    return `${Math.floor(days / 30)} months interval`;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  elements.saveTokenBtn.addEventListener("click", async () => {
    const token = elements.apiTokenInput.value.trim();

    if (!token) {
      elements.apiTokenInput.classList.add("error");
      elements.apiTokenInput.focus();
      return;
    }

    elements.saveTokenBtn.disabled = true;
    elements.saveTokenBtn.innerHTML = `
      <div class="loading-spinner" style="width: 16px; height: 16px; margin: 0; border-width: 2px;"></div>
      <span>Connecting...</span>
    `;

    try {
      // Validate token with timeout and retry
      const response = await fetchWithTimeout(
        `${config.baseUrl}/api/problems/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        10000, // 10 second timeout
      );

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      await chrome.storage.sync.set({ apiToken: token });
      config.token = token;

      showLoggedIn();
      await loadTodayProblems();
    } catch (error) {
      console.error("Token validation error:", error);
      elements.apiTokenInput.classList.add("error");
      elements.saveTokenBtn.innerHTML = `<span>Invalid Token - Try Again</span>`;

      setTimeout(() => {
        elements.saveTokenBtn.innerHTML = `<span>Connect Account</span>`;
        elements.saveTokenBtn.disabled = false;
      }, 2000);
    }
  });

  elements.apiTokenInput.addEventListener("input", () => {
    elements.apiTokenInput.classList.remove("error");
  });

  elements.getTokenLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: "openSettings" });
  });

  elements.openDashboardBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openDashboard" });
  });

  elements.refreshBtn.addEventListener("click", () => {
    loadTodayProblems();
  });

  elements.settingsBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openSettings" });
  });

  elements.retryBtn.addEventListener("click", () => {
    loadTodayProblems();
  });

  elements.logoutBtn.addEventListener("click", async () => {
    await chrome.storage.sync.remove("apiToken");
    config.token = null;
    elements.apiTokenInput.value = "";
    showLoggedOut();
  });

  elements.visitSite.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: "openHome" });
  });

  init();
});
