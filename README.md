# MicroShop --- Application Microservices avec une Approche DevOps Sécurisée sur Kubernetes

## 1. Présentation de l'application

MicroShop est une application composée de microservices REST simulant le
fonctionnement d'une boutique en ligne.\
Elle est déployée sur Kubernetes selon une démarche DevOps orientée
sécurité.

  Service          Rôle
  ---------------- ---------------------------------------------------
  client-service   Microservice consommateur de l'API
  api-service      API Node.js / Express contenant la logique métier
  mongo-service    Base de données MongoDB assurant la persistance

Les services communiquent uniquement à l'intérieur du cluster
Kubernetes.

------------------------------------------------------------------------

## 2. Objectifs DevOps du projet

Ce projet met en œuvre :

-   Conteneurisation avec Docker
-   Déploiement Kubernetes (Deployments, Services, PVC)
-   Isolation via namespace
-   RBAC (Role Based Access Control)
-   Service Mesh avec Istio
-   Chiffrement des communications avec mTLS STRICT
-   Contrôle des flux réseau avec AuthorizationPolicy
-   Gestion sécurisée des secrets Kubernetes
-   Audit de sécurité des images Docker

------------------------------------------------------------------------

## 3. Structure du projet

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

------------------------------------------------------------------------

## 4. Images Docker

-   `amine1002/backend-api`
-   `amine1002/frontend-client`

------------------------------------------------------------------------

## 5. Procédure de reproduction

### 5.1 Cloner le projet

``` bash
git clone <repo>
cd backend
```

### 5.2 Créer le fichier `.env` (non versionné)

``` env
MONGO_URI=mongodb://mongo:27017/microshop?directConnection=true
JWT_SECRET=AmineDevopsSecretKey
```

### 5.3 Créer le namespace et le secret Kubernetes

``` bash
kubectl create namespace microshop
kubectl -n microshop create secret generic api-secrets --from-env-file=.env
```

### 5.4 Déployer l'application

``` bash
kubectl apply -f k8s/security/00-namespace.yaml
kubectl apply -f k8s/security/01-api-rbac.yaml
kubectl apply -f k8s/
```

Vérification :

``` bash
kubectl -n microshop get pods
```

------------------------------------------------------------------------

## 6. Vérification du RBAC

``` bash
kubectl auth can-i get pods --as=system:serviceaccount:microshop:api-sa -n microshop
kubectl auth can-i delete pods --as=system:serviceaccount:microshop:api-sa -n microshop
```

------------------------------------------------------------------------

## 7. Installation et vérification d'Istio

``` bash
kubectl -n istio-system get pods
kubectl label namespace microshop istio-injection=enabled --overwrite
kubectl -n microshop get pods
```

Les pods doivent être en état `2/2` (application + proxy Envoy).

------------------------------------------------------------------------

## 8. Activation du mTLS STRICT

``` bash
kubectl apply -f k8s/security/10-istio-mtls-strict.yaml
kubectl -n microshop get peerauthentication
```

------------------------------------------------------------------------

## 9. AuthorizationPolicy --- Contrôle des flux réseau

``` bash
kubectl apply -f k8s/security/11-istio-authz.yaml
kubectl -n microshop get authorizationpolicy
```

Règles appliquées :

-   deny-all par défaut
-   client-service → api-service autorisé
-   api-service → mongo-service autorisé

------------------------------------------------------------------------

## 10. Persistance MongoDB

``` bash
kubectl -n microshop get pvc
```

------------------------------------------------------------------------

## 11. Audit de sécurité des images Docker avec Trivy

``` bash
docker run --rm aquasec/trivy:latest image amine1002/backend-api:latest
docker run --rm aquasec/trivy:latest image amine1002/frontend-client:latest
```

------------------------------------------------------------------------

## 12. Conclusion

Ce projet démontre :

-   Le déploiement d'une application microservices sur Kubernetes
-   L'application des bonnes pratiques DevOps
-   La sécurisation d'un cluster Kubernetes avec RBAC, Istio, mTLS,
    AuthorizationPolicy, secrets et audit d'images

------------------------------------------------------------------------

## Auteur

Amine --- M2 MIAGE / DevOps
