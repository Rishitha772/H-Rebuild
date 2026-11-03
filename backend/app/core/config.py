import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "HireSphere"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    SECRET_KEY: str = "hiresphere-super-secure-secret-key-replace-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    MYSQL_SERVER: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "password"
    MYSQL_DB: str = "hiresphere_db"

    DATABASE_URL: Union[str, None] = None

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Union[str, None], values) -> str:
        if isinstance(v, str) and v:
            return v
        return (
            f"mysql+pymysql://{values.data.get('MYSQL_USER', 'root')}:"
            f"{values.data.get('MYSQL_PASSWORD', 'password')}@"
            f"{values.data.get('MYSQL_SERVER', '127.0.0.1')}:"
            f"{values.data.get('MYSQL_PORT', 3306)}/"
            f"{values.data.get('MYSQL_DB', 'hiresphere_db')}"
        )

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

