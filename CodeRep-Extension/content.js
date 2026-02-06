(function () {
  "use strict";

  const CONFIG = {
    retryDelay: 1000,
    maxRetries: 10,
    toastDuration: 5000,
  };

  let retryCount = 0;
  let ratedProblems = new Set();
  let currentSubmissionUrl = null;

  /** Extracts problem title, URL, and difficulty from the LeetCode page */
  function extractProblemDetails() {
    const url = window.location.href.split("?")[0];

    let title = "";
    const titleSelectors = [
      '[data-cy="question-title"]',
      'div[class*="text-title-large"]',
      'div[class*="text-lg"] a',
      'a[href*="/problems/"]',
    ];

    for (const selector of titleSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        title = el.textContent.trim();
        title = title.replace(/^\d+\.\s*/, "");
        break;
      }
    }

    let difficulty = "Medium";
    const difficultySelectors = [
      'div[class*="text-difficulty"]',
      'div[class*="text-olive"]', // Easy
      'div[class*="text-yellow"]', // Medium
      'div[class*="text-pink"]', // Hard
      'span[class*="text-olive"]',
      'span[class*="text-yellow"]',
      'span[class*="text-pink"]',
    ];

    for (const selector of difficultySelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.textContent.toLowerCase();
        if (text.includes("easy")) {
          difficulty = "Easy";
          break;
        } else if (text.includes("hard")) {
          difficulty = "Hard";
          break;
        } else if (text.includes("medium")) {
          difficulty = "Medium";
          break;
        }
      }
    }

    return { title, url, difficulty };
  }

  /** Shows a toast notification on the page */
  function showToast(message, type = "success", link = null) {
    const existing = document.getElementById("coderep-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "coderep-toast";
    toast.className = `coderep-toast coderep-toast-${type}`;

    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

    toast.innerHTML = `
      <div class="coderep-toast-content">
        <span class="coderep-toast-icon">${icon}</span>
        <span class="coderep-toast-message">${message}</span>
      </div>
      ${link ? `<a href="${link}" target="_blank" class="coderep-toast-link">View Dashboard →</a>` : ""}
      <button class="coderep-toast-close">×</button>
    `;

    document.body.appendChild(toast);

    toast
      .querySelector(".coderep-toast-close")
      .addEventListener("click", () => {
        toast.classList.remove("coderep-toast-show");
        setTimeout(() => toast.remove(), 300);
      });

    requestAnimationFrame(() => {
      toast.classList.add("coderep-toast-show");
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove("coderep-toast-show");
        setTimeout(() => toast.remove(), 300);
      }
    }, CONFIG.toastDuration);
  }

  /** Gets the API token and base URL from extension storage */
  async function getApiConfig() {
    return new Promise((resolve) => {
      try {
        if (!chrome?.runtime?.id) {
          console.log(
            "[CodeRep] Extension context invalidated, please reload page",
          );
          resolve({ token: null, baseUrl: "https://coderep.vercel.app" });
          return;
        }

        chrome.storage.sync.get(["apiToken", "apiUrl"], (data) => {
          if (chrome.runtime.lastError) {
            console.log(
              "[CodeRep] Error accessing storage:",
              chrome.runtime.lastError,
            );
            resolve({ token: null, baseUrl: "https://coderep.vercel.app" });
            return;
          }

          resolve({
            token: data.apiToken || null,
            baseUrl: data.apiUrl || "https://coderep.vercel.app",
          });
        });
      } catch (error) {
        console.log("[CodeRep] Extension error:", error.message);
        resolve({ token: null, baseUrl: "https://coderep.vercel.app" });
      }
    });
  }

  /** Sends a problem to the CodeRep API */
  async function addProblemToCodeRep(problemData) {
    const { token, baseUrl } = await getApiConfig();

    if (!token) {
      showToast(
        "Please connect your account first. Click the extension icon.",
        "error",
      );
      return false;
    }

    try {
      const response = await fetch(`${baseUrl}/api/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(problemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add problem");
      }

      return true;
    } catch (error) {
      console.error("CodeRep Error:", error);
      throw error;
    }
  }

  /** Checks if a problem already exists in the user's list */
  async function checkIfProblemExists(url) {
    const { token, baseUrl } = await getApiConfig();

    if (!token) return false;

    try {
      const response = await fetch(
        `${baseUrl}/api/problems/check?url=${encodeURIComponent(url)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
    } catch (error) {
      console.error("CodeRep Error:", error);
    }
    return false;
  }

  /** Finds a problem by its LeetCode URL */
  async function findProblemByUrl(url) {
    const { token, baseUrl } = await getApiConfig();

    if (!token) {
      console.log("[CodeRep] No token found, cannot fetch problem");
      return null;
    }

    console.log("[CodeRep] Finding problem by URL:", url);

    try {
      const response = await fetch(
        `${baseUrl}/api/problems/find?url=${encodeURIComponent(url)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const problem = await response.json();
        console.log("[CodeRep] Problem found:", problem);
        return problem;
      } else {
        console.log(
          "[CodeRep] Problem not found (status:",
          response.status,
          ")",
        );
      }
    } catch (error) {
      console.error("[CodeRep] Error finding problem:", error);
    }
    return null;
  }

  /** Submits a review rating for a problem */
  async function submitRating(problemId, rating) {
    const { token, baseUrl } = await getApiConfig();

    if (!token) return false;

    try {
      const response = await fetch(`${baseUrl}/api/problems/${problemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      return response.ok;
    } catch (error) {
      console.error("CodeRep Error:", error);
      return false;
    }
  }

  /** Updates the visual state of the Add to CodeRep button */
  function updateButtonState(state, button = null) {
    const btn = button || document.getElementById("coderep-add-button");
    if (!btn) return;

    btn.disabled = false;
    btn.classList.remove("coderep-btn-loading", "coderep-btn-added");

    switch (state) {
      case "loading":
        btn.disabled = true;
        btn.classList.add("coderep-btn-loading");
        btn.innerHTML = `
          <span class="coderep-btn-spinner"></span>
          <span>Adding...</span>
        `;
        break;
      case "added":
        btn.disabled = true;
        btn.classList.add("coderep-btn-added");
        btn.innerHTML = `
          <span class="coderep-btn-icon">✓</span>
          <span>Added to CodeRep</span>
        `;
        break;
      case "error":
      case "default":
      default:
        btn.innerHTML = `
          <span class="coderep-btn-icon">+</span>
          <span>Add to CodeRep</span>
        `;
        break;
    }
  }

  /** Injects the "Add to CodeRep" button on the LeetCode problem page */
  async function injectButton() {
    if (document.getElementById("coderep-add-button")) return;

    const titleContainerSelectors = [
      'div[class*="flexlayout__tab"]',
      'div[class*="text-title-large"]',
      'div[data-cy="question-title"]',
      ".flexlayout__tab_button_content",
    ];

    let container = null;

    for (const selector of titleContainerSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        container = el.parentElement;
        break;
      }
    }

    if (!container) {
      if (retryCount < CONFIG.maxRetries) {
        retryCount++;
        setTimeout(injectButton, CONFIG.retryDelay);
      }
      return;
    }

    retryCount = 0;

    const btnContainer = document.createElement("div");
    btnContainer.id = "coderep-button-container";
    btnContainer.className = "coderep-button-container";

    const button = document.createElement("button");
    button.id = "coderep-add-button";
    button.className = "coderep-btn";
    button.innerHTML = `
      <span class="coderep-btn-icon">+</span>
      <span>Add to CodeRep</span>
    `;

    const problemData = extractProblemDetails();
    const exists = await checkIfProblemExists(problemData.url);

    if (exists) {
      updateButtonState("added", button);
    }

    button.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (button.disabled) return;

      updateButtonState("loading", button);

      const data = extractProblemDetails();

      if (!data.title) {
        showToast(
          "Could not extract problem details. Please try again.",
          "error",
        );
        updateButtonState("default", button);
        return;
      }

      try {
        const success = await addProblemToCodeRep(data);
        if (success) {
          const { baseUrl } = await getApiConfig();
          updateButtonState("added", button);
          showToast(
            `"${data.title}" added to your revision list!`,
            "success",
            `${baseUrl}/dashboard`,
          );
        }
      } catch (error) {
        showToast(error.message || "Failed to add problem", "error");
        updateButtonState("default", button);
      }
    });

    btnContainer.appendChild(button);

    const insertTarget =
      document.querySelector('div[class*="text-title-large"]') ||
      document.querySelector('[data-cy="question-title"]');

    if (insertTarget && insertTarget.parentElement) {
      insertTarget.parentElement.insertBefore(
        btnContainer,
        insertTarget.nextSibling,
      );
    } else {
      container.appendChild(btnContainer);
    }
  }

  /** Shows the rating prompt after a successful submission */
  function showRatingPrompt(problem) {
    console.log("[CodeRep] Showing rating prompt for problem:", problem.title);

    if (ratedProblems.has(problem.url)) {
      console.log("[CodeRep] Problem already rated in this session, skipping");
      return;
    }

    const existing = document.getElementById("coderep-rating-prompt");
    if (existing) existing.remove();

    const prompt = document.createElement("div");
    prompt.id = "coderep-rating-prompt";
    prompt.className = "coderep-rating-prompt";

    const iconUrl = chrome.runtime.getURL("icons/icon128.png");

    prompt.innerHTML = `
      <div class="coderep-rating-card">
        <button class="coderep-rating-close">×</button>
        <div class="coderep-rating-header">
          <div class="coderep-rating-logo">
          <img src="${iconUrl}" width="32" height="32" alt="Logo" />
          </div>
          <div>
            <h3 class="coderep-rating-title">How did you find this problem?</h3>
            <p class="coderep-rating-subtitle">This helps us schedule your next review</p>
          </div>
        </div>
        <div class="coderep-rating-buttons">
          <button class="coderep-rating-btn coderep-rating-fail" data-rating="Reset">
            <span class="coderep-rating-btn-icon">✕</span>
            <span>Failed</span>
          </button>
          <button class="coderep-rating-btn coderep-rating-hard" data-rating="Hard">
            <span class="coderep-rating-btn-icon">!</span>
            <span>Hard</span>
          </button>
          <button class="coderep-rating-btn coderep-rating-good" data-rating="Good">
            <span class="coderep-rating-btn-icon">✓</span>
            <span>Easy</span>
          </button>
        </div>
        <button class="coderep-rating-skip">Skip for now</button>
      </div>
    `;

    document.body.appendChild(prompt);

    requestAnimationFrame(() => {
      prompt.classList.add("coderep-rating-show");
    });

    const closePrompt = () => {
      ratedProblems.add(problem.url);
      currentSubmissionUrl = null;

      prompt.classList.remove("coderep-rating-show");
      setTimeout(() => prompt.remove(), 300);
    };

    prompt
      .querySelector(".coderep-rating-close")
      .addEventListener("click", closePrompt);
    prompt
      .querySelector(".coderep-rating-skip")
      .addEventListener("click", closePrompt);

    prompt.querySelectorAll(".coderep-rating-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const rating = btn.dataset.rating;
        btn.disabled = true;
        btn.innerHTML = `<span class="coderep-btn-spinner"></span>`;

        const success = await submitRating(problem.id, rating);

        if (success) {
          ratedProblems.add(problem.url);
          currentSubmissionUrl = null;

          closePrompt();
          const { baseUrl } = await getApiConfig();
          showToast(
            `Review saved! Next review scheduled.`,
            "success",
            `${baseUrl}/dashboard`,
          );
        } else {
          showToast("Failed to save rating. Please try again.", "error");
          btn.disabled = false;
          btn.innerHTML = `
            <span class="coderep-rating-btn-icon">${rating === "Reset" ? "✕" : rating === "Hard" ? "!" : "✓"}</span>
            <span>${rating === "Reset" ? "Failed" : rating}</span>
          `;
        }
      });
    });
  }

  /** Detects accepted submissions and shows rating prompt for tracked problems */
  function detectSubmission() {
    let isChecking = false;
    let lastCheckTime = 0;

    /** Checks if a DOM element represents an accepted submission (not a test run) */
    const isSubmissionAccepted = (element) => {
      if (!element || !element.textContent) return false;

      if (element.id && element.id.startsWith("coderep-")) {
        return false;
      }
      if (
        element.className &&
        typeof element.className === "string" &&
        element.className.includes("coderep-")
      ) {
        return false;
      }

      const text = element.textContent.toLowerCase();

      if (!text.includes("accepted")) {
        return false;
      }

      const isTestRun = text.includes("test case") || text.includes("testcase");
      if (isTestRun) {
        console.log(
          "[CodeRep] Detected test case result (not a submission), ignoring",
        );
        return false;
      }

      // CRITICAL: Differentiate between test run vs actual submission
      // Submissions show "Beats X%" or "faster than" or "distribution"
      // Test runs do NOT show these statistics
      const hasSubmissionStats =
        text.includes("beats") || // "Beats 95.2%"
        text.includes("faster than") || // "faster than X%"
        text.includes("less than") || // "less than X%" for memory
        text.includes("distribution") || // Runtime distribution chart
        element.querySelector('[class*="distribution"]') ||
        element.querySelector('[class*="percentile"]');

      const isSubmissionResult =
        element.querySelector('[data-e2e-locator="submission-result"]') ||
        element.closest('[data-e2e-locator="submission-result"]') ||
        (element.className &&
          typeof element.className === "string" &&
          element.className.includes("submission"));

      const hasNextChallengeButton =
        element.querySelector('a[href*="/problems/"]') ||
        text.includes("next challenge");

      // Only return true if we have submission stats OR clear submission indicators
      // This filters out test case "Accepted" messages
      const isRealSubmission =
        hasSubmissionStats || hasNextChallengeButton || isSubmissionResult;

      if (isRealSubmission) {
        console.log(
          "[CodeRep] ✓ Real submission detected (has stats/indicators)",
        );
      }

      return isRealSubmission;
    };

    const observer = new MutationObserver(async (mutations) => {
      const now = Date.now();
      if (isChecking || now - lastCheckTime < 2000) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;

          if (node.id && node.id.startsWith("coderep-")) {
            continue;
          }
          if (
            node.className &&
            typeof node.className === "string" &&
            node.className.includes("coderep-")
          ) {
            continue;
          }

          if (isSubmissionAccepted(node)) {
            isChecking = true;
            lastCheckTime = now;

            console.log(
              "[CodeRep] ✓ SUBMISSION ACCEPTED detected via observer!",
            );
            console.log("[CodeRep] Element:", node.className || node.tagName);

            await new Promise((r) => setTimeout(r, 1500));

            const problemData = extractProblemDetails();

            if (currentSubmissionUrl === problemData.url) {
              console.log(
                "[CodeRep] Already handling this submission, skipping",
              );
              isChecking = false;
              return;
            }

            if (ratedProblems.has(problemData.url)) {
              console.log(
                "[CodeRep] Problem already rated in this session, skipping",
              );
              isChecking = false;
              return;
            }

            currentSubmissionUrl = problemData.url;
            const problem = await findProblemByUrl(problemData.url);

            if (problem && problem.isTracking) {
              console.log(
                "[CodeRep] Problem is tracked, showing rating prompt",
              );
              showRatingPrompt(problem);
            } else if (problem) {
              console.log("[CodeRep] Problem found but not tracked");
            } else {
              console.log("[CodeRep] Problem not found in your list");
            }

            isChecking = false;
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setInterval(async () => {
      if (isChecking) return;

      const resultSelectors = [
        '[data-e2e-locator="submission-result"]',
        '[class*="submission"][class*="result"]',
      ];

      for (const selector of resultSelectors) {
        const resultElement = document.querySelector(selector);
        if (resultElement && isSubmissionAccepted(resultElement)) {
          const now = Date.now();
          if (now - lastCheckTime < 2000) return;

          isChecking = true;
          lastCheckTime = now;

          console.log("[CodeRep] ✓ SUBMISSION ACCEPTED detected via polling!");
          console.log("[CodeRep] Selector matched:", selector);

          await new Promise((r) => setTimeout(r, 1500));

          const problemData = extractProblemDetails();

          if (currentSubmissionUrl === problemData.url) {
            console.log("[CodeRep] Already handling this submission, skipping");
            isChecking = false;
            return;
          }

          if (ratedProblems.has(problemData.url)) {
            console.log(
              "[CodeRep] Problem already rated in this session, skipping",
            );
            isChecking = false;
            return;
          }

          currentSubmissionUrl = problemData.url;
          const problem = await findProblemByUrl(problemData.url);

          if (problem && problem.isTracking) {
            console.log("[CodeRep] Showing rating prompt");
            showRatingPrompt(problem);
          }

          isChecking = false;
          break;
        }
      }
    }, 2000);
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addCurrentProblem") {
      const problemData = extractProblemDetails();
      if (problemData.title) {
        addProblemToCodeRep(problemData)
          .then(() => sendResponse({ success: true }))
          .catch((err) => sendResponse({ success: false, error: err.message }));
      } else {
        sendResponse({
          success: false,
          error: "Could not extract problem details",
        });
      }
      return true;
    }

    if (request.action === "getProblemDetails") {
      sendResponse(extractProblemDetails());
    }
  });

  function init() {
    console.log("[CodeRep] Extension initialized on:", window.location.href);
    injectButton();
    detectSubmission();
  }

  /** Exposes a test function for debugging the rating prompt */
  window.CodeRepTest = async function () {
    try {
      console.log("[CodeRep] Manual test triggered");

      if (!chrome?.runtime?.id) {
        console.error(
          "[CodeRep] Extension context lost. Please reload the page.",
        );
        alert(
          "CodeRep Extension: Please reload the page. Extension was updated/reloaded.",
        );
        return;
      }

      const problemData = extractProblemDetails();
      console.log("[CodeRep] Current problem:", problemData);

      if (!problemData.title) {
        console.error("[CodeRep] Could not extract problem details");
        showToast("Could not extract problem details", "error");
        return;
      }

      const problem = await findProblemByUrl(problemData.url);

      if (problem && problem.isTracking) {
        console.log("[CodeRep] Showing rating prompt");
        showRatingPrompt(problem);
      } else if (problem) {
        console.log("[CodeRep] Problem found but not tracked");
        showToast("This problem is not being tracked", "info");
      } else {
        console.log("[CodeRep] Problem not in your list");
        showToast("Add this problem to CodeRep first", "info");
      }
    } catch (error) {
      console.error("[CodeRep] Test error:", error);
      showToast("Test failed: " + error.message, "error");
    }
  };

  console.log(
    "[CodeRep] Content script loaded. Type CodeRepTest() to test rating prompt.",
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      retryCount = 0;
      currentSubmissionUrl = null;
      console.log(
        "[CodeRep] Navigated to new problem, cleared submission tracking",
      );

      const oldBtn = document.getElementById("coderep-button-container");
      if (oldBtn) oldBtn.remove();

      setTimeout(init, 500);
    }
  }).observe(document, { subtree: true, childList: true });
})();
