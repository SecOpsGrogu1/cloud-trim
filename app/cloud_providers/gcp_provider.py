from google.cloud import billing
from google.cloud import monitoring_v3
from datetime import datetime, timedelta
from typing import Dict, List
import os

class GCPProvider:
    def __init__(self):
        self.project_id = os.getenv('GCP_PROJECT_ID')
        self.billing_client = billing.CloudBillingClient()
        self.monitoring_client = monitoring_v3.MetricServiceClient()

    def get_unused_resources(self) -> List[Dict]:
        """Identify unused or underutilized GCP resources."""
        unused_resources = []
        
        # Get compute instances with low CPU utilization
        underutilized_instances = self._get_underutilized_instances()
        unused_resources.extend(underutilized_instances)
        
        # Get unused persistent disks
        unused_disks = self._get_unused_disks()
        unused_resources.extend(unused_disks)
        
        return unused_resources

    def get_cost_analysis(self) -> Dict:
        """Get billing data for the last 30 days."""
        billing_account_path = self.billing_client.billing_account_path(
            self.project_id
        )
        
        now = datetime.now()
        start_time = now - timedelta(days=30)
        
        request = billing.GetBillingAccountRequest(
            name=billing_account_path
        )
        
        try:
            response = self.billing_client.get_billing_account(request)
            return {
                'account_id': response.name,
                'display_name': response.display_name,
                'open': response.open,
            }
        except Exception as e:
            return {'error': str(e)}

    def _get_underutilized_instances(self) -> List[Dict]:
        """Find compute instances with low CPU utilization."""
        project_name = f"projects/{self.project_id}"
        
        now = datetime.now()
        seconds = int(now.timestamp())
        interval = monitoring_v3.TimeInterval({
            'end_time': {'seconds': seconds},
            'start_time': {'seconds': seconds - 3600 * 24},  # Last 24 hours
        })
        
        results = []
        try:
            # Example metric for CPU utilization
            metric_type = 'compute.googleapis.com/instance/cpu/utilization'
            request = monitoring_v3.ListTimeSeriesRequest(
                name=project_name,
                filter=f'metric.type = "{metric_type}"',
                interval=interval,
                view=monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
            )
            
            page_result = self.monitoring_client.list_time_series(request)
            for time_series in page_result:
                if self._is_underutilized(time_series):
                    results.append({
                        'resource_id': time_series.resource.labels['instance_id'],
                        'resource_type': 'Compute Instance',
                        'zone': time_series.resource.labels['zone'],
                        'utilization': self._calculate_average_utilization(time_series),
                        'recommendation': 'Consider downsizing or stopping this instance',
                    })
                    
        except Exception as e:
            print(f"Error getting instance metrics: {e}")
            
        return results

    def _get_unused_disks(self) -> List[Dict]:
        """Find unused persistent disks."""
        # Implementation would involve checking for unattached disks
        # This is a placeholder implementation
        return []

    def _is_underutilized(self, time_series) -> bool:
        """Check if a resource is underutilized based on its metrics."""
        avg_utilization = self._calculate_average_utilization(time_series)
        return avg_utilization < 0.05  # Less than 5% utilization

    def _calculate_average_utilization(self, time_series) -> float:
        """Calculate average utilization from a time series."""
        if not time_series.points:
            return 0.0
        
        total = sum(point.value.double_value for point in time_series.points)
        return total / len(time_series.points)
