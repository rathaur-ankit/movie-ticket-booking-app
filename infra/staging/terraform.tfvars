aws_region  = "us-east-1"
environment = "staging"

vpc_cidr           = "10.1.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

public_subnet_cidrs  = ["10.1.1.0/24", "10.1.2.0/24"]
private_subnet_cidrs = ["10.1.10.0/24", "10.1.20.0/24"]

cluster_name       = "movie-ticket-staging"
cluster_version    = "1.30"
single_nat_gateway = true

endpoint_private_access = true
endpoint_public_access  = true
public_access_cidrs     = ["0.0.0.0/0"]

enabled_cluster_log_types = []

node_groups = {
  general = {
    instance_types = ["t3.large"]
    capacity_type  = "ON_DEMAND"
    desired_size   = 2
    min_size       = 1
    max_size       = 3
    disk_size      = 50
    tags = {
      Environment = "staging"
      NodeGroup   = "general"
    }
  }
}

tags = {
  Environment = "staging"
  Project     = "movie-ticket"
  ManagedBy   = "terraform"
}
