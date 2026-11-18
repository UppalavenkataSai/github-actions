# GitHub Actions Session 01 — Corrected Python CI Lab

This project runs Python unit tests automatically with GitHub Actions.

## Correct repository structure

```text
github-actions/
├── .github/
│   └── workflows/
│       └── session_1.yml
├── calculator.py
├── test_calculator.py
└── README.md
```

Keep `calculator.py` and `test_calculator.py` in the repository root for this version.

## Workflow behavior

The workflow runs on pushes, pull requests, and manual dispatch. It uses a GitHub-hosted Ubuntu runner with Python 3.12.

## Run tests locally

From the repository root:

```bash
python -m unittest discover -s . -p "test_*.py" -v
```

Expected result: both `test_add` and `test_subtract` pass, followed by `OK`.

## Upload to GitHub

1. Open your `github-actions` repository.
2. Ensure the files match the structure shown above.
3. Replace `.github/workflows/session_1.yml` with the supplied workflow.
4. Replace `calculator.py` and `test_calculator.py` with the supplied files.
5. Commit and push the changes.
6. Open the Actions tab and inspect the `CI Pipeline` run.

## Why the previous workflow failed

- `-s tests` failed because the repository did not contain a `tests/` directory.
- `from app.calculator import ...` failed because the repository did not contain an `app/` package.
- This corrected version keeps both Python files in the repository root and imports using `from calculator import ...`.

## Troubleshooting

- `No module named 'calculator'`: confirm `calculator.py` is in the repository root and the filename is spelled correctly.
- No tests discovered: confirm the test filename starts with `test_` and test methods start with `test`.
- Workflow does not trigger: confirm the YAML file is under `.github/workflows/` and check repository or organization Actions policies.
