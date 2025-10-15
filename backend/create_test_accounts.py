#!/usr/bin/env python3
"""Script pour créer des comptes de test"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_accounts():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Test accounts
    accounts = [
        {
            "email": "user@test.fr",
            "password": "User123!",
            "name": "Utilisateur Test",
            "role": "user"
        },
        {
            "email": "admin@test.fr",
            "password": "Admin123!",
            "name": "Admin Test",
            "role": "admin"
        }
    ]
    
    created_accounts = []
    
    for account in accounts:
        # Check if user already exists
        existing = await db.users.find_one({"email": account["email"]})
        
        if existing:
            print(f"⚠️  Compte {account['email']} existe déjà (rôle: {existing.get('role', 'user')})")
            created_accounts.append({
                "email": account["email"],
                "password": account["password"],
                "name": account["name"],
                "role": existing.get("role", "user"),
                "status": "exists"
            })
        else:
            # Create new user
            user_dict = {
                "id": str(uuid.uuid4()),
                "email": account["email"],
                "password": pwd_context.hash(account["password"]),
                "name": account["name"],
                "role": account["role"],
                "is_banned": False,
                "badges": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.users.insert_one(user_dict)
            print(f"✅ Compte créé: {account['email']} (rôle: {account['role']})")
            created_accounts.append({
                "email": account["email"],
                "password": account["password"],
                "name": account["name"],
                "role": account["role"],
                "status": "created"
            })
    
    client.close()
    
    # Display credentials
    print("\n" + "="*60)
    print("IDENTIFIANTS DE CONNEXION")
    print("="*60)
    for acc in created_accounts:
        print(f"\n{'🔑 ADMIN' if acc['role'] == 'admin' else '👤 UTILISATEUR'}")
        print(f"  Email    : {acc['email']}")
        print(f"  Password : {acc['password']}")
        print(f"  Nom      : {acc['name']}")
        print(f"  Statut   : {acc['status']}")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(create_test_accounts())
