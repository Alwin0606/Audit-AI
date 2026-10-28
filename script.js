
const auditForm = document.getElementById("auditForm");
const auditFile = document.getElementById("auditFile");
const auditButton = document.getElementById("auditButton");
const fileLabel = document.getElementById("fileLabel");
const message = document.getElementById("message");
const results = document.getElementById("results");
const downloadButton = document.getElementById("downloadReport");

let latestReport = null;

auditFile.addEventListener("change", () => {
    const file = auditFile.files[0];

    fileLabel.textContent = file
        ? file.name
        : "Choose a financial data file";

    message.className = "message";
    message.textContent = file
        ? `Selected: ${file.name}`
        : "Ready to analyze your data.";
});

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function setMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`.trim();
}

function updateSummary(summary) {
    document.getElementById("totalTransactions").textContent =
        summary.total_transactions ?? 0;

    document.getElementById("totalFindings").textContent =
        summary.total_findings ?? 0;

    document.getElementById("highRisk").textContent =
        summary.high_risk_findings ?? 0;

    const status = document.getElementById("auditStatus");
    status.textContent = summary.status ?? "COMPLETE";

    document.getElementById("statusDescription").textContent =
        summary.total_findings
            ? "Review flagged transactions"
            : "No issues flagged";
}

function renderFindings(findings) {
    if (!findings.length) {
        results.innerHTML = `
            <div class="empty-state">
                <span>✓</span>
                <strong>No audit flags detected</strong>
                <p>No issues were flagged by the current checks.
                   This does not guarantee that every transaction is correct.</p>
            </div>`;
        return;
    }

    results.innerHTML = `
        <div class="finding-list">
            ${findings.map((finding) => {
                const risk = String(finding.risk || "Medium").toLowerCase();
                const riskClass = ["high", "medium", "low"].includes(risk)
                    ? risk
                    : "medium";

                return `
                    <article class="finding-card">
                        <div class="finding-top">
                            <h3>${escapeHTML(finding.issue)}</h3>
                            <span class="risk-badge risk-${riskClass}">
                                ${escapeHTML(finding.risk)}
                            </span>
                        </div>
                        <p>Transaction ID: ${escapeHTML(finding.transaction_id)}</p>
                        <p>${escapeHTML(finding.details)}</p>
                    </article>`;
            }).join("")}
        </div>`;
}

auditForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = auditFile.files[0];

    if (!file) {
        setMessage("Please choose a CSV or Excel file first.", "error");
        return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xlsm"].includes(extension)) {
        setMessage("Supported file types are CSV and XLSX.", "error");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        setMessage("File is too large. Maximum size is 10 MB.", "error");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    auditButton.disabled = true;
    auditButton.textContent = "Analyzing transactions...";
    setMessage("Analyzing financial records. Please wait.");

    try {
        const response = await fetch("/api/audit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Audit failed.");
        }

        latestReport = data;
        updateSummary(data.summary);
        renderFindings(data.findings || []);

        downloadButton.disabled = false;
        setMessage("Audit completed successfully.", "success");

        document.getElementById("resultsPanel").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (error) {
        setMessage(error.message || "Unable to connect to the audit server.", "error");
    } finally {
        auditButton.disabled = false;
        auditButton.textContent = "Analyze Transactions →";
    }
});

downloadButton.addEventListener("click", () => {
    if (!latestReport) return;

    const report = {
        application: "Audit AI",
        generated_at: new Date().toISOString(),
        summary: latestReport.summary,
        findings: latestReport.findings
    };

    const blob = new Blob(
        [JSON.stringify(report, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "audit-report.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});

fetch("/api/health")
    .then((response) => {
        if (!response.ok) throw new Error("Server offline");
        return response.json();
    })
    .then((data) => {
        if (data.status === "online") {
            console.log("Audit AI backend connected.");
        }
    })
    .catch(() => {
        setMessage("Backend connection unavailable. Start the Flask server.", "error");
    });
