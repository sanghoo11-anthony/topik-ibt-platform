import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Global TOPIK IBT Platform API"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://topik_user:topik_password@localhost:5432/topik_db",
    )

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        if self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            return self.DATABASE_URL
        if self.DATABASE_URL.startswith("postgresql://"):
            return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        if self.DATABASE_URL.startswith("postgres://"):
            return self.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
        return self.DATABASE_URL

    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    KRDICT_API_KEY: str = os.getenv("KRDICT_API_KEY", "")
    KRDICT_SEARCH_URL: str = "https://krdict.korean.go.kr/api/search"

    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]

    @property
    def is_krdict_mock_mode(self) -> bool:
        key = (self.KRDICT_API_KEY or "").strip()
        return not key or key in ("YOUR_KRDICT_OPEN_API_KEY", "changeme", "mock")


settings = Settings()
