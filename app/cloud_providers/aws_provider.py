import boto3
from datetime import datetime, timedelta
from typing import Dict, List

class AWSProvider:
    def __init__(self):
        self.ec2 = boto3.client('ec2')
        self.cloudwatch = boto3.client('cloudwatch')
        self.cost_explorer = boto3.client('ce')

    def get_unused_resources(self) -> List[Dict]:
        """Identify unused or underutilized EC2 instances."""
        instances = self._get_running_instances()
        unused_resources = []

        for instance in instances:
            cpu_utilization = self._get_cpu_utilization(instance['InstanceId'])
            if cpu_utilization < 5:  # Less than 5% CPU utilization
                unused_resources.append({
                    'resource_id': instance['InstanceId'],
                    'resource_type': 'EC2',
                    'region': instance.get('Placement', {}).get('AvailabilityZone', ''),
                    'utilization': cpu_utilization,
                    'recommendation': 'Consider stopping or terminating this instance',
                    'potential_savings': self._calculate_potential_savings(instance)
                })

        return unused_resources

    def get_cost_analysis(self) -> Dict:
        """Get cost analysis for the last 30 days."""
        end = datetime.now()
        start = end - timedelta(days=30)
        
        response = self.cost_explorer.get_cost_and_usage(
            TimePeriod={
                'Start': start.strftime('%Y-%m-%d'),
                'End': end.strftime('%Y-%m-%d')
            },
            Granularity='DAILY',
            Metrics=['UnblendedCost']
        )
        
        return response['ResultsByTime']

    def _get_running_instances(self) -> List:
        """Get all running EC2 instances."""
        response = self.ec2.describe_instances(
            Filters=[{'Name': 'instance-state-name', 'Values': ['running']}]
        )
        instances = []
        for reservation in response['Reservations']:
            instances.extend(reservation['Instances'])
        return instances

    def _get_cpu_utilization(self, instance_id: str) -> float:
        """Get average CPU utilization for an instance over the last 24 hours."""
        response = self.cloudwatch.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
            StartTime=datetime.now() - timedelta(hours=24),
            EndTime=datetime.now(),
            Period=3600,
            Statistics=['Average']
        )
        
        if not response['Datapoints']:
            return 0.0
        
        return sum(point['Average'] for point in response['Datapoints']) / len(response['Datapoints'])

    def _calculate_potential_savings(self, instance: Dict) -> float:
        """Calculate potential monthly savings from stopping an instance."""
        # This is a simplified calculation
        instance_type = instance.get('InstanceType', '')
        # In a real implementation, you would look up actual pricing data
        # This is just a placeholder
        hourly_rate = 0.10  # Example rate
        return hourly_rate * 24 * 30  # Monthly cost
