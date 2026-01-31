# 🛒 MicroShop — Application Microservices avec une Approche DevOps Sécurisée sur Kubernetes

## 1. Présentation de l’application

**MicroShop** est une application distribuée composée de plusieurs microservices REST simulant le fonctionnement d’une boutique en ligne.

L’objectif principal est **architectural et sécuritaire** : démontrer comment déployer et sécuriser une application microservices sur Kubernetes en appliquant les **bonnes pratiques DevOps et DevSecOps**.

L’application repose sur trois services :

| Service | Rôle |
|---|---|
| `client-service` | Consommateur de l’API |
| `api-service` | API Node.js / Express contenant la logique métier |
| `mongo-service` | Base de données MongoDB assurant la persistance |

Les communications entre services s’effectuent **uniquement à l’intérieur du cluster Kubernetes**.

---

## 2. Objectifs DevOps et Sécurité

Ce projet met en œuvre une chaîne complète de pratiques **DevOps orientées sécurité** :

- Conteneurisation avec Docker
- Orchestration Kubernetes (Deployments, Services, PVC)
- Isolation via namespace dédié
- RBAC (Role-Based Access Control)
- Service Mesh avec Istio
- Chiffrement des communications internes via **mTLS STRICT**
- Contrôle des flux réseau avec **AuthorizationPolicy (deny-all par défaut)**
- Gestion sécurisée des secrets Kubernetes
- Audit de sécurité des images Docker avec Trivy

---

## 3. Architecture globale

L’architecture repose sur :

- Un namespace dédié `microshop`
- Des ServiceAccounts et règles RBAC minimales
- L’injection automatique du proxy Envoy via Istio
- Un chiffrement systématique des communications inter-services
- Un contrôle strict des flux réseau autorisés

---

4. Structure du projet

L’organisation du dépôt est la suivante :

backend/
├── k8s/
│   ├── security/
│   │   ├── 00-namespace.yaml
│   │   ├── 01-api-rbac.yaml
│   │   ├── 10-istio-mtls-strict.yaml
│   │   └── 11-istio-authz.yaml
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── api-ingress.yaml
│   ├── client-deployment.yaml
│   ├── client-service.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-service.yaml
│   └── mongo-pvc.yaml
├── src/
├── client-service/
├── Dockerfile
├── docker-compose.yml
└── package.json

5. Images Docker

Les images de l’application sont publiées sur Docker Hub :

amine1002/backend-api

amine1002/frontend-client

Mesures de sécurité appliquées

Authentification 2FA sur Docker Hub

Utilisation d’un Access Token

Scan de vulnérabilités des images avec Trivy

6. Procédure complète de reproduction
6.1 Cloner le projet
git clone <repo>
cd backend

6.2 Créer le fichier .env (non commité)
MONGO_URI=mongodb://mongo:27017/microshop?directConnection=true
JWT_SECRET=AmineDevopsSecretKey

6.3 Créer le namespace et le secret Kubernetes
kubectl create namespace microshop
kubectl -n microshop create secret generic api-secrets --from-env-file=.env

6.4 Déployer l’application
kubectl apply -f k8s/security/00-namespace.yaml
kubectl apply -f k8s/security/01-api-rbac.yaml
kubectl apply -f k8s/


Vérification :

kubectl -n microshop get pods
