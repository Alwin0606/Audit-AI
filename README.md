# 🔍 Audit AI — Intelligent Financial Audit & Risk Detection

**Audit AI** is a Python-based financial audit application designed to analyze transaction records, identify potential financial irregularities, and help auditors review suspicious activities efficiently.

The application provides a web-based dashboard for analyzing transaction data, highlighting potential risks, and generating downloadable audit reports.

## ✨ Features

- **Transaction Analysis:** Analyze financial transaction records uploaded or supplied in CSV format.
- **Duplicate Invoice Detection:** Identify potentially duplicated invoices for further investigation.
- **Unusual Transaction Detection:** Flag transactions with unusual amounts that may require additional review.
- **Risk Classification:** Categorize findings by risk level to help prioritize audit reviews.
- **Interactive Dashboard:** View transaction totals, audit findings, risk summaries, and review status.
- **Downloadable Audit Reports:** Export analysis results as JSON for documentation and further review.
- **Sample Dataset:** Test the application using the included sample transaction data.
- **Modular Architecture:** Keep the web application and audit analysis logic organized in separate Python modules.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core application logic |
| Flask | Web application and API |
| Pandas | Transaction data processing |
| Scikit-learn | Machine-learning tools for supported analysis workflows |
| HTML5 | Dashboard structure |
| CSS3 | Dashboard styling |
| JavaScript | Frontend interactions |
| CSV / JSON | Transaction input and report output |

## 📁 Project Structure

```text
Audit-AI/
├── app.py
├── audit_engine.py
├── requirements.txt
├── sample_transactions.csv
├── README.md
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## ⚙️ Prerequisites

Before running Audit AI, install:

- Python 3.13 (or another version compatible with the project's dependencies)
- pip
- Git (optional, for cloning the repository)

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Alwin0606/Audit-AI.git
cd Audit-AI
```

### 2. Create a virtual environment

**Windows PowerShell:**

```powershell
py -3.13 -m venv .venv
```

### 3. Activate the virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script activation, run the following command in the current terminal and try again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 4. Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Start the application

```powershell
python app.py
```

### 6. Open the dashboard

Visit the following address in your browser:

**http://127.0.0.1:5000/**

Keep the terminal running while using the application.

## 📊 How to Use

1. Start the Flask application.
2. Open the Audit AI dashboard in your browser.
3. Provide transaction data using the application's available input workflow.
4. Run the audit analysis.
5. Review the detected findings and risk classifications.
6. Download the generated JSON audit report if needed.

You can begin testing with the included `sample_transactions.csv` file.

## 🔎 Audit Capabilities

### Duplicate Invoice Detection

Identifies invoice records that appear to be duplicated so that an auditor can investigate possible duplicate payments or data-entry errors.

### Unusual Transaction Detection

Highlights transaction amounts that differ significantly from expected patterns and may warrant further review.

### Risk-Based Review

Organizes findings by risk level to help auditors focus on potentially significant issues first.

### Audit Report Generation

Provides a downloadable JSON report containing the analysis summary and detected findings, where supported by the application.

## 🔐 Security and Data Privacy

- Do not upload confidential customer records, bank details, or real company financial data to a public repository.
- Use synthetic or anonymized data for development and demonstrations.
- Keep API keys, credentials, and environment-specific secrets out of source control.
- Review generated reports before sharing them.
- Use a production-ready server and appropriate authentication before deploying sensitive financial data.

## ⚠️ Limitations and Disclaimer

Audit AI is an audit-assistance tool, not a replacement for a qualified auditor or a formal financial audit.

A flagged transaction is **not proof of fraud or misconduct**. Unusual amounts and duplicate invoices may have legitimate explanations and must be reviewed in context.

Detection quality depends on the input data, implemented rules, and analysis methods. Findings should be independently verified before making financial or compliance decisions.

## 🎯 Project Objectives

- Automate selected financial transaction review tasks.
- Improve the visibility of potential irregularities.
- Reduce repetitive manual review work.
- Provide structured audit findings and downloadable reports.
- Demonstrate practical Python, data-analysis, and web-development skills.

## 🔮 Future Enhancements

- Excel file import and validation.
- Configurable audit rules and thresholds.
- More advanced anomaly-detection models.
- Explainable risk scoring and finding-level evidence.
- Audit history and report comparison.
- User authentication and role-based access.
- Secure database integration and deployment.
- Additional report formats, such as PDF and Excel.

*These are planned enhancements and may not be implemented in the current version.*

## 👨‍💻 Author

**GitHub:** [@Alwin0606](https://github.com/Alwin0606)

**Repository:** [Audit AI](https://github.com/Alwin0606/Audit-AI)

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to publish this project under an open-source license.

---

**Audit AI — Turning transaction data into actionable audit insights.**
