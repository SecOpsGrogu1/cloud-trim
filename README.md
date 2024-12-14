# CloudTrim - Cloud Cost Optimization Platform

An AI-powered SaaS platform that helps companies optimize their cloud spending through intelligent analysis, automation, and real-time monitoring.

## Key Features

### 🤖 Automated Cost Analysis
- Real-time monitoring of cloud resource utilization
- Identification of idle and underutilized resources
- Detailed cost breakdown by service, tag, and department

### 🎯 AI-Driven Right-Sizing
- Machine learning-based resource optimization
- Usage pattern analysis and prediction
- Automated instance type recommendations

### ⏰ Scheduled Shutdowns
- Automated dev/test environment management
- Customizable scheduling rules
- Resource tagging enforcement

### 📊 Interactive Dashboard
- Real-time cost visualization
- Resource utilization metrics
- Historical trend analysis

### 💰 Savings Forecasting
- ML-powered cost prediction
- ROI calculation for optimization recommendations
- Budget tracking and forecasting

### 🔔 Alerts & Notifications
- Cost spike detection
- Custom alert thresholds
- Multi-channel notifications (Email, Slack, etc.)

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Redux for state management
- Chart.js for visualizations

### Backend
- Python 3.11+
- FastAPI for REST API
- SQLAlchemy for ORM
- PostgreSQL for database
- Redis for caching
- Celery for background tasks

### Cloud Provider Support
- AWS (Amazon Web Services)
- Azure (Microsoft Azure)
- GCP (Google Cloud Platform)

## Setup

1. Clone the repository
```bash
git clone https://github.com/SecOpsGrogu1/cloud-trim.git
cd cloud-trim
```

2. Install dependencies:
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your cloud provider credentials and other settings
```

4. Start the services:
```bash
# Backend API
uvicorn app.main:app --reload

# Frontend development server
cd frontend
npm start
```

## Architecture

The application follows a microservices architecture with:
- REST API service for real-time operations
- Background workers for cost analysis and optimization
- ML service for usage pattern analysis
- Notification service for alerts
- Authentication service for user management

## Security

- Cloud credentials managed securely using provider-specific IAM roles
- JWT-based authentication
- HTTPS encryption for all API endpoints
- Regular security audits and updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
