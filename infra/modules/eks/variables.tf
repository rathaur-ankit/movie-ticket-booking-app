variable "cluster_name" {
  type = string
}

variable "cluster_version" {
  type    = string
  default = "1.30"
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "endpoint_private_access" {
  type    = bool
  default = true
}

variable "endpoint_public_access" {
  type    = bool
  default = true
}

variable "public_access_cidrs" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "enabled_cluster_log_types" {
  type    = list(string)
  default = []
}

variable "node_groups" {
  type = any
}

variable "addons" {
  type    = list(string)
  default = ["vpc-cni", "kube-proxy", "coredns"]
}

variable "tags" {
  type    = map(string)
  default = {}
}
