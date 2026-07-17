import os

from jose import jwt
from jose import JWTError

from dotenv import load_dotenv

from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

security = HTTPBearer()


def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security)

):

    token = credentials.credentials

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        return payload

    except JWTError:

        raise HTTPException(

            status_code=401,

            detail="Invalid Token"

        )