# Micro-Apprenticeship Platform

A full-stack application connecting companies with learners through task-based micro-apprenticeships. The platform uses AI-powered milestone generation and automated code review to guide learners through real-world projects.

## Features

- **Company Dashboard**: Create and manage task-based apprenticeships  
- **User Dashboard**: Browse tasks, receive AI-generated learning paths, and submit solutions  
- **AI-Powered Learning**: Automated milestone generation based on user skills  
- **Intelligent Code Review**: AI feedback on milestone and final submissions  
- **Progress Tracking**: Visual progress indicators and completion tracking  
- **Submission Management**: Top submissions leaderboard for each task  

## Architecture

## AWS System
![AWS solution architecture](https://github.com/user-attachments/assets/1b6cd2a2-cea9-472d-b747-f75ae33f614c)

### Frontend
- React with TypeScript  
- Tailwind CSS + shadcn/ui components  
- Vite build system  

### Backend
- AWS Lambda functions (Python 3.x)  
- Amazon DynamoDB for data storage  
- Amazon S3 for file submissions  
- Amazon Bedrock for AI/LLM integration  
- API Gateway for REST endpoints  

## Prerequisites

- Node.js 18+ and npm/yarn  
- Python 3.9+  
- AWS account (all resources already configured on AWS)  

## Environment Setup

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd microApprenticeship
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Backend Setup

The backend is fully configured on AWS (Lambda, DynamoDB, S3, Bedrock, API Gateway). [Lambda Functions are listed for reference]
No local configuration is required beyond ensuring AWS credentials are available.  

## Development

### Running Locally

```bash
# Frontend
npm run dev
```

### Building for Production

```bash
# Frontend
npm run build

# Deploy to S3 + CloudFront
aws s3 sync dist/ s3://your-frontend-bucket
```

## Usage Flow

### Company Workflow
1. Navigate to Company Dashboard  
2. Click "Create Task" and fill details (title, description, reward, duration, skills)  
3. View submissions and scores on task cards  

### User Workflow
1. Enter profile information (name, username, skills)  
2. Browse available tasks  
3. Select a task to receive AI-generated milestones  
4. Complete each milestone:  
   - Upload solution file  
   - Receive AI feedback and score  
   - Score must be ≥80 to pass  
5. Submit final project after completing all milestones  
6. Final score ≥80 required to submit to company  

## AI Integration

### Milestone Generation
Uses Amazon Bedrock Agent to analyze:
- User skill level and background  
- Task requirements  
- Available learning resources (Manara Knowledge Base)  

Generates structured learning path with:
- Sequential milestones  
- Action items  
- Recommended resources  

### Code Review
Uses Claude 3 Sonnet via Bedrock to evaluate:
- Relevance to task requirements  
- Code correctness and quality  
- Completeness and effort  
- Provides feedback and score (0-100)  
