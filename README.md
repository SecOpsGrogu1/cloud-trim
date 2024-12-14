# AWS Cost Optimizer

An AI-powered SaaS platform that helps companies optimize their AWS cloud spending through intelligent analysis, automation, and real-time monitoring.

## Key Features

### 🤖 Automated Cost Analysis
- Real-time monitoring of AWS resource utilization
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

### AWS Services Used
- AWS Cost Explorer API
- CloudWatch for metrics
- AWS Organizations for multi-account support
- EC2, RDS, and other service APIs

## Setup

1. Clone the repository
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
# Edit .env with your AWS credentials and other settings
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

- AWS credentials managed securely using IAM roles
- JWT-based authentication
- Role-based access control
- Regular security audits
- Encrypted data storage

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
