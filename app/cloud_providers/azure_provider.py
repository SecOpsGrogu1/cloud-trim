from azure.identity import DefaultAzureCredential
from azure.mgmt.consumption import ConsumptionManagementClient
from azure.mgmt.monitor import MonitorManagementClient
from datetime import datetime, timedelta
from typing import Dict, List
import os

class AzureProvider:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.subscription_id = os.getenv('AZURE_SUBSCRIPTION_ID')
        self.consumption_client = ConsumptionManagementClient(
            self.credential,
            self.subscription_id
        )
        self.monitor_client = MonitorManagementClient(
            self.credential,
            self.subscription_id
        )

    def get_unused_resources(self) -> List[Dict]:
        """Identify unused or underutilized Azure resources."""
        unused_resources = []
        
        # Check VM utilization
        underutilized_vms = self._get_underutilized_vms()
        unused_resources.extend(underutilized_vms)
        
        # Check unused disks
        unused_disks = self._get_unused_disks()
        unused_resources.extend(unused_disks)
        
        return unused_resources

    def get_cost_analysis(self) -> Dict:
        """Get cost analysis for the last 30 days."""
        scope = f"/subscriptions/{self.subscription_id}"
        
        # Get today's date and 30 days ago
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        try:
            usage_details = self.consumption_client.usage_details.list(
                scope=scope,
                expand="properties",
                filter=f"properties/usageStart ge '{start_date.strftime('%Y-%m-%d')}' and properties/usageEnd le '{end_date.strftime('%Y-%m-%d')}'"
            )
            
            cost_data = {
                'total_cost': 0.0,
                'by_service': {},
                'by_location': {},
                'by_resource_group': {}
            }
            
            for usage in usage_details:
                cost = float(usage.properties.pretax_cost)
                service = usage.properties.consumed_service
                location = usage.properties.resource_location
                resource_group = usage.properties.resource_group
                
                cost_data['total_cost'] += cost
                
                # Aggregate by service
                if service not in cost_data['by_service']:
                    cost_data['by_service'][service] = 0
                cost_data['by_service'][service] += cost
                
                # Aggregate by location
                if location not in cost_data['by_location']:
                    cost_data['by_location'][location] = 0
                cost_data['by_location'][location] += cost
                
                # Aggregate by resource group
                if resource_group not in cost_data['by_resource_group']:
                    cost_data['by_resource_group'][resource_group] = 0
                cost_data['by_resource_group'][resource_group] += cost
            
            return cost_data
            
        except Exception as e:
            return {'error': str(e)}

    def _get_underutilized_vms(self) -> List[Dict]:
        """Find VMs with low CPU utilization."""
        results = []
        try:
            # Get list of VMs
            vms = self.monitor_client.virtual_machines.list_all()
            
            for vm in vms:
                cpu_metrics = self._get_vm_cpu_metrics(vm.id)
                if cpu_metrics < 5:  # Less than 5% CPU utilization
                    results.append({
                        'resource_id': vm.id,
                        'resource_type': 'Virtual Machine',
                        'resource_group': vm.resource_group,
                        'location': vm.location,
                        'utilization': cpu_metrics,
                        'recommendation': 'Consider downsizing or stopping this VM',
                    })
        except Exception as e:
            print(f"Error getting VM metrics: {e}")
            
        return results

    def _get_unused_disks(self) -> List[Dict]:
        """Find unused managed disks."""
        # Implementation would involve checking for unattached disks
        # This is a placeholder implementation
        return []

    def _get_vm_cpu_metrics(self, resource_id: str) -> float:
        """Get CPU metrics for a specific VM."""
        try:
            end_time = datetime.now()
            start_time = end_time - timedelta(hours=24)
            
            metrics_data = self.monitor_client.metrics.list(
                resource_id,
                timespan=f"{start_time}/{end_time}",
                interval='PT1H',
                metricnames='Percentage CPU',
                aggregation='Average'
            )
            
            if not metrics_data.value:
                return 0.0
            
            total = 0.0
            count = 0
            for metric in metrics_data.value[0].timeseries:
                for data in metric.data:
                    if data.average is not None:
                        total += data.average
                        count += 1
            
            return total / count if count > 0 else 0.0
            
        except Exception as e:
            print(f"Error getting CPU metrics: {e}")
            return 0.0
