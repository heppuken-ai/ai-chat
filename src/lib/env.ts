const required = ["ANTHROPIC_API_KEY", "DATABASE_URL"] as const;

// Skip validation during build phase
if (process.env.NEXT_PHASE !== "phase-production-build") {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        `環境変数 ${key} が設定されていません。.env ファイルを確認してください。`
      );
    }
  }
}
