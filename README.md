# Devops project
# 🛒
MicroShop — Application Microservices déployée avec une approche DevOps sécurisée

## 1. Présentation de l’application

MicroShop est une application composée de plusieurs **microservices REST** simulant le fonctionnement d’une boutique.

L’application est constituée de trois services :

- **client-service** : microservice consommateur de l’API
- **api-service** : API Node.js / Express contenant la logique métier
- **mongo-service** : base de données MongoDB assurant la persistance

Ces services communiquent uniquement à l’intérieur d’un cluster Kubernetes.

---

## 2. Objectif DevOps du projet

L’objectif du projet est de démontrer la mise en œuvre des **bonnes pratiques DevOps** ainsi que la **sécurisation d’un cluster Kubernetes** :

- Conteneurisation avec Docker
- Déploiement Kubernetes (Deployments, Services, PVC)
- Isolation via namespace
- RBAC (Role Based Access Control)
- Service Mesh avec Istio
- Chiffrement des communications (mTLS STRICT)
- Contrôle des flux réseau (AuthorizationPolicy)
- Gestion sécurisée des secrets

- Audit de sécurité des images Docker

---

## 3. Structure du projet

