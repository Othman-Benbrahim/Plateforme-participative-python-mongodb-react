"""
Script to seed default categories
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_categories():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if categories already exist
    count = await db.categories.count_documents({})
    if count > 0:
        print(f"Categories already exist ({count} found). Skipping seed.")
        return
    
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name": "Environnement",
            "description": "Propositions liées à l'écologie et au développement durable",
            "icon": "🌱",
            "color": "#22c55e"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Transport",
            "description": "Mobilité urbaine, transports publics et infrastructures",
            "icon": "🚌",
            "color": "#3b82f6"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Culture",
            "description": "Événements culturels, patrimoine et arts",
            "icon": "🎭",
            "color": "#a855f7"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Éducation",
            "description": "Écoles, formation et enseignement",
            "icon": "📚",
            "color": "#f59e0b"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Santé",
            "description": "Services de santé et bien-être",
            "icon": "⚕️",
            "color": "#ef4444"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sécurité",
            "description": "Sécurité publique et prévention",
            "icon": "🛡️",
            "color": "#6366f1"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Urbanisme",
            "description": "Aménagement urbain et espaces publics",
            "icon": "🏙️",
            "color": "#64748b"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Économie Locale",
            "description": "Commerce local et développement économique",
            "icon": "🏪",
            "color": "#14b8a6"
        }
    ]
    
    await db.categories.insert_many(categories)
    print(f"✅ {len(categories)} catégories créées avec succès!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_categories())
