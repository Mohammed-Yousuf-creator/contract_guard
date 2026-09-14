from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.database.base import Base
from app.database.session import engine, SessionLocal
from app.database.seed_data import seed_demo_data
import app.database.models  # ensure all models are registered

# Import routers
from app.api.routes.auth import router as auth_router
from app.api.routes.contracts import router as contracts_router
from app.api.routes.documents import router as documents_router
from app.api.routes.versions import router as versions_router
from app.api.routes.changes import router as changes_router
from app.api.routes.risk import router as risk_router
from app.api.routes.evidence import router as evidence_router
from app.api.routes.reviews import router as reviews_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.reports import router as reports_router
from app.api.routes.analysis import router as analysis_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and seed synthetic demo data
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_demo_data(db)
    except Exception as e:
        logger.error(f"Error seeding demo data: {e}")
    finally:
        db.close()
    
    yield
    # Shutdown
    logger.info("Shutting down Contract Guard API server...")


app = FastAPI(
    title="Contract Guard API",
    description="Post-award government contract oversight and compliance decision-support system.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for seamless local dev & hackathon integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred. Please contact system administrator."},
    )


# Mount routers with API_V1_STR
api_v1_prefix = settings.API_V1_STR

app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(contracts_router, prefix=api_v1_prefix)
app.include_router(documents_router, prefix=api_v1_prefix)
app.include_router(versions_router, prefix=api_v1_prefix)
app.include_router(changes_router, prefix=api_v1_prefix)
app.include_router(risk_router, prefix=api_v1_prefix)
app.include_router(evidence_router, prefix=api_v1_prefix)
app.include_router(reviews_router, prefix=api_v1_prefix)
app.include_router(alerts_router, prefix=api_v1_prefix)
app.include_router(reports_router, prefix=api_v1_prefix)
app.include_router(analysis_router, prefix=api_v1_prefix)


@app.get("/health", tags=["Health"])
@app.get(f"{api_v1_prefix}/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Contract Guard Platform API",
        "version": "1.0.0",
        "mock_ai_enabled": settings.USE_MOCK_AI,
    }
