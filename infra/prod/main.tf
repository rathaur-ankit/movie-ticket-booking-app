module "networking" {
  source = "../modules/networking"

  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  cluster_name         = var.cluster_name
  single_nat_gateway   = var.single_nat_gateway
  tags                 = var.tags
}

module "eks" {
  source = "../modules/eks"

  cluster_name              = var.cluster_name
  cluster_version           = var.cluster_version
  environment               = var.environment
  vpc_id                    = module.networking.vpc_id
  subnet_ids                = module.networking.private_subnet_ids
  endpoint_private_access   = var.endpoint_private_access
  endpoint_public_access    = var.endpoint_public_access
  public_access_cidrs       = var.public_access_cidrs
  enabled_cluster_log_types = var.enabled_cluster_log_types
  node_groups               = var.node_groups
  addons                    = var.addons
  tags                      = var.tags
}
