
import pandas as pd
from sklearn.ensemble import IsolationForest


REQUIRED_COLUMNS = [
    "transaction_id",
    "invoice_id",
    "amount",
    "vendor",
    "transaction_type",
]


def audit_transactions(df):
    """Analyze financial transactions and flag potential audit risks."""

    df = df.copy()
    findings = []

    # Normalize column names
    df.columns = [str(col).strip().lower() for col in df.columns]

    missing_columns = [
        col for col in REQUIRED_COLUMNS if col not in df.columns
    ]

    if missing_columns:
        return {
            "error": (
                "Missing required columns: "
                + ", ".join(missing_columns)
            ),
            "summary": {},
            "findings": [],
        }

    # Convert amounts to numeric values
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

    # Missing or invalid data
    for index, row in df.iterrows():
        if pd.isna(row["amount"]) or pd.isna(row["vendor"]):
            findings.append({
                "transaction_id": str(row["transaction_id"]),
                "issue": "Missing or invalid transaction data",
                "risk": "Medium",
                "details": "Amount or vendor information is missing.",
            })

    # Duplicate invoice detection
    valid_invoices = df["invoice_id"].notna() & (
        df["invoice_id"].astype(str).str.strip() != ""
    )

    duplicate_mask = valid_invoices & df.duplicated(
        subset=["vendor", "invoice_id"],
        keep=False,
    )

    for _, row in df[duplicate_mask].iterrows():
        findings.append({
            "transaction_id": str(row["transaction_id"]),
            "issue": "Potential duplicate invoice",
            "risk": "High",
            "details": (
                f"Invoice {row['invoice_id']} appears more than once "
                f"for vendor {row['vendor']}."
            ),
        })

    # Unusual transaction amount detection
    valid_amounts = df["amount"].dropna()

    if len(valid_amounts) >= 10 and valid_amounts.nunique() > 1:
        model = IsolationForest(
            contamination=0.1,
            random_state=42,
        )

        predictions = model.fit_predict(
            valid_amounts.to_frame()
        )

        for position, prediction in zip(
            valid_amounts.index, predictions
        ):
            if prediction == -1:
                row = df.loc[position]
                findings.append({
                    "transaction_id": str(row["transaction_id"]),
                    "issue": "Unusual transaction amount",
                    "risk": "Medium",
                    "details": (
                        f"Amount {row['amount']:.2f} differs from "
                        "the general transaction pattern."
                    ),
                })

    # Summary
    high_risk = sum(
        item["risk"] == "High" for item in findings
    )

    medium_risk = sum(
        item["risk"] == "Medium" for item in findings
    )

    return {
        "summary": {
            "total_transactions": int(len(df)),
            "total_findings": len(findings),
            "high_risk_findings": high_risk,
            "medium_risk_findings": medium_risk,
            "status": "REVIEW REQUIRED" if findings else "NO FLAGS",
        },
        "findings": findings,
    }
