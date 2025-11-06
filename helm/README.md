# Wave App Helm Chart

## Prerequisites
- Kubernetes cluster (k3s recommended)
- kubectl context set to the target cluster
- Helm v3+

## Structure
- Chart: `helm/wave-app`
- Components: backend (Node/Express), frontend (Nginx static + proxy)

## Configuration
Edit `values.yaml`:
- `image.backend.repository`, `image.backend.tag`
- `image.frontend.repository`, `image.frontend.tag`
- `supabase.url`, `supabase.key` or set `supabase.existingSecret`
- `service.frontend.type` (NodePort/LoadBalancer) and optional `ingress` block

Note: The frontend requires build-time env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` when building the image. Ensure your CI passes them to the build step.

## Install
```bash
helm upgrade --install wave .\wave-app\helm\wave-app \
  --namespace default \
  --set supabase.url="https://YOUR-PROJECT.supabase.co" \
  --set supabase.key="YOUR-SERVICE-ROLE_KEY"
```

## With Ingress (Traefik on k3s)
```bash
helm upgrade --install wave .\wave-app\helm\wave-app \
  --set ingress.enabled=true \
  --set ingress.className=traefik \
  --set ingress.hosts[0].host=wave.local
```

## Using existing Secret
Create secret `my-supabase` with keys `SUPABASE_URL`, `SUPABASE_KEY` then:
```bash
helm upgrade --install wave .\wave-app\helm\wave-app \
  --set supabase.existingSecret=my-supabase
```

## ArgoCD
Apply `wave-app/k3s/argocd-application-helm.yaml` to sync the Helm chart from Git.
