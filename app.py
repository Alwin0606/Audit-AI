
from flask import Flask, jsonify, render_template, request
from pathlib import Path
import pandas as pd

from audit_engine import audit_transactions

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/health")
def health():
    return jsonify({
        "status": "online",
        "application": "Audit AI",
        "version": "1.0.0",
    })


@app.route("/api/audit", methods=["POST"])
def run_audit():
    if "file" not in request.files:
        return jsonify({"error": "Please upload a CSV or Excel file."}), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({"error": "No file selected."}), 400

    extension = Path(file.filename).suffix.lower()

    try:
        if extension == ".csv":
            df = pd.read_csv(file)
        elif extension in {".xlsx", ".xlsm"}:
            df = pd.read_excel(file)
        else:
            return jsonify({
                "error": "Supported formats: CSV and XLSX."
            }), 400

        if df.empty:
            return jsonify({"error": "The uploaded file is empty."}), 400

        result = audit_transactions(df)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result)

    except (ValueError, UnicodeDecodeError, pd.errors.ParserError):
        return jsonify({
            "error": "Could not read the file. Check its format and contents."
        }), 400
    except Exception:
        app.logger.exception("Audit processing failed")
        return jsonify({
            "error": "Audit failed while processing the file."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
