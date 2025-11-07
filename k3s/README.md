This folder contains Kubernetes manifests for local k3s testing.

## ⚠️ Secrets Configuration

**IMPORTANT:** Never commit `supabase-secret.yaml` to Git!

1. Copy the example file:
   ```bash
   cp supabase-secret.yaml.example supabase-secret.yaml
   ```

2. Edit `supabase-secret.yaml` and add your actual Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase service role key

3. Apply the secret:
   ```bash
   kubectl apply -f supabase-secret.yaml
   ```

The secret is referenced by `backend-deployment.yaml` and will be mounted as environment variables in the backend pod.

## Building and Deploying

If you build images locally and want k3s to use them, follow one of these options:

1) Import images into k3s containerd (recommended for local k3s):

```bash
# build images with names expected by manifests
docker build -t wave-app-frontend:latest ../frontend
docker build -t wave-app-backend:latest ../backend

# save and import into k3s
docker save wave-app-frontend:latest -o frontend.tar
docker save wave-app-backend:latest -o backend.tar

# import into k3s (may need sudo)
sudo k3s ctr images import frontend.tar
sudo k3s ctr images import backend.tar

# apply manifests
kubectl apply -f .
```

2) Push to a registry (DockerHub or private) and update manifests' image fields:

```bash
docker tag wave-app-frontend:latest myrepo/wave-app-frontend:latest
docker push myrepo/wave-app-frontend:latest
# update k3s/frontend-deployment.yaml -> image: myrepo/wave-app-frontend:latest
```

3) Alternative: run the cluster with --disable-agent image pulling settings and use local dockerd as registry (advanced).

Ports to note:
- Frontend nginx listens on 8080. The Service in `frontend-deployment.yaml` uses NodePort 30080 -> access via node:30080.
- Backend listens on 4000.
