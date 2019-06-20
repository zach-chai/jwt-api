# JWT API

[![CircleCI](https://circleci.com/gh/zach-chai/jwt-api.svg?style=shield)](https://circleci.com/gh/zach-chai/jwt-api)
[![Greenkeeper badge](https://badges.greenkeeper.io/zach-chai/jwt-api.svg)](https://greenkeeper.io/)

An HTTP API wrapper for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

## Quick Start

Run docker image:
```
docker run -d -p 3000:3000 zachchai/jwt-api
```
Test with cURL
```bash
curl -X POST \
  http://localhost:3000/api/jwts/sign \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
        "alg": "ES256",
        "payload": {
            "name": "My User"
        },
        "key": "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2\nOF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r\n1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G\n-----END PRIVATE KEY-----"
    }
}'
```

## Full Example

Request:

```json
POST /api/jwts/sign
Content-Type: application/json
{
	"data" : {
		"alg": "ES256",
		"iss": "https://issuer.example",
		"aud": "audience",
		"sub": "my_user",
		"iat": 1549134500,
		"exp": 1549816664,
		"nbf": 1545424225,
		"jti": "jwt_id",
		"kid": "key_id",
		"payload": {
			"name": "My User"
		},
		"key": "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2\nOF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r\n1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G\n-----END PRIVATE KEY-----"
	}
}
```
Response:

`Status code 200`
```json
{
    "data": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleV9pZCJ9.eyJuYW1lIjoiTXkgVXNlciIsImlhdCI6MTU0OTEzNDUwMCwiZXhwIjoxNTQ5ODE2NjY0LCJuYmYiOjE1NDU0MjQyMjUsImF1ZCI6ImF1ZGllbmNlIiwiaXNzIjoiaHR0cHM6Ly9pc3N1ZXIuZXhhbXBsZSIsInN1YiI6Im15X3VzZXIiLCJqdGkiOiJqd3RfaWQifQ.HHnAxHskfIJZywgXEysqO8bGpPVcCv5Gub-JCbYzqfdNmDF9G9wUjgDzvAwpDwLDIFHe6nfVJq79E_RoOdAukw"
}
```
