from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, BeforeValidator, EmailStr
from typing import List, Optional, Annotated
from bson import ObjectId
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

logger.info(f"Connecting to MongoDB at {MONGO_URL}, Database: {DB_NAME}")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Resend integration setup
EMAIL_BASE_URL = "https://proxy.dev.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "AccessVerse")

# Coerce MongoDB ObjectId to str
PyObjectId = Annotated[str, BeforeValidator(str)]

# Base Document mapped according to guidelines
class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        return cls(**doc)

    def to_mongo(self, exclude_id: bool = False):
        doc = self.model_dump(by_alias=True, exclude_none=True)
        if exclude_id and "_id" in doc:
            del doc["_id"]
        elif "_id" in doc and isinstance(doc["_id"], str):
            try:
                doc["_id"] = ObjectId(doc["_id"])
            except Exception:
                pass
        return doc

# --- Models ---

class QuoteCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    company: str = Field(..., min_length=1)
    website: Optional[str] = None
    services: List[str] = Field(default_factory=list)
    details: str = Field(..., min_length=5)
    estimated_pages: Optional[int] = None

class QuoteDocument(BaseDocument, QuoteCreate):
    status: str = Field(default="Pending")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteResponse(QuoteCreate):
    id: str
    status: str
    created_at: datetime

class ConsultationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    company: str = Field(..., min_length=1)
    preferred_date: str = Field(..., min_length=1)
    preferred_time: str = Field(..., min_length=1)
    accessibility_needs: Optional[str] = None

class ConsultationDocument(BaseDocument, ConsultationCreate):
    status: str = Field(default="Confirmed")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ConsultationResponse(ConsultationCreate):
    id: str
    status: str
    created_at: datetime

# Create the main app without a prefix
app = FastAPI(title="AccessVerse Digital Accessibility API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# --- Email Helper Function ---

async def send_notification_email(recipient_email: str, recipient_name: str, form_type: str, details_html: str):
    """
    Helper function to send a transactional confirmation email using the Emergent-managed Resend integration.
    """
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY is not configured. Email notification skipped.")
        return False

    subject = f"AccessVerse - We Received Your {form_type} Request"
    
    html_content = f"""
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF; color: #0B192C;">
        <div style="margin-bottom: 30px; text-align: left; border-bottom: 2px solid #F8F9FA; padding-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0066FF; margin: 0; letter-spacing: -0.5px;">AccessVerse</h1>
            <p style="font-size: 12px; color: #0B192C; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; margin-bottom: 0;">Digital Accessibility Solutions</p>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 600; color: #0B192C; margin-top: 0; margin-bottom: 16px;">Hello {recipient_name},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #0B192C; opacity: 0.8; margin-bottom: 24px;">
            Thank you for reaching out to AccessVerse. We have successfully received your <strong>{form_type}</strong> submission. Our compliance experts are reviewing your details and will get back to you within 1 business day.
        </p>

        <div style="background-color: #F8F9FA; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #0066FF;">
            <h3 style="font-size: 15px; font-weight: 600; color: #0B192C; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Submission Details</h3>
            {details_html}
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #0B192C; opacity: 0.8; margin-bottom: 30px;">
            In the meantime, you can explore our resources on WCAG 2.2 AA and ADA compliance to learn more about achieving complete digital inclusivity.
        </p>

        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: left; font-size: 12px; color: #0B192C; opacity: 0.5; line-height: 1.5;">
            <p style="margin: 0 0 5px 0;">AccessVerse.org — Making Digital Content Accessible for Everyone.</p>
            <p style="margin: 0;">This email is sent automatically. If you did not make this request, please reply to us at info@accessverse.org.</p>
        </div>
    </div>
    """

    payload = {
        "to": [recipient_email],
        "subject": subject,
        "html": html_content,
        "from_name": EMAIL_FROM_NAME,
        "contact_email": "info@accessverse.org"
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        logger.info(f"Notification email successfully sent to {recipient_email} (ID: {resp.json().get('id')})")
        return True
    except httpx.HTTPStatusError as e:
        logger.error(f"Resend email send failed: {e.response.status_code} {e.response.text}")
        return False
    except Exception as e:
        logger.error(f"Resend email send error: {str(e)}")
        return False

# --- Endpoints ---

@api_router.get("/")
async def root():
    return {
        "message": "AccessVerse Digital Accessibility API is operational.",
        "status": "healthy",
        "version": "1.0.0"
    }

# --- Quote Endpoints ---

@api_router.post("/quotes", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote_request(quote: QuoteCreate):
    quote_doc = QuoteDocument(**quote.model_dump())
    mongo_dict = quote_doc.to_mongo(exclude_id=True)
    
    # Store in MongoDB
    result = await db.quote_requests.insert_one(mongo_dict)
    quote_doc.id = str(result.inserted_id)
    
    # Create HTML summary for email
    services_list = ", ".join(quote.services) if quote.services else "None selected"
    details_html = f"""
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C; width: 35%;">Name:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{quote.name}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Company:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{quote.company}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Email:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{quote.email}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Website:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{quote.website or "N/A"}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Services:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{services_list}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Estimated Pages:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{quote.estimated_pages or "Not specified"}</td>
        </tr>
        <tr>
            <td style="padding: 10px 0 0 0; font-weight: 600; color: #0B192C; vertical-align: top;">Project Scope:</td>
            <td style="padding: 10px 0 0 0; color: #0B192C; opacity: 0.8; line-height: 1.4;">{quote.details}</td>
        </tr>
    </table>
    """
    
    # Send email notification asynchronously (we won't block the API response on email completion failure)
    await send_notification_email(
        recipient_email=quote.email,
        recipient_name=quote.name,
        form_type="Quote Request",
        details_html=details_html
    )
    
    # Return response model
    return QuoteResponse(
        id=quote_doc.id,
        name=quote_doc.name,
        email=quote_doc.email,
        company=quote_doc.company,
        website=quote_doc.website,
        services=quote_doc.services,
        details=quote_doc.details,
        estimated_pages=quote_doc.estimated_pages,
        status=quote_doc.status,
        created_at=quote_doc.created_at
    )

@api_router.get("/quotes", response_model=List[QuoteResponse])
async def get_all_quotes():
    raw_quotes = await db.quote_requests.find().sort("created_at", -1).to_list(1000)
    quotes = []
    for doc in raw_quotes:
        doc_obj = QuoteDocument.from_mongo(doc)
        if doc_obj:
            quotes.append(QuoteResponse(
                id=str(doc_obj.id),
                name=doc_obj.name,
                email=doc_obj.email,
                company=doc_obj.company,
                website=doc_obj.website,
                services=doc_obj.services,
                details=doc_obj.details,
                estimated_pages=doc_obj.estimated_pages,
                status=doc_obj.status,
                created_at=doc_obj.created_at
            ))
    return quotes

@api_router.patch("/quotes/{quote_id}/status", response_model=QuoteResponse)
async def update_quote_status(quote_id: str, payload: dict = Field(..., description="Contains 'status' field")):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing status in request body")
    
    try:
        oid = ObjectId(quote_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid quote ID format")

    result = await db.quote_requests.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": new_status}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Quote request not found")
    
    doc_obj = QuoteDocument.from_mongo(result)
    return QuoteResponse(
        id=str(doc_obj.id),
        name=doc_obj.name,
        email=doc_obj.email,
        company=doc_obj.company,
        website=doc_obj.website,
        services=doc_obj.services,
        details=doc_obj.details,
        estimated_pages=doc_obj.estimated_pages,
        status=doc_obj.status,
        created_at=doc_obj.created_at
    )

# --- Consultation Endpoints ---

@api_router.post("/consultations", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(consultation: ConsultationCreate):
    consultation_doc = ConsultationDocument(**consultation.model_dump())
    mongo_dict = consultation_doc.to_mongo(exclude_id=True)
    
    result = await db.consultations.insert_one(mongo_dict)
    consultation_doc.id = str(result.inserted_id)
    
    # Create HTML summary for email
    details_html = f"""
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C; width: 35%;">Name:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{consultation.name}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Company:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{consultation.company}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Email:</td>
            <td style="padding: 6px 0; color: #0B192C; opacity: 0.8;">{consultation.email}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Preferred Date:</td>
            <td style="padding: 6px 0; color: #0066FF; font-weight: 600;">{consultation.preferred_date}</td>
        </tr>
        <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0B192C;">Preferred Time:</td>
            <td style="padding: 6px 0; color: #0066FF; font-weight: 600;">{consultation.preferred_time}</td>
        </tr>
        <tr>
            <td style="padding: 10px 0 0 0; font-weight: 600; color: #0B192C; vertical-align: top;">Accessibility Needs:</td>
            <td style="padding: 10px 0 0 0; color: #0B192C; opacity: 0.8; line-height: 1.4;">{consultation.accessibility_needs or "None specified"}</td>
        </tr>
    </table>
    """
    
    await send_notification_email(
        recipient_email=consultation.email,
        recipient_name=consultation.name,
        form_type="Consultation Booking",
        details_html=details_html
    )
    
    return ConsultationResponse(
        id=consultation_doc.id,
        name=consultation_doc.name,
        email=consultation_doc.email,
        company=consultation_doc.company,
        preferred_date=consultation_doc.preferred_date,
        preferred_time=consultation_doc.preferred_time,
        accessibility_needs=consultation_doc.accessibility_needs,
        status=consultation_doc.status,
        created_at=consultation_doc.created_at
    )

@api_router.get("/consultations", response_model=List[ConsultationResponse])
async def get_all_consultations():
    raw_consultations = await db.consultations.find().sort("created_at", -1).to_list(1000)
    consultations = []
    for doc in raw_consultations:
        doc_obj = ConsultationDocument.from_mongo(doc)
        if doc_obj:
            consultations.append(ConsultationResponse(
                id=str(doc_obj.id),
                name=doc_obj.name,
                email=doc_obj.email,
                company=doc_obj.company,
                preferred_date=doc_obj.preferred_date,
                preferred_time=doc_obj.preferred_time,
                accessibility_needs=doc_obj.accessibility_needs,
                status=doc_obj.status,
                created_at=doc_obj.created_at
            ))
    return consultations

@api_router.patch("/consultations/{consultation_id}/status", response_model=ConsultationResponse)
async def update_consultation_status(consultation_id: str, payload: dict = Field(..., description="Contains 'status' field")):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing status in request body")
    
    try:
        oid = ObjectId(consultation_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid consultation ID format")

    result = await db.consultations.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": new_status}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Consultation booking not found")
    
    doc_obj = ConsultationDocument.from_mongo(result)
    return ConsultationResponse(
        id=str(doc_obj.id),
        name=doc_obj.name,
        email=doc_obj.email,
        company=doc_obj.company,
        preferred_date=doc_obj.preferred_date,
        preferred_time=doc_obj.preferred_time,
        accessibility_needs=doc_obj.accessibility_needs,
        status=doc_obj.status,
        created_at=doc_obj.created_at
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
