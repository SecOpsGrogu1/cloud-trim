import boto3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class AWSService:
    def __init__(self):
        self.ec2 = boto3.client('ec2')
        self.cloudwatch = boto3.client('cloudwatch')
        self.cost_explorer = boto3.client('ce')
        self.rds = boto3.client('rds')

    async def get_cost_and_usage(self, start_date: datetime, end_date: datetime) -> Dict:
        """Get detailed cost and usage data from AWS Cost Explorer."""
        try:
            response = self.cost_explorer.get_cost_and_usage(
                TimePeriod={
                    'Start': start_date.strftime('%Y-%m-%d'),
                    'End': end_date.strftime('%Y-%m-%d')
                },
                Granularity='DAILY',
                Metrics=['UnblendedCost', 'UsageQuantity'],
                GroupBy=[
                    {'Type': 'DIMENSION', 'Key': 'SERVICE'},
                    {'Type': 'TAG', 'Key': 'Environment'}
                ]
            )
            return response
        except ClientError as e:
            logger.error(f"Error getting cost and usage: {str(e)}")
            raise

    async def get_optimization_recommendations(self) -> List[Dict]:
        """Get cost optimization recommendations."""
        recommendations = []
        
        # Check EC2 instances
        ec2_recommendations = await self._get_ec2_recommendations()
        recommendations.extend(ec2_recommendations)
        
        # Check RDS instances
        rds_recommendations = await self._get_rds_recommendations()
        recommendations.extend(rds_recommendations)
        
        return recommendations

    async def _get_ec2_recommendations(self) -> List[Dict]:
        """Analyze EC2 instances for optimization opportunities."""
        try:
            instances = self.ec2.describe_instances()
            recommendations = []

            for reservation in instances['Reservations']:
                for instance in reservation['Instances']:
                    instance_id = instance['InstanceId']
                    
                    # Get CPU utilization
                    cpu_metrics = await self._get_instance_cpu_metrics(instance_id)
                    
                    # Get memory utilization
                    memory_metrics = await self._get_instance_memory_metrics(instance_id)
                    
                    if cpu_metrics['average'] < 20 and memory_metrics['average'] < 20:
                        current_type = instance['InstanceType']
                        recommended_type = self._suggest_instance_type(current_type, cpu_metrics, memory_metrics)
                        
                        if recommended_type != current_type:
                            recommendations.append({
                                'resource_id': instance_id,
                                'resource_type': 'EC2',
                                'current_config': current_type,
                                'recommended_config': recommended_type,
                                'reason': 'Low utilization',
                                'estimated_savings': await self._calculate_ec2_savings(current_type, recommended_type),
                                'metrics': {
                                    'cpu_utilization': cpu_metrics,
                                    'memory_utilization': memory_metrics
                                }
                            })

            return recommendations
        except ClientError as e:
            logger.error(f"Error analyzing EC2 instances: {str(e)}")
            raise

    async def _get_rds_recommendations(self) -> List[Dict]:
        """Analyze RDS instances for optimization opportunities."""
        try:
            instances = self.rds.describe_db_instances()
            recommendations = []

            for instance in instances['DBInstances']:
                instance_id = instance['DBInstanceIdentifier']
                
                # Get CPU utilization
                cpu_metrics = await self._get_rds_cpu_metrics(instance_id)
                
                # Get storage utilization
                storage_metrics = await self._get_rds_storage_metrics(instance_id)
                
                if cpu_metrics['average'] < 20:
                    current_class = instance['DBInstanceClass']
                    recommended_class = self._suggest_rds_class(current_class, cpu_metrics)
                    
                    if recommended_class != current_class:
                        recommendations.append({
                            'resource_id': instance_id,
                            'resource_type': 'RDS',
                            'current_config': current_class,
                            'recommended_config': recommended_class,
                            'reason': 'Low CPU utilization',
                            'estimated_savings': await self._calculate_rds_savings(current_class, recommended_class),
                            'metrics': {
                                'cpu_utilization': cpu_metrics,
                                'storage_utilization': storage_metrics
                            }
                        })

            return recommendations
        except ClientError as e:
            logger.error(f"Error analyzing RDS instances: {str(e)}")
            raise

    async def _get_instance_cpu_metrics(self, instance_id: str) -> Dict:
        """Get CPU utilization metrics for an EC2 instance."""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=7)
        
        response = self.cloudwatch.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
            StartTime=start_time,
            EndTime=end_time,
            Period=3600,
            Statistics=['Average', 'Maximum']
        )
        
        datapoints = response['Datapoints']
        if not datapoints:
            return {'average': 0, 'maximum': 0}
            
        return {
            'average': sum(d['Average'] for d in datapoints) / len(datapoints),
            'maximum': max(d['Maximum'] for d in datapoints)
        }

    async def _get_instance_memory_metrics(self, instance_id: str) -> Dict:
        """Get memory utilization metrics for an EC2 instance."""
        # Note: This requires CloudWatch agent to be installed on the instance
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=7)
        
        try:
            response = self.cloudwatch.get_metric_statistics(
                Namespace='CWAgent',
                MetricName='mem_used_percent',
                Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
                StartTime=start_time,
                EndTime=end_time,
                Period=3600,
                Statistics=['Average', 'Maximum']
            )
            
            datapoints = response['Datapoints']
            if not datapoints:
                return {'average': 0, 'maximum': 0}
                
            return {
                'average': sum(d['Average'] for d in datapoints) / len(datapoints),
                'maximum': max(d['Maximum'] for d in datapoints)
            }
        except ClientError:
            # Memory metrics might not be available if CloudWatch agent is not installed
            return {'average': 0, 'maximum': 0}

    def _suggest_instance_type(self, current_type: str, cpu_metrics: Dict, memory_metrics: Dict) -> str:
        """Suggest an EC2 instance type based on utilization metrics."""
        # This is a simplified version. In production, you would want a more sophisticated algorithm
        # that takes into account instance family features, pricing, and regional availability
        
        instance_families = {
            't3': ['nano', 'micro', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
            't4g': ['nano', 'micro', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
            'm5': ['large', 'xlarge', '2xlarge', '4xlarge', '8xlarge', '12xlarge', '16xlarge'],
            'c5': ['large', 'xlarge', '2xlarge', '4xlarge', '8xlarge', '12xlarge', '16xlarge']
        }
        
        current_family = ''.join(filter(str.isalpha, current_type))
        current_size = ''.join(filter(str.isalnum, current_type.replace(current_family, '')))
        
        if current_family not in instance_families:
            return current_type
            
        sizes = instance_families[current_family]
        current_index = sizes.index(current_size)
        
        # If utilization is very low, suggest going down one size
        if cpu_metrics['maximum'] < 50 and memory_metrics['maximum'] < 50 and current_index > 0:
            return f"{current_family}.{sizes[current_index - 1]}"
            
        return current_type

    async def _calculate_ec2_savings(self, current_type: str, recommended_type: str) -> float:
        """Calculate estimated monthly savings from EC2 instance type change."""
        # This is a simplified calculation. In production, you would want to:
        # 1. Use actual pricing API
        # 2. Consider reserved instance pricing
        # 3. Account for regional price differences
        # 4. Include potential savings from reduced EBS costs
        
        # Placeholder pricing dictionary (USD per hour)
        pricing = {
            't3.micro': 0.0104,
            't3.small': 0.0208,
            't3.medium': 0.0416,
            't3.large': 0.0832,
            't3.xlarge': 0.1664,
            't3.2xlarge': 0.3328
        }
        
        current_price = pricing.get(current_type, 0)
        recommended_price = pricing.get(recommended_type, 0)
        
        # Calculate monthly savings (assuming 730 hours per month)
        monthly_savings = (current_price - recommended_price) * 730
        
        return round(monthly_savings, 2)
