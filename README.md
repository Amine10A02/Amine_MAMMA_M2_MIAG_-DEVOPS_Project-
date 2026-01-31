#  MicroShop — Application Microservices avec une Approche DevOps Sécurisée sur Kubernetes

## 1. Présentation de l’application

**MicroShop** est une application distribuée composée de plusieurs microservices REST simulant le fonctionnement d’une boutique en ligne.

L’objectif principal est **architectural et sécuritaire** : démontrer comment déployer et sécuriser une application microservices sur **:contentReference[oaicite:0]{index=0}** en appliquant les **bonnes pratiques DevOps et DevSecOps**.

L’application repose sur trois services :

| Service | Rôle |
|---|---|
| `client-service` | Consommateur de l’API |
| `api-service` | API Node.js / Express contenant la logique métier |
| `mongo-service` | Base de données **:contentReference[oaicite:1]{index=1}** assurant la persistance |

Les communications entre services s’effectuent **uniquement à l’intérieur du cluster Kubernetes**.

---

## 2. Objectifs DevOps et Sécurité

Ce projet met en œuvre une chaîne complète de pratiques **DevOps orientées sécurité** :

- Conteneurisation avec **:contentReference[oaicite:2]{index=2}**
- Orchestration Kubernetes (Deployments, Services, PVC)
- Isolation via namespace dédié
- RBAC (Role-Based Access Control)
- Service Mesh avec **:contentReference[oaicite:3]{index=3}**
- Chiffrement des communications internes via **mTLS STRICT**
- Contrôle des flux réseau avec **AuthorizationPolicy (deny-all par défaut)**
- Gestion sécurisée des secrets Kubernetes
- Audit de sécurité des images Docker avec **:contentReference[oaicite:4]{index=4}**

---

## 3. Architecture globale


::contentReference[oaicite:5]{index=5}


L’architecture repose sur :

- Un namespace dédié `microshop`
- Des ServiceAccounts et règles RBAC minimales
- L’injection automatique du proxy **Envoy** via Istio
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



##5. Images Docker

Images publiées sur Docker Hub :

amine1002/backend-api

amine1002/frontend-client

Mesures de sécurité mises en place :

Authentification 2FA

Utilisation d’un Access Token

Scan de vulnérabilités avec Trivy
