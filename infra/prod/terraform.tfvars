aws_region  = "us-east-1"
environment = "prod"

vpc_cidr           = "10.2.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

public_subnet_cidrs  = ["10.2.1.0/24", "10.2.2.0/24", "10.2.3.0/24"]
private_subnet_cidrs = ["10.2.10.0/24", "10.2.20.0/24", "10.2.30.0/24"]

cluster_name       = "movie-ticket-prod"
cluster_version    = "1.30"
single_nat_gateway = false

endpoint_private_access = true
endpoint_public_access  = true
public_access_cidrs     = ["0.0.0.0/0"]

enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

node_groups = {
  system = {
    instance_types = ["m5.large"]
    capacity_type  = "ON_DEMAND"
    desired_size   = 2
    min_size       = 2
    max_size       = 4
    disk_size      = 50
    tags = {
      Environment = "prod"
      NodeGroup   = "system"
    }
  }
  apps = {
    instance_types = ["m5.large"]
    capacity_type  = "ON_DEMAND"
    desired_size   = 2
    min_size       = 2
    max_size       = 6
    disk_size      = 100
    tags = {
      Environment = "prod"
      NodeGroup   = "apps"
    }
  }
}

tags = {
  Environment = "prod"
  Project     = "movie-ticket"
  ManagedBy   = "terraform"
}
