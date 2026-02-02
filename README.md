# MicroShop — Application Microservices avec une Approche DevOps Sécurisée sur Kubernetes

## 1. Présentation de l’application

MicroShop est une application composée de microservices REST simulant le fonctionnement d’une boutique en ligne.  
Elle est déployée sur Kubernetes selon une démarche DevOps orientée sécurité.

L’application est constituée de trois services :

| Service        | Rôle                                              |
|----------------|---------------------------------------------------|
| client-service | Microservice consommateur de l’API                |
| api-service    | API Node.js / Express contenant la logique métier |
| mongo-service  | Base de données MongoDB assurant la persistance   |

Les services communiquent uniquement à l’intérieur du cluster Kubernetes.

---

## 2. Objectifs DevOps du projet

Ce projet met en œuvre :

- Conteneurisation avec Docker
- Déploiement Kubernetes (Deployments, Services, PVC, Ingress)
- Isolation via namespace
- RBAC (Role Based Access Control)
- Service Mesh avec Istio
- Chiffrement des communications avec mTLS STRICT
- Contrôle des flux réseau avec AuthorizationPolicy
- Gestion sécurisée des secrets Kubernetes
- Audit de sécurité des images Docker

---

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
Les images Docker sont publiées sur Docker Hub et utilisées directement
par les manifestes Kubernetes :

-   `amine1002/backend-api`
-   `amine1002/frontend-client`

------------------------------------------------------------------------

## 5. Procédure de reproduction

### 5.1 Cloner le projet

``` bash
git clone https://github.com/Amine10A02/Amine_MAMMA_M2_MIAG_-DEVOPS_Project-.git
cd backend
```

### 5.2 Démarrer Minikube et activer l’Ingress

```bash
minikube start --driver=docker
minikube addons enable ingress
minikube tunnel

```
Laisser la commande minikube tunnel ouverte dans un terminal séparé.
Cette étape est nécessaire sous Windows avec le driver Docker pour permettre à l’Ingress d’être accessible depuis le navigateur.


**Ingress test**


```bash
kubectl -n microshop get ingress

```

<img width="523" height="47" alt="image" src="https://github.com/user-attachments/assets/885026f3-9ee5-4f18-8eac-3e44a0dd7d52" />




### 5.3 Créer le fichier `.env` (non versionné)

``` env
MONGO_URI=mongodb://mongo:27017/microshop
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
<img width="485" height="62" alt="image" src="https://github.com/user-attachments/assets/f443aff3-8068-44a1-9beb-6d6a1d8e2c18" />



### 5.5 Vérification de la communication entre microservices(Preuve que l’API communique avec MongoDB)
``` bash
kubectl -n microshop logs deploy/api
```

<img width="498" height="77" alt="image" src="https://github.com/user-attachments/assets/ab861fd4-650d-461c-8baf-986105a8155e" />


### 5.5 Vérification des Services Kubernetes

``` bash
kubectl -n microshop get svc
```


<img width="440" height="65" alt="image" src="https://github.com/user-attachments/assets/2b27cd10-8f75-423a-b79b-1b637ccaaabd" />


### 5.6 vérification  que le client-service est accessible depuis l’extérieur du cluster et qu’il communique correctement avec l’api-service et la base MongoDB via les services Kubernetes. 


``` bash
kubectl -n microshop port-forward svc/client 8080:8080
```


<img width="562" height="44" alt="image" src="https://github.com/user-attachments/assets/13b07613-249f-42f7-8d0a-f9b2602cbda6" />



------------------------------------------------------------------------

## 7. Installation et vérification d'Istio

``` bash
kubectl -n istio-system get pods
kubectl label namespace microshop istio-injection=enabled --overwrite
kubectl -n microshop get pods
```
<img width="558" height="39" alt="image" src="https://github.com/user-attachments/assets/a30bc0ca-a368-4eb3-8db5-f2cf5e7e3f93" />


------------------------------------------------------------------------

## 8. Vérification du RBAC

``` bash
kubectl auth can-i get pods --as=system:serviceaccount:microshop:api-sa -n microshop
kubectl auth can-i delete pods --as=system:serviceaccount:microshop:api-sa -n microshop
```
<img width="649" height="36" alt="image" src="https://github.com/user-attachments/assets/fd64465a-d38d-4b4f-a937-d432f9a17b35" />

Le ServiceAccount api-sa a le droit de lire les pods 

Le ServiceAccount api-sa n’a PAS le droit de supprimer les pods

------------------------------------------------------------------------
## 9. Activation du mTLS STRICT

``` bash
kubectl apply -f k8s/security/10-istio-mtls-strict.yaml
kubectl -n microshop get peerauthentication
```

<img width="649" height="61" alt="image" src="https://github.com/user-attachments/assets/cfdda1d2-2e93-4e19-ae5e-eac9878cdb42" />

Le mTLS STRICT est bien actif dans le namespace microshop.

------------------------------------------------------------------------

## 10. AuthorizationPolicy --- Contrôle des flux réseau

``` bash
kubectl apply -f k8s/security/11-istio-authz.yaml
kubectl -n microshop get authorizationpolicy
```

Règles appliquées :

-   deny-all par défaut
-   client-service → api-service autorisé
-   api-service → mongo-service autorisé


<img width="649" height="83" alt="image" src="https://github.com/user-attachments/assets/70d6a3b2-ab16-49b0-90f9-f9122e667a62" />




le contrôle des flux réseau avec Istio est bien en place

------------------------------------------------------------------------

## 11. Persistance MongoDB

``` bash
kubectl -n microshop get pvc
```
<img width="544" height="31" alt="image" src="https://github.com/user-attachments/assets/14a9da04-f4c6-430c-9837-1d3d70ddeb90" />

la persistance MongoDB fonctionne correctement grâce au PVC

------------------------------------------------------------------------

## 12. Audit de sécurité des images Docker avec Trivy

``` bash
docker run --rm aquasec/trivy:latest image amine1002/backend-api:latest
docker run --rm aquasec/trivy:latest image amine1002/frontend-client:latest
```

------------------------------------------------------------------------

## 13. Conclusion

Ce projet illustre la mise en œuvre complète d’une application microservices déployée sur Kubernetes selon une approche DevOps centrée sur la sécurité.

Au-delà du simple déploiement applicatif, MicroShop met en évidence :

- L’automatisation du déploiement via des manifestes Kubernetes structurés
- L’isolation des ressources grâce à l’utilisation des namespaces
- La mise en place d’un contrôle d’accès fin avec le RBAC
- La sécurisation des communications internes par l’intégration d’un Service Mesh (Istio) et l’activation du mTLS STRICT
- Le contrôle précis des flux réseau grâce aux AuthorizationPolicy
- La gestion sécurisée des informations sensibles avec les secrets Kubernetes
- L’analyse de la sécurité des images Docker à l’aide de Trivy

Ainsi, ce projet constitue une démonstration concrète des bonnes pratiques DevOps appliquées à un environnement Kubernetes sécurisé, en intégrant à la fois les aspects déploiement, réseau, sécurité et persistance des données.

------------------------------------------------------------------------

## 14. Capture d’écran des Google Labs réalisée

<img width="880" height="432" alt="image" src="https://github.com/user-attachments/assets/b50d082c-3a69-40a2-a77b-4283f2b2a97a" />


## Auteur

Amine MAMMA  --- M2 MIAGE / DevOps
