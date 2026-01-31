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

## 4. Structure du projet

```bash
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
Images publiées sur Docker Hub :

amine1002/backend-api

amine1002/frontend-client

Mesures de sécurité mises en place :

Authentification 2FA

Utilisation d’un Access Token

Scan de vulnérabilités avec Trivy

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
7. Vérification du RBAC
kubectl auth can-i get pods --as=system:serviceaccount:microshop:api-sa -n microshop
kubectl auth can-i delete pods --as=system:serviceaccount:microshop:api-sa -n microshop
8. Installation et vérification d’Istio
kubectl -n istio-system get pods
kubectl label namespace microshop istio-injection=enabled --overwrite
kubectl -n microshop get pods
Les pods doivent apparaître en état 2/2 (application + proxy Envoy).

9. Activation du mTLS STRICT
kubectl apply -f k8s/security/10-istio-mtls-strict.yaml
kubectl -n microshop get peerauthentication
10. AuthorizationPolicy — Contrôle des flux réseau
kubectl apply -f k8s/security/11-istio-authz.yaml
kubectl -n microshop get authorizationpolicy
Règles mises en place :

Refus de tout trafic par défaut (deny-all)

Autorisation du trafic client-service → api-service

Autorisation du trafic api-service → mongo-service

11. Persistance MongoDB
kubectl -n microshop get pvc
12. Audit de sécurité des images Docker avec Trivy
docker run --rm aquasec/trivy:latest image amine1002/backend-api:latest
docker run --rm aquasec/trivy:latest image amine1002/frontend-client:latest
13. Conclusion
Ce projet démontre :

Le déploiement d’une application microservices sur Kubernetes

L’application concrète des bonnes pratiques DevOps

La sécurisation avancée d’un cluster Kubernetes via :

RBAC

Istio Service Mesh

mTLS STRICT

AuthorizationPolicy

Secrets Kubernetes

Audit des images Docker

Auteur
Amine MAMMA — M2 MIAGE / DevOps
